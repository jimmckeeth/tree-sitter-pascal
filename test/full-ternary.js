const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const dcc32 = `"C:\\Program Files (x86)\\Embarcadero\\Studio\\37.0\\bin\\dcc32.EXE"`;
const tempFile = 'fuzz_ternary_temp.pas';
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

function genTernary(depth) {
    if (depth <= 0) return ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
    
    const cond = [`(A < B)`, `(C > D)`, `True`, `False`][Math.floor(Math.random() * 4)];
    const val1 = genTernary(depth - 1);
    const val2 = genTernary(depth - 1);
    
    const choice = Math.floor(Math.random() * 3);
    if (choice === 0) return `if ${cond} then ${val1} else ${val2}`;
    if (choice === 1) return `(if ${cond} then ${val1} else ${val2})`;
    return `${val1} + ${val2}`; // Mix in some math to test precedence
}

const uniqueCompilingCode = new Set();
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

console.log("2. Fuzzing Ternary Expressions...");
for (let i = 0; i < 500; i++) {
    totalGenerated++;
    const expr = genTernary(Math.floor(Math.random() * 5) + 1);
    const code = `Result := ${expr};`;
    
    if (uniqueCompilingCode.has(code)) continue;

    fs.writeFileSync(tempFile, createDelphiProgram(code));
    try {
        execSync(`${dcc32} -B -CC -W- -H- ${tempFile}`, { stdio: 'ignore' });
        uniqueCompilingCode.add(code);
        process.stdout.write('+');
    } catch (e) {
        process.stdout.write('.');
    }
}

console.log(`\n\nGenerated: ${totalGenerated}`);
console.log(`Compiling (Unique): ${uniqueCompilingCode.size}`);

// 3. Prepare corpus
let corpusContent = "";
let testId = 1;
uniqueCompilingCode.forEach(code => {
    corpusContent += `===\nFuzzed Ternary ${testId++}\n===\nprocedure Test;\nbegin\n  ${code}\nend;\n---\n\n`;
});
fs.writeFileSync(corpusFile, corpusContent);

console.log(`\n3. Running Tree-sitter tests...`);
let passCount = 0;
let failCount = 0;

uniqueCompilingCode.forEach((code, index) => {
    const testName = `Fuzzed Ternary ${index + 1}`;
    // We use 'tree-sitter parse' to check for (ERROR) nodes
    const testCode = `procedure Test; begin ${code} end;`;
    fs.writeFileSync('temp_parse.pas', testCode);
    
    try {
        const output = execSync(`npx tree-sitter parse temp_parse.pas`, { encoding: 'utf8' });
        if (output.includes('ERROR') || output.includes('MISSING')) {
            failCount++;
        } else {
            passCount++;
        }
    } catch (e) {
        failCount++;
    }
});

console.log("\nDIABOLICAL REPORT");
console.log("=================");
console.log(`Generated:         ${totalGenerated}`);
console.log(`Compiled (Valid):  ${uniqueCompilingCode.size}`);
console.log(`Passed Parser:     ${passCount}`);
console.log(`Failed Parser:     ${failCount}`);

if (failCount > 0) {
    console.log("\n[RESULT] SUCCESS: Found " + failCount + " cases where valid Delphi code failed the parser!");
} else {
    console.log("\n[RESULT] FAILURE: Parser passed everything. Fuzzer was not diabolical enough.");
}

// Cleanup
if (fs.existsSync('temp_parse.pas')) fs.unlinkSync('temp_parse.pas');
if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
if (fs.existsSync('fuzz_ternary_temp.exe')) fs.unlinkSync('fuzz_ternary_temp.exe');
