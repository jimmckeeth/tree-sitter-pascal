# Diabolical Testing Process

## Overview
Traditional human-written tests are often limited by the developer's or tester's own understanding of the grammar. This leads to "happy path" testing where the tests validate the implementation's assumptions rather than the language's true boundaries.

The **Diabolical Testing Process** decouples test generation from the implementation by using the actual Delphi compiler as the source of truth.

## Targeted Features
We are systematically stress-testing the following modern Delphi features:
1.  **Ternary `if` Expressions:** `Result := if A then B else C;` (Delphi 13)
2.  **Extended Logical Operators:** `is not` and `not in` (Delphi 13)
3.  **Custom Managed Records:** `Initialize`, `Finalize`, and `Assign` (Delphi 10.4)
4.  **Multi-line String Literals:** Triple-quoted strings `''' ... '''` (Delphi 12)
5.  **Numeric Separators:** Underscores in numbers, e.g., `1_000_000` (Delphi 12)
6.  **Binary Literals:** e.g., `%1010` (Delphi 12)
7.  **Inline Variable Declarations:** `var I := 10;` inside code blocks (Delphi 10.3)
8.  **Inline Constant Declarations:** `const C = 42;` inside code blocks (Delphi 12)
9.  **The `otherwise` Keyword:** Used in `case` statements (Delphi 12)
10. **Nested Preprocessor Directives:** Recursive `$ifdef` / `$if` blocks.

## The Workflow
1.  **Chaotic Generation:** A fuzzer script generates thousands of random, unpredictable permutations of a specific feature.
2.  **Compiler Validation (Ground Truth):** Every generated permutation is fed to the real Delphi compiler (`dcc32.exe`).
    *   The fuzzer script first generates code that *must* pass to validate the toolchain.
    *   If the compiler accepts a subsequent random permutation, it is a **verified valid edge case**.
    *   **De-duplication:** Only unique code strings are kept.
3.  **Grammar Stress Test:** Verified cases are added to the Tree-sitter corpus.
4.  **Incompetence Detection:** We run `tree-sitter test`. Any `(ERROR)` node produced for compiler-verified code is objective proof of a grammar flaw.

## Fuzzer Scripts
*   `test/fuzz_delphi.js`: General fuzzer for multiple features.
*   `test/full-ternary.js`: Deep-dive fuzzer for ternary expression complexity and precedence.
