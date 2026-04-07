const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const dcc32 = `"C:\\Program Files (x86)\\Embarcadero\\Studio\\37.0\\bin\\dcc32.EXE"`;
const tempFile = 'tmp/fuzz_multiline_temp.pas';
const corpusFile = 'test/corpus/diabolical-multiline.txt';

function createDelphiProgram(body) {
    return `
program FuzzMultiline;
{$APPTYPE CONSOLE}
var
  S: string;
  A, B: Integer;
begin
  ${body}
end.
`;
}

/**
 * The Oracle: Generates both Code and its Expected Tree-sitter S-expression
 */
function genMultilineWithOracle() {
    const contents = [
        "",
        "Hello World",
        "Line 1\nLine 2",
        "Contains 'single quotes'",
        "Contains ''double quotes''",
        "Contains keywords: if then else begin end",
        "   Indented content",
        "\n\n\nMultiple newlines\n\n\n",
        "'''" // This should fail if just put in, but we want to see if we can escape it or if it's invalid
    ];
    
    const content = contents[Math.floor(Math.random() * contents.length)];
    
    // We avoid generating three single quotes in a row inside the content as that ends the literal
    const sanitizedContent = content.replace(/'''/g, "'' '"); 
    
    const code = `'''${sanitizedContent}'''`;
    const expected = sanitizedContent === "" 
        ? `(literalStringMultiline)` 
        : `(literalStringMultiline (stringContent))`;
        
    return { code, expected };
}

function genComplexExpr(depth) {
    if (depth <= 0) {
        if (Math.random() < 0.5) {
            return genMultilineWithOracle();
        } else {
            return { code: "'normal string'", expected: "(literalString)" };
        }
    }
    
    const choice = Math.floor(Math.random() * 3);
    if (choice === 0) { // Concatenation
        const left = genComplexExpr(depth - 1);
        const right = genComplexExpr(depth - 1);
        return {
            code: `${left.code} + ${right.code}`,
            expected: `(exprBinary ${left.expected} (kAdd) ${right.expected})`
        };
    } else if (choice === 1) { // Ternary with multiline
        const left = genComplexExpr(depth - 1);
        const right = genComplexExpr(depth - 1);
        return {
            code: `if True then ${left.code} else ${right.code}`,
            expected: `(exprIf (kIf) (kTrue) (kThen) ${left.expected} (kElse) ${right.expected})`
        };
    } else {
        return genMultilineWithOracle();
    }
}

const uniqueResults = new Map();
let totalGenerated = 0;

console.log("1. Validating toolchain...");
const knownGood = createDelphiProgram("S := '''Initial test''';");
fs.writeFileSync(tempFile, knownGood);
try {
    execSync(`${dcc32} -B -CC -W- -H- ${tempFile}`, { stdio: 'ignore' });
    console.log("   [PASS] Toolchain is valid.");
} catch (e) {
    console.error("   [FAIL] Toolchain validation failed!");
    process.exit(1);
}

console.log("2. Fuzzing Multi-line Strings with Oracle...");
for (let i = 0; i < 300; i++) {
    totalGenerated++;
    const oracle = genComplexExpr(Math.floor(Math.random() * 3));
    const fullCode = `S := ${oracle.code};`;
    
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
    corpusContent += `===\nFuzzed Multiline ${testId++}\n===\nprocedure Test;\nbegin\n  ${code}\nend;\n---\n${fullExpected}\n\n`;
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
                                .replace(/\w+:\s+/g, '') // Strip field labels like "name: "
                                .replace(/\s+/g, ' ')
                                .replace(/\(root\(/g, '(root (') // Standardize root start
                                .trim();
        
        const fullExpected = `(root (defProc (declProc (kProcedure) (identifier)) (block (kBegin) (assignment (identifier) (kAssign) ${expectedAST}) (kEnd))))`
                                .replace(/\s+/g, ' ')
                                .trim();

        if (actualAST === fullExpected && !actualAST.includes('ERROR') && !actualAST.includes('MISSING')) {
            passCount++;
        } else {
            if (failCount === 0) {
                console.log("\nFIRST MISMATCH DEBUG:");
                console.log("CODE:     ", testCode);
                console.log("EXPECTED: ", fullExpected);
                console.log("ACTUAL:   ", actualAST);
            }
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
if (fs.existsSync('fuzz_multiline_temp.exe')) fs.unlinkSync('fuzz_multiline_temp.exe');
