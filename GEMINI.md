# tree-sitter-pascal

## Project Overview

`tree-sitter-pascal` is a Tree-sitter grammar for the Pascal programming language, supporting multiple dialects including Delphi and FreePascal (FPC). It provides high-performance parsing for syntax highlighting, code navigation, and structural analysis.

### Key Features
- **Dialect Support:** Delphi and FreePascal specific features (generics, anonymous procedures, RTTI attributes).
- **Advanced Constructs:** Classes, records, interfaces, class helpers, nested declarations, and variant records.
- **Interop:** FPC PasCocoa extensions for Objective-C interoperability.
- **Performance:** Optimized for tree-sitter with specific handling for common preprocessor patterns.

## Building and Running

The project uses the `tree-sitter-cli` for grammar generation and testing.

### Prerequisites
- Node.js and npm
- `tree-sitter-cli` (installed via `npm install`)
- A C/C++ compiler for building the native parser.

### Key Commands
- **Generate Parser:** `npm run build` (runs `tree-sitter generate && node-gyp build`)
- **Run Tests:** `npm test` (runs `tree-sitter test` and parses files in `examples/`)
- **Parse a File:** `npx tree-sitter parse <path_to_pascal_file>`
- **Debug Tags/Highlights:** `npx tree-sitter tags` or `npx tree-sitter highlight`

## Development Conventions

### Grammar Structure (`grammar.js`)
- **Feature Flags:** The top of `grammar.js` contains several boolean flags (`rtti`, `lambda`, `fpc`, `delphi`, etc.) that control the inclusion of dialect-specific features.
- **Helpers:** Uses custom helpers like `op` (for operator precedence), `delimited`, and `delimited1`.
- **Preprocessor Handling:** Implements a `pp` helper to handle simple `$ifdef`/`$ifndef` blocks to prevent parser failure on common conditional code.

### Testing (`test/corpus/`)
- Tests are located in `test/corpus/` and follow the Tree-sitter corpus format (test name, source code, and expected S-expression).
- Grouped by feature: `attributes.txt`, `generics-delphi.txt`, `statements.txt`, etc.

### Queries (`queries/`)
- **Highlights:** `queries/highlights.scm` defines treesitter-based syntax highlighting.
- **Locals:** `queries/locals.scm` defines local variable scopes and definitions for navigation.

### Bindings
- The project provides bindings for Multiple languages: Node.js, Rust, Python, Go, and Swift (located in `bindings/`).
