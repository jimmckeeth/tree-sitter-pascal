# Tree-sitter Delphi Rules List

## <a id="summary"></a>Summary

| Category                                                |  Rules  | Tested  | Untested | Total Tests | Passing | Failing |
| :------------------------------------------------------ | :-----: | :-----: | :------: | :---------: | :-----: | :-----: |
| [Declarations & Definitions](#declarations-definitions) |   51    |   41    |    10    |     194     |   110   |    0    |
| [Expressions](#expressions)                             |   12    |   10    |    2     |     150     |   88    |    0    |
| [High-Level Structure](#high-level-structure)           |    9    |    9    |    0     |     186     |   106   |    0    |
| [Internal Helpers](#internal-helpers)                   |   26    |    0    |    26    |      0      |    0    |    0    |
| [Keywords & Terminals](#keywords-terminals)             |   161   |   109   |    52    |     194     |   110   |    0    |
| [Literals](#literals)                                   |    7    |    6    |    1     |     102     |   50    |    0    |
| [Other](#other)                                         |   12    |    5    |    7     |     194     |   110   |    0    |
| [Statements](#statements)                               |   24    |   23    |    1     |     174     |   101   |    0    |
| **TOTAL**                                               | **302** | **203** |  **99**  |  **1194**   | **675** |  **0**  |

---

## <a id="declarations-definitions"></a>Declarations & Definitions

| Rule Name             | Tested In                                                                                                                                                                                                            |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **declArg**           | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `pascocoa.txt`, `preprocessor.txt`, `routines.txt`                                                                   |
| **declArgs**          | `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `pascocoa.txt`, `preprocessor.txt`, `routines.txt`, `statements.txt`                                                                   |
| **declArray**         | `declarations.txt`, `literals.txt`                                                                                                                                                                                   |
| **declClass**         | `attributes.txt`, `declarations.txt`, `modules.txt`, `pascocoa.txt`                                                                                                                                                  |
| **declConst**         | `declarations.txt`, `literals.txt`, `routines.txt`                                                                                                                                                                   |
| **declConsts**        | `declarations.txt`, `literals.txt`, `routines.txt`                                                                                                                                                                   |
| **declEnum**          | `attributes.txt`, `declarations.txt`                                                                                                                                                                                 |
| **declEnumValue**     | `attributes.txt`, `declarations.txt`                                                                                                                                                                                 |
| **declExport**        | _No explicit test found_                                                                                                                                                                                             |
| **declExports**       | _No explicit test found_                                                                                                                                                                                             |
| **declField**         | `declarations.txt`, `pascocoa.txt`                                                                                                                                                                                   |
| **declFile**          | `declarations.txt`                                                                                                                                                                                                   |
| **declHelper**        | _No explicit test found_                                                                                                                                                                                             |
| **declIntf**          | `attributes.txt`, `declarations.txt`                                                                                                                                                                                 |
| **declLabel**         | _No explicit test found_                                                                                                                                                                                             |
| **declLabels**        | _No explicit test found_                                                                                                                                                                                             |
| **declMetaClass**     | `declarations.txt`                                                                                                                                                                                                   |
| **declProc**          | `attributes.txt`, `declarations.txt`, `expressions.txt`, `generics-fpc.txt`, `lambdas.txt`, `modern_delphi.txt`, `modules.txt`, `pascocoa.txt`, `preprocessor.txt`, `routines.txt`, `statements.txt`                 |
| **declProcFwd**       | _No explicit test found_                                                                                                                                                                                             |
| **declProcRef**       | `declarations.txt`, `lambdas.txt`                                                                                                                                                                                    |
| **declProp**          | `attributes.txt`, `declarations.txt`                                                                                                                                                                                 |
| **declPropArgs**      | `attributes.txt`, `declarations.txt`                                                                                                                                                                                 |
| **declSection**       | `declarations.txt`, `pascocoa.txt`                                                                                                                                                                                   |
| **declSet**           | `declarations.txt`                                                                                                                                                                                                   |
| **declString**        | `declarations.txt`, `modern_delphi.txt`                                                                                                                                                                              |
| **declType**          | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `modules.txt`, `pascocoa.txt`, `routines.txt`                                                                        |
| **declTypes**         | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `modules.txt`, `pascocoa.txt`, `routines.txt`                                                                        |
| **declUses**          | `modules.txt`                                                                                                                                                                                                        |
| **declVar**           | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `modern_delphi.txt`, `preprocessor.txt`, `routines.txt`                                                                             |
| **declVariant**       | `declarations.txt`                                                                                                                                                                                                   |
| **declVariantClause** | `declarations.txt`                                                                                                                                                                                                   |
| **declVariantField**  | _No explicit test found_                                                                                                                                                                                             |
| **declVars**          | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `modern_delphi.txt`, `preprocessor.txt`, `routines.txt`                                                                             |
| **defProc**           | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `modern_delphi.txt`, `modules.txt`, `preprocessor.txt`, `routines.txt`, `statements.txt`                             |
| **defaultValue**      | `declarations.txt`, `literals.txt`, `modern_delphi.txt`, `routines.txt`                                                                                                                                              |
| **genericArg**        | `generics-delphi.txt`, `generics-fpc.txt`                                                                                                                                                                            |
| **genericArgs**       | `generics-delphi.txt`, `generics-fpc.txt`                                                                                                                                                                            |
| **genericDot**        | `generics-delphi.txt`, `generics-fpc.txt`, `modules.txt`, `routines.txt`                                                                                                                                             |
| **genericTpl**        | `generics-delphi.txt`, `generics-fpc.txt`                                                                                                                                                                            |
| **guid**              | `attributes.txt`, `declarations.txt`                                                                                                                                                                                 |
| **operatorDot**       | _No explicit test found_                                                                                                                                                                                             |
| **operatorName**      | `declarations.txt`, `routines.txt`                                                                                                                                                                                   |
| **procAttribute**     | `attributes.txt`, `declarations.txt`, `pascocoa.txt`                                                                                                                                                                 |
| **procExternal**      | `attributes.txt`                                                                                                                                                                                                     |
| **rttiAttributes**    | `attributes.txt`                                                                                                                                                                                                     |
| **type**              | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `literals.txt`, `modules.txt`, `pascocoa.txt`, `preprocessor.txt`, `routines.txt`                                    |
| **typeref**           | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `inlinevar.txt`, `lambdas.txt`, `literals.txt`, `modules.txt`, `pascocoa.txt`, `preprocessor.txt`, `routines.txt`, `statements.txt` |
| **typerefArgs**       | `generics-delphi.txt`, `generics-fpc.txt`                                                                                                                                                                            |
| **typerefDot**        | _No explicit test found_                                                                                                                                                                                             |
| **typerefPtr**        | _No explicit test found_                                                                                                                                                                                             |
| **typerefTpl**        | `generics-delphi.txt`, `generics-fpc.txt`                                                                                                                                                                            |

[Back to Summary](#summary)

## <a id="expressions"></a>Expressions

| Rule Name         | Tested In                                                                                                                              |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **exprArgs**      | `attributes.txt`, `expressions.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `modern_delphi.txt`, `preprocessor.txt` |
| **exprAs**        | _No explicit test found_                                                                                                               |
| **exprBinary**    | `expressions.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `literals.txt`                                                           |
| **exprBrackets**  | `expressions.txt`, `literals.txt`                                                                                                      |
| **exprCall**      | `attributes.txt`, `expressions.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `modern_delphi.txt`, `preprocessor.txt` |
| **exprDeref**     | _No explicit test found_                                                                                                               |
| **exprDot**       | `expressions.txt`, `modern_delphi.txt`                                                                                                 |
| **exprParens**    | `expressions.txt`, `lambdas.txt`                                                                                                       |
| **exprSubscript** | `expressions.txt`                                                                                                                      |
| **exprTpl**       | `generics-delphi.txt`, `generics-fpc.txt`, `modern_delphi.txt`                                                                         |
| **exprUnary**     | `expressions.txt`                                                                                                                      |
| **range**         | `declarations.txt`, `expressions.txt`, `literals.txt`, `statements.txt`                                                                |

[Back to Summary](#summary)

## <a id="high-level-structure"></a>High-Level Structure

| Rule Name          | Tested In                                                                                                                                                                                                                                   |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **finalization**   | `modules.txt`                                                                                                                                                                                                                               |
| **implementation** | `modules.txt`                                                                                                                                                                                                                               |
| **initialization** | `modules.txt`                                                                                                                                                                                                                               |
| **interface**      | `modules.txt`                                                                                                                                                                                                                               |
| **library**        | `modules.txt`                                                                                                                                                                                                                               |
| **moduleName**     | `modules.txt`                                                                                                                                                                                                                               |
| **program**        | `modules.txt`                                                                                                                                                                                                                               |
| **root**           | `attributes.txt`, `declarations.txt`, `expressions.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `literals.txt`, `modern_delphi.txt`, `modules.txt`, `pascocoa.txt`, `preprocessor.txt`, `routines.txt`, `statements.txt` |
| **unit**           | `modules.txt`                                                                                                                                                                                                                               |

[Back to Summary](#summary)

## <a id="internal-helpers"></a>Internal Helpers

| Rule Name                | Tested In                |
| :----------------------- | :----------------------- |
| **\_classDeclarations**  | _No explicit test found_ |
| **\_declClass**          | _No explicit test found_ |
| **\_declFields**         | _No explicit test found_ |
| **\_declOperator**       | _No explicit test found_ |
| **\_declProc**           | _No explicit test found_ |
| **\_declarations**       | _No explicit test found_ |
| **\_definition**         | _No explicit test found_ |
| **\_definitions**        | _No explicit test found_ |
| **\_exceptionHandlers**  | _No explicit test found_ |
| **\_expr**               | _No explicit test found_ |
| **\_genericName**        | _No explicit test found_ |
| **\_initializer**        | _No explicit test found_ |
| **\_literal**            | _No explicit test found_ |
| **\_literalFloat**       | _No explicit test found_ |
| **\_literalInt**         | _No explicit test found_ |
| **\_literalString**      | _No explicit test found_ |
| **\_operatorName**       | _No explicit test found_ |
| **\_procAttribute**      | _No explicit test found_ |
| **\_procAttributeNoExt** | _No explicit test found_ |
| **\_ref**                | _No explicit test found_ |
| **\_space**              | _No explicit test found_ |
| **\_statement**          | _No explicit test found_ |
| **\_statements**         | _No explicit test found_ |
| **\_statementsTr**       | _No explicit test found_ |
| **\_typeref**            | _No explicit test found_ |
| **\_visibility**         | _No explicit test found_ |

[Back to Summary](#summary)

## <a id="keywords-terminals"></a>Keywords & Terminals

| Rule Name             | Tested In                                                                                                                                                                                                                   |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **kAbsolute**         | _No explicit test found_                                                                                                                                                                                                    |
| **kAbstract**         | `attributes.txt`                                                                                                                                                                                                            |
| **kAdd**              | `declarations.txt`, `literals.txt`, `routines.txt`                                                                                                                                                                          |
| **kAlias**            | `attributes.txt`                                                                                                                                                                                                            |
| **kAnd**              | `expressions.txt`                                                                                                                                                                                                           |
| **kArray**            | `declarations.txt`, `literals.txt`                                                                                                                                                                                          |
| **kAs**               | `expressions.txt`                                                                                                                                                                                                           |
| **kAsm**              | `statements.txt`                                                                                                                                                                                                            |
| **kAssembler**        | _No explicit test found_                                                                                                                                                                                                    |
| **kAssign**           | `inlinevar.txt`, `lambdas.txt`, `modern_delphi.txt`, `statements.txt`                                                                                                                                                       |
| **kAssignAdd**        | _No explicit test found_                                                                                                                                                                                                    |
| **kAssignDiv**        | _No explicit test found_                                                                                                                                                                                                    |
| **kAssignMul**        | _No explicit test found_                                                                                                                                                                                                    |
| **kAssignSub**        | _No explicit test found_                                                                                                                                                                                                    |
| **kAt**               | `expressions.txt`                                                                                                                                                                                                           |
| **kBegin**            | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `modern_delphi.txt`, `modules.txt`, `preprocessor.txt`, `routines.txt`, `statements.txt`                                    |
| **kCase**             | `declarations.txt`, `modern_delphi.txt`, `statements.txt`                                                                                                                                                                   |
| **kCdecl**            | `attributes.txt`                                                                                                                                                                                                            |
| **kClass**            | `attributes.txt`, `declarations.txt`, `modules.txt`, `pascocoa.txt`                                                                                                                                                         |
| **kConst**            | `declarations.txt`, `literals.txt`, `modern_delphi.txt`, `routines.txt`                                                                                                                                                     |
| **kConstref**         | _No explicit test found_                                                                                                                                                                                                    |
| **kConstructor**      | `declarations.txt`, `routines.txt`                                                                                                                                                                                          |
| **kCppdecl**          | _No explicit test found_                                                                                                                                                                                                    |
| **kCvar**             | `attributes.txt`                                                                                                                                                                                                            |
| **kDefault**          | `attributes.txt`, `declarations.txt`                                                                                                                                                                                        |
| **kDelayed**          | _No explicit test found_                                                                                                                                                                                                    |
| **kDeprecated**       | _No explicit test found_                                                                                                                                                                                                    |
| **kDestructor**       | `declarations.txt`, `routines.txt`                                                                                                                                                                                          |
| **kDispId**           | _No explicit test found_                                                                                                                                                                                                    |
| **kDispInterface**    | _No explicit test found_                                                                                                                                                                                                    |
| **kDiv**              | `expressions.txt`                                                                                                                                                                                                           |
| **kDo**               | `inlinevar.txt`, `modern_delphi.txt`, `preprocessor.txt`, `statements.txt`                                                                                                                                                  |
| **kDot**              | `expressions.txt`, `generics-fpc.txt`, `modern_delphi.txt`, `modules.txt`, `routines.txt`                                                                                                                                   |
| **kDownto**           | `statements.txt`                                                                                                                                                                                                            |
| **kDynamic**          | _No explicit test found_                                                                                                                                                                                                    |
| **kElse**             | `statements.txt`                                                                                                                                                                                                            |
| **kEnd**              | `attributes.txt`, `declarations.txt`, `expressions.txt`, `generics-fpc.txt`, `lambdas.txt`, `modern_delphi.txt`, `modules.txt`, `pascocoa.txt`, `preprocessor.txt`, `routines.txt`, `statements.txt`                        |
| **kEndDot**           | `modules.txt`                                                                                                                                                                                                               |
| **kEndif**            | _No explicit test found_                                                                                                                                                                                                    |
| **kEq**               | `attributes.txt`, `declarations.txt`, `expressions.txt`, `generics-fpc.txt`, `lambdas.txt`, `literals.txt`, `modules.txt`, `pascocoa.txt`, `routines.txt`                                                                   |
| **kExcept**           | `statements.txt`                                                                                                                                                                                                            |
| **kExperimental**     | _No explicit test found_                                                                                                                                                                                                    |
| **kExport**           | _No explicit test found_                                                                                                                                                                                                    |
| **kExports**          | _No explicit test found_                                                                                                                                                                                                    |
| **kExternal**         | `attributes.txt`, `pascocoa.txt`                                                                                                                                                                                            |
| **kFalse**            | _No explicit test found_                                                                                                                                                                                                    |
| **kFar**              | _No explicit test found_                                                                                                                                                                                                    |
| **kFdiv**             | `expressions.txt`                                                                                                                                                                                                           |
| **kFile**             | `declarations.txt`                                                                                                                                                                                                          |
| **kFinalization**     | `modules.txt`                                                                                                                                                                                                               |
| **kFinally**          | `statements.txt`                                                                                                                                                                                                            |
| **kFor**              | `inlinevar.txt`, `modern_delphi.txt`, `statements.txt`                                                                                                                                                                      |
| **kForward**          | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `modules.txt`                                                                                                                              |
| **kFunction**         | `declarations.txt`, `lambdas.txt`, `modules.txt`, `pascocoa.txt`, `routines.txt`                                                                                                                                            |
| **kGeneric**          | `generics-fpc.txt`                                                                                                                                                                                                          |
| **kGoto**             | `statements.txt`                                                                                                                                                                                                            |
| **kGt**               | `expressions.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `modern_delphi.txt`                                                                                                                                           |
| **kGte**              | `expressions.txt`                                                                                                                                                                                                           |
| **kHardfloat**        | _No explicit test found_                                                                                                                                                                                                    |
| **kHat**              | `expressions.txt`                                                                                                                                                                                                           |
| **kHelper**           | _No explicit test found_                                                                                                                                                                                                    |
| **kIf**               | `generics-delphi.txt`, `generics-fpc.txt`, `preprocessor.txt`, `statements.txt`                                                                                                                                             |
| **kIfdef**            | _No explicit test found_                                                                                                                                                                                                    |
| **kIfndef**           | _No explicit test found_                                                                                                                                                                                                    |
| **kImplementation**   | `modules.txt`                                                                                                                                                                                                               |
| **kImplements**       | _No explicit test found_                                                                                                                                                                                                    |
| **kIn**               | `expressions.txt`, `modern_delphi.txt`, `statements.txt`                                                                                                                                                                    |
| **kIndex**            | `attributes.txt`, `declarations.txt`                                                                                                                                                                                        |
| **kInherited**        | _No explicit test found_                                                                                                                                                                                                    |
| **kInitialization**   | `modules.txt`                                                                                                                                                                                                               |
| **kInline**           | `attributes.txt`                                                                                                                                                                                                            |
| **kInterface**        | `attributes.txt`, `declarations.txt`, `modules.txt`                                                                                                                                                                         |
| **kInterrupt**        | _No explicit test found_                                                                                                                                                                                                    |
| **kIocheck**          | _No explicit test found_                                                                                                                                                                                                    |
| **kIs**               | `expressions.txt`                                                                                                                                                                                                           |
| **kLabel**            | _No explicit test found_                                                                                                                                                                                                    |
| **kLibrary**          | `modules.txt`                                                                                                                                                                                                               |
| **kLocal**            | _No explicit test found_                                                                                                                                                                                                    |
| **kLt**               | `expressions.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `modern_delphi.txt`                                                                                                                                           |
| **kLte**              | `expressions.txt`                                                                                                                                                                                                           |
| **kMessage**          | `attributes.txt`, `pascocoa.txt`                                                                                                                                                                                            |
| **kMod**              | `expressions.txt`                                                                                                                                                                                                           |
| **kMs_abi_cdecl**     | _No explicit test found_                                                                                                                                                                                                    |
| **kMs_abi_default**   | _No explicit test found_                                                                                                                                                                                                    |
| **kMul**              | `expressions.txt`                                                                                                                                                                                                           |
| **kMwpascal**         | _No explicit test found_                                                                                                                                                                                                    |
| **kName**             | `attributes.txt`                                                                                                                                                                                                            |
| **kNear**             | _No explicit test found_                                                                                                                                                                                                    |
| **kNeq**              | `expressions.txt`                                                                                                                                                                                                           |
| **kNil**              | _No explicit test found_                                                                                                                                                                                                    |
| **kNodefault**        | _No explicit test found_                                                                                                                                                                                                    |
| **kNoreturn**         | _No explicit test found_                                                                                                                                                                                                    |
| **kNostackframe**     | _No explicit test found_                                                                                                                                                                                                    |
| **kNot**              | `expressions.txt`                                                                                                                                                                                                           |
| **kObjccategory**     | `pascocoa.txt`                                                                                                                                                                                                              |
| **kObjcclass**        | `pascocoa.txt`                                                                                                                                                                                                              |
| **kObjcprotocol**     | `pascocoa.txt`                                                                                                                                                                                                              |
| **kObject**           | `declarations.txt`                                                                                                                                                                                                          |
| **kOf**               | `declarations.txt`, `literals.txt`, `modern_delphi.txt`, `statements.txt`                                                                                                                                                   |
| **kOn**               | `statements.txt`                                                                                                                                                                                                            |
| **kOperator**         | `declarations.txt`, `routines.txt`                                                                                                                                                                                          |
| **kOptional**         | `pascocoa.txt`                                                                                                                                                                                                              |
| **kOr**               | `expressions.txt`                                                                                                                                                                                                           |
| **kOtherwise**        | `modern_delphi.txt`                                                                                                                                                                                                         |
| **kOut**              | `routines.txt`                                                                                                                                                                                                              |
| **kOverload**         | _No explicit test found_                                                                                                                                                                                                    |
| **kOverride**         | `attributes.txt`, `pascocoa.txt`                                                                                                                                                                                            |
| **kPacked**           | _No explicit test found_                                                                                                                                                                                                    |
| **kPascal**           | `attributes.txt`                                                                                                                                                                                                            |
| **kPlatform**         | _No explicit test found_                                                                                                                                                                                                    |
| **kPrivate**          | `declarations.txt`, `pascocoa.txt`                                                                                                                                                                                          |
| **kProcedure**        | `attributes.txt`, `declarations.txt`, `expressions.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `modern_delphi.txt`, `modules.txt`, `pascocoa.txt`, `preprocessor.txt`, `routines.txt`, `statements.txt` |
| **kProgram**          | `modules.txt`                                                                                                                                                                                                               |
| **kProperty**         | `attributes.txt`, `declarations.txt`                                                                                                                                                                                        |
| **kProtected**        | `declarations.txt`                                                                                                                                                                                                          |
| **kPublic**           | `attributes.txt`, `declarations.txt`, `pascocoa.txt`                                                                                                                                                                        |
| **kPublished**        | `declarations.txt`                                                                                                                                                                                                          |
| **kRaise**            | `statements.txt`                                                                                                                                                                                                            |
| **kRead**             | `attributes.txt`, `declarations.txt`                                                                                                                                                                                        |
| **kRecord**           | `declarations.txt`                                                                                                                                                                                                          |
| **kReference**        | `lambdas.txt`                                                                                                                                                                                                               |
| **kRegister**         | `attributes.txt`                                                                                                                                                                                                            |
| **kReintroduce**      | `pascocoa.txt`                                                                                                                                                                                                              |
| **kRepeat**           | `statements.txt`                                                                                                                                                                                                            |
| **kRequired**         | `pascocoa.txt`                                                                                                                                                                                                              |
| **kResourcestring**   | `declarations.txt`                                                                                                                                                                                                          |
| **kSafecall**         | _No explicit test found_                                                                                                                                                                                                    |
| **kSaveregisters**    | _No explicit test found_                                                                                                                                                                                                    |
| **kSealed**           | _No explicit test found_                                                                                                                                                                                                    |
| **kSet**              | `declarations.txt`                                                                                                                                                                                                          |
| **kShl**              | `expressions.txt`                                                                                                                                                                                                           |
| **kShr**              | `expressions.txt`                                                                                                                                                                                                           |
| **kSoftfloat**        | _No explicit test found_                                                                                                                                                                                                    |
| **kSpecialize**       | `generics-fpc.txt`                                                                                                                                                                                                          |
| **kStatic**           | _No explicit test found_                                                                                                                                                                                                    |
| **kStdcall**          | `attributes.txt`                                                                                                                                                                                                            |
| **kStored**           | `declarations.txt`                                                                                                                                                                                                          |
| **kStrict**           | `declarations.txt`                                                                                                                                                                                                          |
| **kString**           | `declarations.txt`, `modern_delphi.txt`                                                                                                                                                                                     |
| **kSub**              | `expressions.txt`                                                                                                                                                                                                           |
| **kSysv_abi_cdecl**   | _No explicit test found_                                                                                                                                                                                                    |
| **kSysv_abi_default** | _No explicit test found_                                                                                                                                                                                                    |
| **kThen**             | `generics-delphi.txt`, `generics-fpc.txt`, `preprocessor.txt`, `statements.txt`                                                                                                                                             |
| **kThreadvar**        | _No explicit test found_                                                                                                                                                                                                    |
| **kTo**               | `inlinevar.txt`, `lambdas.txt`, `statements.txt`                                                                                                                                                                            |
| **kTrue**             | `preprocessor.txt`                                                                                                                                                                                                          |
| **kTry**              | `statements.txt`                                                                                                                                                                                                            |
| **kType**             | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `modules.txt`, `pascocoa.txt`, `routines.txt`                                                                               |
| **kUnimplemented**    | _No explicit test found_                                                                                                                                                                                                    |
| **kUnit**             | `modules.txt`                                                                                                                                                                                                               |
| **kUntil**            | `statements.txt`                                                                                                                                                                                                            |
| **kUses**             | `modules.txt`                                                                                                                                                                                                               |
| **kVar**              | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `modern_delphi.txt`, `preprocessor.txt`, `routines.txt`                                                                                    |
| **kVarargs**          | _No explicit test found_                                                                                                                                                                                                    |
| **kVectorcall**       | _No explicit test found_                                                                                                                                                                                                    |
| **kVirtual**          | `attributes.txt`                                                                                                                                                                                                            |
| **kWhile**            | `preprocessor.txt`, `statements.txt`                                                                                                                                                                                        |
| **kWinapi**           | _No explicit test found_                                                                                                                                                                                                    |
| **kWith**             | `statements.txt`                                                                                                                                                                                                            |
| **kWrite**            | `declarations.txt`                                                                                                                                                                                                          |
| **kXor**              | `expressions.txt`                                                                                                                                                                                                           |

[Back to Summary](#summary)

## <a id="literals"></a>Literals

| Rule Name                  | Tested In                                                                                                     |
| :------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **arrInitializer**         | `literals.txt`                                                                                                |
| **literalChar**            | _No explicit test found_                                                                                      |
| **literalNumber**          | `attributes.txt`, `declarations.txt`, `inlinevar.txt`, `lambdas.txt`, `literals.txt`, `modern_delphi.txt`     |
| **literalString**          | `attributes.txt`, `declarations.txt`, `literals.txt`, `modern_delphi.txt`, `pascocoa.txt`, `preprocessor.txt` |
| **literalStringMultiline** | `modern_delphi.txt`                                                                                           |
| **recInitializer**         | `literals.txt`                                                                                                |
| **recInitializerField**    | `literals.txt`                                                                                                |

[Back to Summary](#summary)

## <a id="other"></a>Other

| Rule Name        | Tested In                                                                                                                                                                                                                                                    |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **asmBody**      | _No explicit test found_                                                                                                                                                                                                                                     |
| **comment**      | `preprocessor.txt`                                                                                                                                                                                                                                           |
| **conflicts**    | _No explicit test found_                                                                                                                                                                                                                                     |
| **extras**       | _No explicit test found_                                                                                                                                                                                                                                     |
| **identifier**   | `attributes.txt`, `declarations.txt`, `expressions.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `inlinevar.txt`, `lambdas.txt`, `literals.txt`, `modern_delphi.txt`, `modules.txt`, `pascocoa.txt`, `preprocessor.txt`, `routines.txt`, `statements.txt` |
| **ifElse**       | `statements.txt`                                                                                                                                                                                                                                             |
| **inherited**    | _No explicit test found_                                                                                                                                                                                                                                     |
| **lambda**       | `inlinevar.txt`                                                                                                                                                                                                                                              |
| **legacyFormat** | _No explicit test found_                                                                                                                                                                                                                                     |
| **nestedIf**     | _No explicit test found_                                                                                                                                                                                                                                     |
| **pp**           | `preprocessor.txt`                                                                                                                                                                                                                                           |
| **word**         | _No explicit test found_                                                                                                                                                                                                                                     |

[Back to Summary](#summary)

## <a id="statements"></a>Statements

| Rule Name            | Tested In                                                                                                                                                                                |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **asm**              | `statements.txt`                                                                                                                                                                         |
| **assignment**       | `inlinevar.txt`, `lambdas.txt`, `modern_delphi.txt`, `statements.txt`                                                                                                                    |
| **block**            | `attributes.txt`, `declarations.txt`, `generics-delphi.txt`, `generics-fpc.txt`, `lambdas.txt`, `modern_delphi.txt`, `modules.txt`, `preprocessor.txt`, `routines.txt`, `statements.txt` |
| **case**             | `declarations.txt`, `modern_delphi.txt`, `statements.txt`                                                                                                                                |
| **caseCase**         | `modern_delphi.txt`, `statements.txt`                                                                                                                                                    |
| **caseLabel**        | `declarations.txt`, `modern_delphi.txt`, `statements.txt`                                                                                                                                |
| **exceptionElse**    | `statements.txt`                                                                                                                                                                         |
| **exceptionHandler** | `statements.txt`                                                                                                                                                                         |
| **for**              | `inlinevar.txt`, `statements.txt`                                                                                                                                                        |
| **foreach**          | `modern_delphi.txt`, `statements.txt`                                                                                                                                                    |
| **goto**             | `statements.txt`                                                                                                                                                                         |
| **if**               | `generics-delphi.txt`, `generics-fpc.txt`, `preprocessor.txt`, `statements.txt`                                                                                                          |
| **inlineConst**      | `modern_delphi.txt`                                                                                                                                                                      |
| **label**            | `statements.txt`                                                                                                                                                                         |
| **raise**            | `statements.txt`                                                                                                                                                                         |
| **repeat**           | `statements.txt`                                                                                                                                                                         |
| **statement**        | `expressions.txt`, `generics-fpc.txt`, `modern_delphi.txt`, `modules.txt`, `preprocessor.txt`, `statements.txt`                                                                          |
| **statements**       | `statements.txt`                                                                                                                                                                         |
| **statementsTr**     | _No explicit test found_                                                                                                                                                                 |
| **try**              | `statements.txt`                                                                                                                                                                         |
| **varAssignDef**     | `inlinevar.txt`, `modern_delphi.txt`                                                                                                                                                     |
| **varDef**           | `inlinevar.txt`                                                                                                                                                                          |
| **while**            | `preprocessor.txt`, `statements.txt`                                                                                                                                                     |
| **with**             | `statements.txt`                                                                                                                                                                         |

[Back to Summary](#summary)
