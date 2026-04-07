const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const dcc32 = `"C:\\Program Files (x86)\\Embarcadero\\Studio\\37.0\\bin\\dcc32.EXE"`;
const tempFile = 'tmp/fuzz_ternary_temp.pas';
const corpusFile = 'test/corpus/diabolical-ternary.txt';

function createDelphiProgram(body) {
    return `
program FuzzTernary;
{$APPTYPE CONSOLE}
var
  A, B, C, D, Result: Integer;
begin
  A := 1; B := 2; C := 3; D := 4;
  ${body}
end.
`;
}

/**
 * The Oracle: Generates both Code and its Expected Tree-sitter S-expression
 */
function genTernaryWithOracle(depth) {
    if (depth <= 0) {
        const id = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
        return {
            code: id,
            expected: `(identifier)`
        };
    }
    
    const choice = Math.floor(Math.random() * 3);
    
    if (choice === 0) { // exprIf
        const cond = [`(A < B)`, `(C > D)`, `True`, `False`][Math.floor(Math.random() * 4)];
        // Simplified mapping for the oracle's expectation of standard conditions
        const condExpected = cond.includes('<') ? `(exprBinary (identifier) (kLt) (identifier))` :
                             cond.includes('>') ? `(exprBinary (identifier) (kGt) (identifier))` :
                             cond === 'True' ? `(kTrue)` : `(kFalse)`;
        
        const v1 = genTernaryWithOracle(depth - 1);
        const v2 = genTernaryWithOracle(depth - 1);
        
        return {
            code: `if ${cond} then ${v1.code} else ${v2.code}`,
            expected: `(exprIf (kIf) ${condExpected} (kThen) ${v1.expected} (kElse) ${v2.expected})`
        };
    } else if (choice === 1) { // exprParens
        const inner = genTernaryWithOracle(depth - 1);
        return {
            code: `(${inner.code})`,
            expected: `(exprParens ${inner.expected})`
        };
    } else { // exprBinary (+)
        const left = genTernaryWithOracle(depth - 1);
        const right = genTernaryWithOracle(depth - 1);
        // Ternary has lowest precedence, so A + (if B then C else D) should be (exprBinary ... (exprIf))
        return {
            code: `${left.code} + ${right.code}`,
            expected: `(exprBinary ${left.expected} (kAdd) ${right.expected})`
        };
    }
}

const uniqueResults = new Map(); // code -> expectedAST
let totalGenerated = 0;

console.log("1. Validating toolchain...");
const knownGood = createDelphiProgram('Result := if A < B then C else D;');
fs.writeFileSync(tempFile, knownGood);
try {
    execSync(`${dcc32} -B -CC -W- -H- ${tempFile}`, { stdio: 'ignore' });
    console.log("   [PASS] Toolchain is valid.");
} catch (e) {
    console.error("   [FAIL] Toolchain validation failed!");
    process.exit(1);
}

console.log("2. Fuzzing Ternary Expressions with Oracle...");
for (let i = 0; i < 500; i++) {
    totalGenerated++;
    const oracle = genTernaryWithOracle(Math.floor(Math.random() * 4) + 1);
    const fullCode = `Result := ${oracle.code};`;
    
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

// 3. Write corpus with Oracle's expectations
let corpusContent = "";
let testId = 1;
uniqueResults.forEach((expected, code) => {
    // Wrap the expected AST in the root/defProc/block structure tree-sitter expects
    const fullExpected = `(root (defProc (declProc (kProcedure) (identifier)) (block (kBegin) (assignment (identifier) (kAssign) ${expected}) (kEnd))))`;
    corpusContent += `===\nFuzzed Ternary ${testId++}\n===\nprocedure Test;\nbegin\n  ${code}\nend;\n---\n${fullExpected}\n\n`;
});
fs.writeFileSync(corpusFile, corpusContent);

console.log(`\n3. Running Tree-sitter Comparison...`);
let passCount = 0;
let failCount = 0;

// Note: Instead of running full 'npm test', we parse manually to compare against Oracle
uniqueResults.forEach((expectedAST, code) => {
    const testCode = `procedure Test; begin ${code} end;`;
    fs.writeFileSync('temp_parse.pas', testCode);
    
    try {
        const output = execSync(`npx tree-sitter parse temp_parse.pas`, { encoding: 'utf8' }).trim();
        
        // Clean up Tree-sitter output (remove line ranges [0,0] etc, and fields name:)
        const actualAST = output.replace(/\s*\[\d+,\s*\d+\]\s*-\s*\[\d+,\s*\d+\]/g, '')
                                .replace(/\w+:\s+/g, '') // Strip field labels like "name: "
                                .replace(/\s+/g, ' ')
                                .replace(/\(root\(/g, '(root (') // Standardize root start
                                .trim();
        
        // Construct the expected full AST for comparison
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

if (failCount > 0) {
    console.log("\n[RESULT] SUCCESS: Exposed " + failCount + " cases where the parser and oracle disagreed!");
} else {
    console.log("\n[RESULT] FAILURE: Parser matches Oracle perfectly. Increase Diabolical Factor.");
}

// Cleanup
if (fs.existsSync('temp_parse.pas')) fs.unlinkSync('temp_parse.pas');
if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
if (fs.existsSync('fuzz_ternary_temp.exe')) fs.unlinkSync('fuzz_ternary_temp.exe');
