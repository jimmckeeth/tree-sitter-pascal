# tree-sitter-pascal

Grammar for Delphi's Object Pascal and divergent dialects like Freepascal. Focused on language features in the latest version of Delphi. Support of other dialects isn't as high of a priority, but pull requests are welcome and we hope to support it as well.

## Supported language features

- Classes, records, interfaces, class helpers
- Nested declarations
- Variant records
- Generics (Delphi- & FPC flavored)
- Anonymous procedures & functions
- Inline assembler (but no highlighting)
- Extended RTTI attributes
- FPC PasCocoa extensions

## Tree-sitter features

- Syntax highlighting
- Scopes

## Test Status

<!-- TEST_SUMMARY_START -->

## <a id="summary"></a>Summary

| Category                                                             |  Rules  | Tested  | Untested | Total Tests | Passing | Failing |
| :------------------------------------------------------------------- | :-----: | :-----: | :------: | :---------: | :-----: | :-----: |
| [Declarations & Definitions](docs/rules.md#declarations-definitions) |   51    |   42    |    9     |     260     |   259   |    0    |
| [Expressions](docs/rules.md#expressions)                             |   13    |   11    |    2     |     237     |   236   |    0    |
| [High-Level Structure](docs/rules.md#high-level-structure)           |    9    |    9    |    0     |     251     |   250   |    0    |
| [Internal Helpers](docs/rules.md#internal-helpers)                   |   26    |    0    |    26    |      0      |    0    |    0    |
| [Keywords & Terminals](docs/rules.md#keywords-terminals)             |   163   |   112   |    51    |     260     |   259   |    0    |
| [Literals](docs/rules.md#literals)                                   |    7    |    6    |    1     |     213     |   212   |    0    |
| [Other](docs/rules.md#other)                                         |   12    |    5    |    7     |     259     |   258   |    0    |
| [Statements](docs/rules.md#statements)                               |   24    |   23    |    1     |     661     |   249   |   412   |
| **TOTAL**                                                            | **305** | **208** |  **97**  |   **672**   | **259** | **412** |

<!-- TEST_SUMMARY_END -->

## Testing

To run the full test suite, which includes grammar validation and parsing example files, use:

```powershell
npm test
```

### Individual Test Commands

- **Run corpus tests:** `npx tree-sitter test`
- **Parse example files:** `npx tree-sitter parse examples/*`
- **Test syntax highlighting:** `npx tree-sitter highlight <path_to_file>`
