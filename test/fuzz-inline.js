const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const dcc32 = `"C:\\Program Files (x86)\\Embarcadero\\Studio\\37.0\\bin\\dcc32.EXE"`;
const tempFile = 'tmp/fuzz_inline_temp.pas';
const corpusFile = 'test/corpus/diabolical-inline.txt';

function createDelphiProgram(body) {
    return `
program FuzzInline;
{$APPTYPE CONSOLE}
var
  G: Integer;
begin
  ${body}
end.
`;
}

function genInlineWithOracle(depth) {
    if (depth <= 0) {
        return { code: "G := 1;", expected: "(assignment (identifier) (kAssign) (literalNumber))" };
    }
    
    const choice = Math.floor(Math.random() * 3);
    if (choice === 0) { // Inline var with type
        const id = `V${Math.floor(Math.random()*1000)}`;
        return {
            code: `var ${id}: Integer := 10;`,
            expected: `(assignment (varAssignDef (kVar) (identifier) (typeref (identifier))) (kAssign) (literalNumber))`
        };
    } else if (choice === 1) { // Inline var inference
        const id = `V${Math.floor(Math.random()*1000)}`;
        return {
            code: `var ${id} := 20;`,
            expected: `(assignment (varAssignDef (kVar) (identifier)) (kAssign) (literalNumber))`
        };
    } else { // for var in
        return {
            code: `for var I := 0 to 10 do G := I;`,
            expected: `(for (kFor) (assignment (varAssignDef (kVar) (identifier)) (kAssign) (literalNumber)) (kTo) (literalNumber) (kDo) (statement (assignment (identifier) (kAssign) (identifier))))`
        };
    }
}

const uniqueResults = new Map();
let totalGenerated = 0;

console.log("1. Validating toolchain...");
const knownGood = createDelphiProgram("var I := 10; for var J := 0 to 5 do G := I + J;");
fs.writeFileSync(tempFile, knownGood);
try {
    execSync(`${dcc32} -B -CC -W- -H- ${tempFile}`, { stdio: 'pipe' });
    console.log("   [PASS] Toolchain is valid.");
} catch (e) {
    console.error("   [FAIL] Toolchain validation failed!");
    console.error(e.stdout ? e.stdout.toString() : e.message);
    process.exit(1);
}

console.log("2. Fuzzing Inline Vars and Otherwise with Oracle...");
for (let i = 0; i < 300; i++) {
    totalGenerated++;
    const oracle = genInlineWithOracle(Math.floor(Math.random() * 2));
    const fullCode = oracle.code;
    
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
    const fullExpected = `(root (defProc (declProc (kProcedure) (identifier)) (block (kBegin) ${expected} (kEnd))))`;
    corpusContent += `===\nFuzzed Inline ${testId++}\n===\nprocedure Test;\nbegin\n  ${code}\nend;\n---\n${fullExpected}\n\n`;
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
        
        const fullExpected = `(root (defProc (declProc (kProcedure) (identifier)) (block (kBegin) ${expectedAST} (kEnd))))`
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
if (fs.existsSync('fuzz_inline_temp.exe')) fs.unlinkSync('fuzz_inline_temp.exe');
