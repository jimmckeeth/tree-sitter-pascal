const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const dcc32 = `"C:\\Program Files (x86)\\Embarcadero\\Studio\\37.0\\bin\\dcc32.EXE"`;
const tempFile = 'tmp/fuzz_logical_temp.pas';
const corpusFile = 'test/corpus/diabolical-logical.txt';

function createDelphiProgram(body) {
    return `
program FuzzLogical;
{$APPTYPE CONSOLE}
type
  TMyClass = class end;
var
  A, B, C, D: Integer;
  Obj: TObject;
  BVal: Boolean;
begin
  A := 1; B := 2; C := 3; D := 4;
  Obj := TMyClass.Create;
  ${body}
end.
`;
}

function genLogicalWithOracle(depth) {
    if (depth <= 0) {
        return { code: 'BVal', expected: '(identifier)' };
    }
    
    const choice = Math.floor(Math.random() * 5);
    if (choice === 0) { // is not
        return {
            code: `(Obj is not TMyClass)`,
            expected: `(exprParens (exprBinary (identifier) (kIsNot) (identifier)))`
        };
    } else if (choice === 1) { // not in
        return {
            code: `(A not in [1, 2, 3])`,
            expected: `(exprParens (exprBinary (identifier) (kNotIn) (exprBrackets (literalNumber) (literalNumber) (literalNumber))))`
        };
    } else if (choice === 2) { // and / or
        const left = genLogicalWithOracle(depth - 1);
        const right = genLogicalWithOracle(depth - 1);
        const op = Math.random() < 0.5 ? 'and' : 'or';
        const kOp = op === 'and' ? '(kAnd)' : '(kOr)';
        return {
            code: `(${left.code} ${op} ${right.code})`,
            expected: `(exprParens (exprBinary ${left.expected} ${kOp} ${right.expected}))`
        };
    } else if (choice === 3) { // not
        const inner = genLogicalWithOracle(depth - 1);
        return {
            code: `(not ${inner.code})`,
            expected: `(exprParens (exprUnary (kNot) ${inner.expected}))`
        };
    } else {
        return { code: 'True', expected: '(kTrue)' };
    }
}

const uniqueResults = new Map();
let totalGenerated = 0;

console.log("1. Validating toolchain...");
const knownGood = createDelphiProgram("BVal := (Obj is not TMyClass) and (A not in [1]);");
fs.writeFileSync(tempFile, knownGood);
try {
    execSync(`${dcc32} -B -CC -W- -H- ${tempFile}`, { stdio: 'ignore' });
    console.log("   [PASS] Toolchain is valid.");
} catch (e) {
    console.error("   [FAIL] Toolchain validation failed!");
    process.exit(1);
}

console.log("2. Fuzzing Logical Operators with Oracle...");
for (let i = 0; i < 300; i++) {
    totalGenerated++;
    const oracle = genLogicalWithOracle(Math.floor(Math.random() * 3) + 1);
    const fullCode = `BVal := ${oracle.code};`;
    
    if (uniqueResults.has(fullCode)) continue;

    fs.writeFileSync(tempFile, createDelphiProgram(fullCode));
    try {
        execSync(`${dcc32} -B -CC -W- -H- ${tempFile}`, { stdio: 'ignore' });
        uniqueResults.set(fullCode, oracle.expected);
        process.stdout.write('+');
    } catch (e) {
        process.stdout.write('.');
    }
}

console.log(`\n\nGenerated: ${totalGenerated}`);
console.log(`Compiling (Unique): ${uniqueResults.size}`);

// 3. Write corpus
let corpusContent = "";
let testId = 1;
uniqueResults.forEach((expected, code) => {
    const fullExpected = `(root (defProc (declProc (kProcedure) (identifier)) (block (kBegin) (assignment (identifier) (kAssign) ${expected}) (kEnd))))`;
    corpusContent += `===\nFuzzed Logical ${testId++}\n===\nprocedure Test;\nbegin\n  ${code}\nend;\n---\n${fullExpected}\n\n`;
});
fs.writeFileSync(corpusFile, corpusContent);

console.log(`\n3. Running Tree-sitter Comparison...`);
let passCount = 0;
let failCount = 0;

uniqueResults.forEach((expectedAST, code) => {
    const testCode = `procedure Test; begin ${code} end;`;
    fs.writeFileSync('temp_parse.pas', testCode);
    
    try {
        const output = execSync(`npx tree-sitter parse temp_parse.pas`, { encoding: 'utf8' }).trim();
        const actualAST = output.replace(/\s*\[\d+,\s*\d+\]\s*-\s*\[\d+,\s*\d+\]/g, '')
                                .replace(/\w+:\s+/g, '')
                                .replace(/\s+/g, ' ')
                                .replace(/\(root\(/g, '(root (')
                                .trim();
        
        const fullExpected = `(root (defProc (declProc (kProcedure) (identifier)) (block (kBegin) (assignment (identifier) (kAssign) ${expectedAST}) (kEnd))))`
                                .replace(/\s+/g, ' ')
                                .trim();

        if (actualAST === fullExpected && !actualAST.includes('ERROR') && !actualAST.includes('MISSING')) {
            passCount++;
        } else {
            failCount++;
        }
    } catch (e) {
        failCount++;
    }
});

console.log("\nDIABOLICAL REPORT");
console.log("=================");
console.log(`Generated:         ${totalGenerated}`);
console.log(`Compiled (Valid):  ${uniqueResults.size}`);
console.log(`Matched Oracle:    ${passCount}`);
console.log(`Mismatched Oracle: ${failCount}`);

const yieldRate = (uniqueResults.size / totalGenerated) * 100;
const failRate = (failCount / uniqueResults.size) * 100;

console.log(`\nYield Rate:        ${yieldRate.toFixed(1)}% (Target: >20%)`);
console.log(`Grammar Fail Rate: ${failRate.toFixed(1)}% (Target: >20%)`);

// Cleanup
if (fs.existsSync('temp_parse.pas')) fs.unlinkSync('temp_parse.pas');
if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
if (fs.existsSync('fuzz_logical_temp.exe')) fs.unlinkSync('fuzz_logical_temp.exe');
