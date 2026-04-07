# Tree-Sitter-Delphi

[<img src="docs/Tree-sitter-Delphi.avif" style="zoom:10%; float:right;" />](https://github.com/jimmckeeth/Tree-sitter-Delphi)Grammar for Delphi's Object Pascal and derived dialects like Free Pascal. This is ultimately based on [Isopod's original implementation](https://github.com/Isopod/tree-sitter-pascal), but updated and focused on language features in the latest version of Delphi. Support of other dialects isn't as high of a priority, but pull requests are welcome and we hope to support it as well.

## What is Tree-sitter?

[Tree-sitter](https://tree-sitter.github.io/tree-sitter/) is a incremental parsing system for programming tools. It is currently one of the most popular systems and grammars across all programming languages. It is useful for [syntax highlighting](https://tree-sitter.github.io/tree-sitter/3-syntax-highlighting.html), [code navigation](https://tree-sitter.github.io/tree-sitter/4-code-navigation.html), and most recently for powering [AST-based semantic code search](https://github.com/cocoindex-io/cocoindex-code) (my next project).

## Supported language features

- Classes, records, interfaces, class helpers
- Nested declarations
- Variant records
- Generics (Delphi & FPC flavored)
- Anonymous procedures & functions
- Inline assembler (but no highlighting)
- Extended RTTI attributes
- FPC PasCocoa extensions
- Ternary `if` Expressions (Delphi 13)
- Extended Logical Operators (`is not` and `not in`) (Delphi 13)
- Custom Managed Records (Delphi 10.4)
- Multi-line String Literals (Delphi 12)
- Numeric Separators (Delphi 12)
- Binary Literals (Delphi 12)
- Inline Variable & Constant Declarations (Delphi 10.3 / 12)
- Case `otherwise` Keyword (Delphi 12)
- Nested Preprocessor Directives (Support gap filled)

## Tree-sitter features

- Syntax highlighting
- Scopes

## Test Status

Using a [fuzzy diabolical testing](#diabolical-testing) process to produce more failing tests to improve the grammar accuracy.

<!-- TEST_SUMMARY_START -->

| Category                                                             |  Rules  | Tested  | Untested | Total Tests | Passing | Failing |
| :------------------------------------------------------------------- | :-----: | :-----: | :------: | :---------: | :-----: | :-----: |
| [Declarations & Definitions](docs/rules.md#declarations-definitions) |   51    |   42    |    9     |     880     |   880   |    0    |
| [Expressions](docs/rules.md#expressions)                             |   13    |   11    |    2     |     695     |   695   |    0    |
| [High-Level Structure](docs/rules.md#high-level-structure)           |    9    |    9    |    0     |     886     |   886   |    0    |
| [Internal Helpers](docs/rules.md#internal-helpers)                   |   26    |    0    |    26    |      0      |    0    |    0    |
| [Keywords & Terminals](docs/rules.md#keywords-terminals)             |   163   |   112   |    51    |     885     |   885   |    0    |
| [Literals](docs/rules.md#literals)                                   |    7    |    6    |    1     |     328     |   328   |    0    |
| [Other](docs/rules.md#other)                                         |   12    |    5    |    7     |     886     |   886   |    0    |
| [Statements](docs/rules.md#statements)                               |   24    |   23    |    1     |     846     |   846   |    0    |
| **TOTAL**                                                            | **305** | **208** |  **97**  |   **887**   | **887** |  **0**  |

<!-- TEST_SUMMARY_END -->

## Diabolical Testing

To ensure the grammar's robustness beyond simple "happy path" scenarios, we use a [Diabolical Testing Process](docs/diabolical-testing.md). This involves fuzzing valid Delphi code through the actual compiler and comparing the resulting Tree-sitter AST against a structural oracle. This process specifically targets complex edge cases in modern Delphi features to identify logical flaws in precedence, associativity, and structure.

## Testing

To run the full test suite, which includes grammar validation and parsing example files, use:

```powershell
npm test
```

### Individual Test Commands

- **Run corpus tests:** `npx tree-sitter test`
- **Parse example files:** `npx tree-sitter parse examples/*`
- **Test syntax highlighting:** `npx tree-sitter highlight <path_to_file>`
