# tree-sitter-pascal

Grammar for Pascal and its dialects Delphi and Freepascal.

## Supported language features
- Classes, records, interfaces, class helpers
- Nested declarations
- Variant records
- Generics (Delphi- & FPC flavored)
- Anonymous procedures & functions
- Inline assember (but no highlighting)
- Extended RTTI attributes
- FPC PasCocoa extensions

## Tree-sitter features:
- Syntax highlighting
- Scopes

## Test Status
<!-- TEST_SUMMARY_START -->

## <a id="summary"></a>Summary

| Category | Rules | Tested | Untested | Total Tests | Passing | Failing |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| [Declarations & Definitions](docs/rules.md#declarations-definitions) | 51 | 41 | 10 | 194 | 110 | 0 |
| [Expressions](docs/rules.md#expressions) | 12 | 10 | 2 | 150 | 88 | 0 |
| [High-Level Structure](docs/rules.md#high-level-structure) | 9 | 9 | 0 | 186 | 106 | 0 |
| [Internal Helpers](docs/rules.md#internal-helpers) | 26 | 0 | 26 | 0 | 0 | 0 |
| [Keywords & Terminals](docs/rules.md#keywords-terminals) | 161 | 109 | 52 | 194 | 110 | 0 |
| [Literals](docs/rules.md#literals) | 7 | 6 | 1 | 102 | 50 | 0 |
| [Other](docs/rules.md#other) | 12 | 5 | 7 | 194 | 110 | 0 |
| [Statements](docs/rules.md#statements) | 24 | 23 | 1 | 174 | 101 | 0 |
| **TOTAL** | **302** | **203** | **99** | **1194** | **675** | **0** |

<!-- TEST_SUMMARY_END -->


