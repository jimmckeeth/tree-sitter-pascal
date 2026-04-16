# Tree-Sitter-Pascal (Delphi)

[<img src="docs/Tree-sitter-Delphi-512.avif" style="zoom:50%; float:right;" alt="tree sitter Delphi logo - a hoplite/spartan warrior sitting in a tree next to a treehouse"/>](https://github.com/jimmckeeth/Tree-sitter-Delphi)  
A [Tree-sitter](https://github.com/tree-sitter/tree-sitter) grammar supporting Pascal with focus on Delphi's Object Pascal. This is ultimately based on [Isopod's original implementation](https://github.com/Isopod/tree-sitter-pascal), but updated and focused on the latest language features. Support of other pascal dialects like Free Pascal are a secondary priority, but pull requests are welcome and we hope to support it as well. See also [Delphi-tree-sitter bindings](https://github.com/jimmckeeth/delphi-tree-sitter) for consuming tree-sitter grammars from Delphi.

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
- Case `otherwise` Keyword (Free Pascal / ISO Pascal)
- Nested Preprocessor Directives

## Tree-sitter features

- Syntax highlighting
- Scopes

## Pre-built Binaries

Pre-built native libraries for all supported platforms are published with each [GitHub Release](https://github.com/jimmckeeth/tree-sitter-pascal/releases/latest):

| Platform             | File                                   |
| :------------------- | :------------------------------------- |
| Windows x86 (32-bit) | `tree-sitter-pascal-windows-x86.dll`   |
| Windows x64 (64-bit) | `tree-sitter-pascal-windows-x64.dll`   |
| Linux x64            | `tree-sitter-pascal-linux-x64.so`      |
| macOS Intel          | `tree-sitter-pascal-macos-x64.dylib`   |
| macOS Apple Silicon  | `tree-sitter-pascal-macos-arm64.dylib` |
| WebAssembly          | `tree-sitter-pascal.wasm`              |

The `tree-sitter.wasm` core runtime (required for WASM use) is available from the [tree-sitter releases](https://github.com/tree-sitter/tree-sitter/releases).

## Repository Organization

To keep the root directory clean, the repository is organized as follows:

- **`bindings/`**: Contains language-specific bindings and their package manager files (e.g., `package.json`, `setup.py`, `Cargo.toml`). Includes bindings for C, Go, Node.js, Python, Rust, Swift, and [Delphi](https://github.com/jimmckeeth/delphi-tree-sitter) (submodule at `bindings/delphi/`).
- **`docs/`**: Documentation, auto-generated rule coverage (`rules.md`), and branding assets.
- **`Libs/`**: Local cache of pre-built native libraries (populated by `scripts/build.ps1`). Release artifacts are published to [GitHub Releases](https://github.com/jimmckeeth/tree-sitter-pascal/releases/latest).
- **`scripts/`**: Contains utility scripts for building (`build.ps1`), cleaning (`clean.ps1`), and checking prerequisites (`ensure-prereq.ps1`).
- **`src/`**: The generated C parser and header files. Edit `grammar.js`, not these files directly.
- **`queries/`**: Tree-sitter query files for syntax highlighting and local variables.
- **`test/`**: The test corpus and fuzzing scripts.
- **`examples/`**: Example Pascal files for testing and demonstration.

## Written in JavaScript and not Delphi?

I get this question a lot. You could certainly rewrite the whole Tree-Sitter stack in Delphi, but I don't think that makes sense. First of all I'm a pragmatist and just want to use what works. It could be an interesting exercise to rewrite it (or even have an AI do it) but what does that gain us? The main goal for this is compatibility in the wider ecosystem, so there is an advantage of having it written in the same language as the other grammars. If we re-wrote it in Delphi then we could end up with a two different forks, which just divides the effort.

## Test Status

Using a [fuzzy diabolical testing](#diabolical-testing) process to produce more failing tests to improve the grammar accuracy. Currently all the failing tests are related to multiline strings.

<!-- TEST_SUMMARY_START -->

| Category                                                             |  Rules  | Tested  | Untested | Total Tests | Passing  | Failing |
| :------------------------------------------------------------------- | :-----: | :-----: | :------: | :---------: | :------: | :-----: |
| [Declarations & Definitions](docs/rules.md#declarations-definitions) |   51    |   42    |    9     |    2751     |   2751   |    0    |
| [Expressions](docs/rules.md#expressions)                             |   13    |   11    |    2     |    1665     |   1665   |    0    |
| [High-Level Structure](docs/rules.md#high-level-structure)           |    9    |    9    |    0     |    2757     |   2757   |    0    |
| [Internal Helpers](docs/rules.md#internal-helpers)                   |   26    |    0    |    26    |      0      |    0     |    0    |
| [Keywords & Terminals](docs/rules.md#keywords-terminals)             |   163   |   112   |    51    |    2756     |   2756   |    0    |
| [Literals](docs/rules.md#literals)                                   |    7    |    6    |    1     |    1717     |   1717   |    0    |
| [Other](docs/rules.md#other)                                         |   12    |    5    |    7     |    2757     |   2757   |    0    |
| [Statements](docs/rules.md#statements)                               |   24    |   23    |    1     |    2653     |   2653   |    0    |
| **TOTAL**                                                            | **305** | **208** |  **97**  |  **2758**   | **2758** |  **0**  |

<!-- TEST_SUMMARY_END -->

## Diabolical Testing

To ensure the grammar's robustness beyond simple "happy path" scenarios, we use a [Diabolical Testing Process](docs/diabolical-testing.md). This involves fuzzing valid Delphi code through the actual compiler and comparing the resulting Tree-sitter AST against a structural oracle. This process specifically targets complex edge cases in modern Delphi features to identify logical flaws in precedence, associativity, and structure.

## Testing

To run the full test suite, which includes grammar validation and parsing example files, use:

```powershell
cd bindings/node
npm install
npm test
```

### Individual Test Commands

From the root of the repository:

- **Run corpus tests:** `npx tree-sitter test`
- **Parse example files:** `npx tree-sitter parse examples/*`
- **Test syntax highlighting:** `npx tree-sitter highlight <path_to_file>`

## License

I've migrated my updates to [AGPL](license). I'm a big fan of open source. Unfortunately, I've seen too many companies take advantage of permissive licenses and turn an open source project into a closed source one. This is why I prefer AGPL. At the same time, I'm also a big fan of commercial software, which might seem incompatible. That is why I'm happy to provide a dual license. I'll set up a pricing structure later, but I just want to announce it is an option. Let me know if you are interested.
