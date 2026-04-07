const fs = require('fs');
const { execSync } = require('child_process');

const dcc32 = `"C:\\Program Files (x86)\\Embarcadero\\Studio\\37.0\\bin\\dcc32.EXE"`;
const tempFile = 'fuzz_temp.pas';
const corpusFile = 'test/corpus/modern_delphi_diabolical.txt';

function genExpr(type, depth) {
    if (depth <= 0) {
        if (type === 'Int') return ['A', 'B', 'C', 'D', '1', '100'][Math.floor(Math.random()*6)];
        if (type === 'Bool') return ['True', 'False', '(A < B)', '(C = D)', '(ObjA is TMyClass)'][Math.floor(Math.random()*5)];
        if (type === 'Obj') return ['ObjA', 'ObjB', 'TMyClass.Create'][Math.floor(Math.random()*3)];
        if (type === 'Set') return ['[1, 2]', '[A..B]', '[]'][Math.floor(Math.random()*3)];
    }

    const choices = [];
    if (type === 'Int') {
        choices.push(
            () => `(${genExpr('Int', depth-1)} + ${genExpr('Int', depth-1)})`,
            () => `(${genExpr('Int', depth-1)} * ${genExpr('Int', depth-1)})`,
            () => `if ${genExpr('Bool', depth-1)} then ${genExpr('Int', depth-1)} else ${genExpr('Int', depth-1)}`,
            () => `Integer(${genExpr('Int', depth-1)})`,
            () => `(if ${genExpr('Bool', depth-1)} then ${genExpr('Int', depth-1)} else ${genExpr('Int', depth-1)}) + ${genExpr('Int', depth-1)}`
        );
    } else if (type === 'Bool') {
        choices.push(
            () => `(${genExpr('Bool', depth-1)} and ${genExpr('Bool', depth-1)})`,
            () => `(${genExpr('Bool', depth-1)} or ${genExpr('Bool', depth-1)})`,
            () => `not (${genExpr('Bool', depth-1)})`,
            () => `(${genExpr('Int', depth-1)} < ${genExpr('Int', depth-1)})`,
            () => `(${genExpr('Obj', depth-1)} is not TMyClass)`,
            () => `(${genExpr('Int', depth-1)} not in ${genExpr('Set', depth-1)})`,
            () => `if ${genExpr('Bool', depth-1)} then ${genExpr('Bool', depth-1)} else ${genExpr('Bool', depth-1)}`
        );
    } else if (type === 'Obj') {
        choices.push(
            () => `if ${genExpr('Bool', depth-1)} then ${genExpr('Obj', depth-1)} else ${genExpr('Obj', depth-1)}`,
            () => `TMyClass(${genExpr('Obj', depth-1)})`,
            () => `(${genExpr('Obj', depth-1)} as TMyClass)`
        );
    } else if (type === 'Set') {
        choices.push(
            () => `if ${genExpr('Bool', depth-1)} then ${genExpr('Set', depth-1)} else ${genExpr('Set', depth-1)}`,
            () => `[${genExpr('Int', depth-1)}, ${genExpr('Int', depth-1)}]`
        );
    }

    let res = choices[Math.floor(Math.random() * choices.length)]();
    return res;
}

function genStmt(depth) {
    if (depth <= 0) return `A := ${genExpr('Int', 0)};`;
    const choices = [
        () => `A := ${genExpr('Int', depth)};`,
        () => `if ${genExpr('Bool', depth)} then\n    ${genStmt(depth-1)}`,
        () => `if ${genExpr('Bool', depth)} then\n    ${genStmt(depth-1)}\n  else\n    ${genStmt(depth-1)}`,
        () => `var V${Math.floor(Math.random()*1000)} := ${genExpr('Int', depth)};`,
        () => `case ${genExpr('Int', depth)} of\n    1: ${genStmt(depth-1)};\n    2: ${genStmt(depth-1)};\n    otherwise ${genStmt(depth-1)}\n  end;`,
        () => `for var I${depth} := 0 to ${genExpr('Int', depth)} do ${genStmt(depth-1)}`
    ];
    return choices[Math.floor(Math.random() * choices.length)]();
}

function createDelphiProgram(stmt) {
    return `
program FuzzTest;
{$APPTYPE CONSOLE}

type
  TMyClass = class(TObject) end;

var
  A, B, C, D: Integer;
  ObjA, ObjB: TObject;

begin
  A := 1; B := 2; C := 3; D := 4;
  ObjA := TMyClass.Create; ObjB := TMyClass.Create;
  
  ${stmt}
end.
`;
}

console.log("Validating Delphi toolchain with a known-good program...");
const knownGood = createDelphiProgram('A := 1;');
fs.writeFileSync(tempFile, knownGood);
try {
    const out = execSync(`${dcc32} -B -CC -W- -H- ${tempFile}`, { stdio: 'pipe' });
    console.log("Toolchain validation successful.");
} catch (err) {
    console.error("FATAL: Toolchain validation failed! The base program does not compile.");
    console.error("Compiler output:");
    console.error(err.stdout ? err.stdout.toString() : err.message);
    process.exit(1);
}

let passedCount = 0;
let validTests = [];

console.log("Generating permutations and passing them to Delphi compiler...");

for (let i = 0; i < 500; i++) {
    // Generate a statement of depth up to 8
    const stmt = genStmt(Math.floor(Math.random() * 8) + 1);
    const programStr = createDelphiProgram(stmt);
    
    fs.writeFileSync(tempFile, programStr);
    
    try {
        // Run compiler quietly. -B = build all, -CC = console, -W- = no warnings, -H- = no hints
        execSync(`${dcc32} -B -CC -W- -H- ${tempFile}`, { stdio: 'ignore' });
        
        // If it compiles, it's valid Delphi! Add it to our test list.
        passedCount++;
        const formattedStmt = stmt.split('\n').map(line => '  ' + line).join('\n');
        validTests.push(`===\nFuzzed Diabolical Test ${passedCount}\n===\nprocedure Test;\nbegin\n${formattedStmt}\nend;\n---\n`);
        process.stdout.write('+');
    } catch (err) {
        // Compiler rejected it. Throw it away.
        process.stdout.write('.');
    }
}

console.log(`\n\nFuzzing complete!`);
console.log(`Generated ${passedCount} valid, compiler-verified edge cases.`);

if (passedCount === 0) {
    console.error("FATAL: The fuzzer failed to generate any valid Delphi code. The fuzzer must be rewritten.");
    process.exit(1);
}

// Append the new tests to the corpus
fs.appendFileSync(corpusFile, '\n' + validTests.join('\n'));
console.log(`Appended to ${corpusFile}. Run 'npx tree-sitter test -u' to generate ASTs.`);
