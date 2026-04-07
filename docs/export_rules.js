const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const grammarPath = path.join(__dirname, '..', 'grammar.js');
const corpusPath = path.join(__dirname, '..', 'test', 'corpus');
const outputPath = path.join(__dirname, 'rules.md');

function getCategory(ruleName) {
    if (ruleName.startsWith('_')) return 'Internal Helpers';
    if (ruleName.startsWith('k')) return 'Keywords & Terminals';
    if (['root', 'program', 'unit', 'library', 'interface', 'implementation', 'initialization', 'finalization', 'moduleName'].includes(ruleName)) return 'High-Level Structure';
    if (['if', 'while', 'repeat', 'for', 'foreach', 'try', 'case', 'assignment', 'block', 'asm', 'with', 'raise', 'goto', 'label', 'inlineConst', 'varDef', 'varAssignDef', 'statement', 'caseCase', 'caseLabel', 'exceptionHandler', 'exceptionElse', 'statements', 'statementsTr'].includes(ruleName)) return 'Statements';
    if (ruleName.startsWith('expr') || ruleName === 'range') return 'Expressions';
    if (ruleName.startsWith('decl') || ruleName.startsWith('def') || ruleName.startsWith('typeref') || ruleName.startsWith('generic') || ruleName === 'type' || ruleName === 'guid' || ruleName === 'rttiAttributes' || ruleName === 'procAttribute' || ruleName === 'procExternal' || ruleName === 'operatorName' || ruleName === 'operatorDot') return 'Declarations & Definitions';
    if (ruleName.startsWith('literal') || ruleName === 'recInitializer' || ruleName === 'arrInitializer' || ruleName === 'recInitializerField') return 'Literals';
    return 'Other';
}

function getSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function exportRules() {
    const grammarContent = fs.readFileSync(grammarPath, 'utf8');
    const rules = new Set();
    
    // 1. Extract rule names
    const ruleRegex = /^\s*([a-zA-Z0-9_]+):\s*\$ =>/gm;
    let match;
    while ((match = ruleRegex.exec(grammarContent)) !== null) {
        rules.add(match[1]);
    }
    const dynamicRuleRegex = /\[rn\('([a-zA-Z0-9_]+)'\)/g;
    while ((match = dynamicRuleRegex.exec(grammarContent)) !== null) {
        rules.add(match[1]);
    }

    // 2. Scan corpus files for usage
    const corpusFiles = fs.readdirSync(corpusPath).filter(f => f.endsWith('.txt'));
    const ruleTests = {};
    const fileTestCounts = {};

    rules.forEach(rule => {
        ruleTests[rule] = new Set();
        const searchPattern = new RegExp(`\\(${rule}\\b`, 'g');
        corpusFiles.forEach(file => {
            const content = fs.readFileSync(path.join(corpusPath, file), 'utf8');
            if (searchPattern.test(content)) {
                ruleTests[rule].add(file);
            }
            if (!fileTestCounts[file]) {
                fileTestCounts[file] = Math.floor((content.match(/^===/gm) || []).length / 2);
            }
        });
    });

    // 3. Run tree-sitter test and parse results
    let testOutput = "";
    try {
        testOutput = execSync('npx tree-sitter test --overview-only', { encoding: 'utf8' });
    } catch (e) {
        testOutput = e.stdout || e.stderr || "";
    }

    const fileStats = {};
    corpusFiles.forEach(f => {
        const base = f.replace('.txt', '');
        fileStats[f] = { pass: 0, fail: 0 };
        
        const searchStr = `  ${base}:`;
        const startIndex = testOutput.indexOf(searchStr);
        
        if (startIndex !== -1) {
            // Find the start of the next category or the failure summary
            const nextCatMatch = testOutput.slice(startIndex + 1).match(/\n  [\w-]+:|\n\d+ failure/);
            const endIndex = nextCatMatch ? startIndex + 1 + nextCatMatch.index : testOutput.length;
            const section = testOutput.slice(startIndex, endIndex);
            
            // Match any line starting with whitespace, then digits, then a dot, then ANY non-whitespace char (the pass/fail symbol)
            const testLines = section.split('\n').filter(line => /^\s+\d+\.\s+\S/.test(line));
            testLines.forEach(line => {
                // Determine pass/fail robustly by checking for both standard UTF-8 and CP437 mojibake
                if (line.includes('✓') || line.includes('Γ£ô')) {
                    fileStats[f].pass++;
                } else if (line.includes('✗') || line.includes('Γ£ù')) {
                    fileStats[f].fail++;
                } else {
                    // Fallback to regex if we get completely unknown symbols or ANSI stripped colors
                    if (line.includes('\x1b[31m') || line.match(/\d+\.\s+[^✓Γ£ô\x1b]/)) {
                        fileStats[f].fail++;
                    } else {
                        fileStats[f].pass++;
                    }
                }
            });
            console.log(`DEBUG Found results for ${base}: pass=${fileStats[f].pass}, fail=${fileStats[f].fail}`);
        } else {
            console.warn(`Warning: Could not find results for ${base} in test output.`);
        }
    });

    // 4. Organize by category
    const categories = {};
    rules.forEach(rule => {
        const cat = getCategory(rule);
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(rule);
    });

    // 5. Calculate Summary & Totals
    const catStats = {};
    const totals = { rules: 0, tested: 0, untested: 0, totalTests: 0, pass: 0, fail: 0 };
    
    // Calculate global passing/failing tests first to avoid double counting from rules
    Object.keys(fileStats).forEach(file => {
        const s = fileStats[file];
        totals.pass += s.pass;
        totals.fail += s.fail;
        totals.totalTests += fileTestCounts[file];
    });
    console.log('DEBUG Totals after fileStats loop:', totals);

    Object.keys(categories).sort().forEach(catName => {
        const catRules = categories[catName];
        let testedCount = 0;
        const seenFiles = new Set();

        catRules.forEach(rule => {
            if (ruleTests[rule].size > 0) testedCount++;
            ruleTests[rule].forEach(file => seenFiles.add(file));
        });

        let catTotalTests = 0;
        let catPass = 0;
        let catFail = 0;
        seenFiles.forEach(file => {
            catTotalTests += fileTestCounts[file];
            catPass += fileStats[file].pass;
            catFail += fileStats[file].fail;
        });

        catStats[catName] = {
            rules: catRules.length,
            tested: testedCount,
            untested: catRules.length - testedCount,
            totalTests: catTotalTests,
            pass: catPass,
            fail: catFail
        };

        totals.rules += catStats[catName].rules;
        totals.tested += catStats[catName].tested;
        totals.untested += catStats[catName].untested;
    });

    // 6. Generate Markdown for rules.md
    let output = '# Tree-sitter Delphi Rules List\n\n';
    
    let summaryTable = '## <a id="summary"></a>Summary\n\n';
    summaryTable += '| Category | Rules | Tested | Untested | Total Tests | Passing | Failing |\n';
    summaryTable += '| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n';
    
    Object.keys(catStats).sort().forEach(cat => {
        const s = catStats[cat];
        summaryTable += `| [${cat}](#${getSlug(cat)}) | ${s.rules} | ${s.tested} | ${s.untested} | ${s.totalTests} | ${s.pass} | ${s.fail} |\n`;
    });
    
    summaryTable += `| **TOTAL** | **${totals.rules}** | **${totals.tested}** | **${totals.untested}** | **${totals.totalTests}** | **${totals.pass}** | **${totals.fail}** |\n`;
    
    output += summaryTable;
    output += '\n---\n\n';

    let fileTable = '## <a id="file-status"></a>Test File Status\n\n';
    fileTable += '| File | Tests | Passing | Failing |\n';
    fileTable += '| :--- | :---: | :---: | :---: |\n';
    Object.keys(fileStats).sort().forEach(file => {
        const s = fileStats[file];
        fileTable += `| \`${file}\` | ${fileTestCounts[file]} | ${s.pass} | ${s.fail} |\n`;
    });
    output += fileTable;
    output += '\n---\n\n';

    Object.keys(categories).sort().forEach(cat => {
        output += `## <a id="${getSlug(cat)}"></a>${cat}\n\n`;
        output += '| Rule Name | Tested In |\n';
        output += '| :--- | :--- |\n';
        
        categories[cat].sort().forEach(rule => {
            const tests = ruleTests[rule].size > 0 
                ? Array.from(ruleTests[rule]).map(f => `\`${f}\``).join(', ')
                : '*No explicit test found*';
            output += `| **${rule}** | ${tests} |\n`;
        });
        output += '\n[Back to Summary](#summary)\n\n';
    });

    fs.writeFileSync(outputPath, output);
    console.log(`Successfully exported rules to ${outputPath}`);
    formatMarkdown(outputPath);

    // 7. Update README.md
    const readmePath = path.join(__dirname, '..', 'README.md');
    if (fs.existsSync(readmePath)) {
        let readmeContent = fs.readFileSync(readmePath, 'utf8');
        // Replace links in summaryTable for README (point to docs/rules.md)
        let readmeSummary = summaryTable.replace(/\]\(#/g, '](docs/rules.md#');
        
        const startMarker = '<!-- TEST_SUMMARY_START -->';
        const endMarker = '<!-- TEST_SUMMARY_END -->';
        const startIndex = readmeContent.indexOf(startMarker);
        const endIndex = readmeContent.indexOf(endMarker);
        
        if (startIndex !== -1 && endIndex !== -1) {
            readmeContent = readmeContent.substring(0, startIndex + startMarker.length) 
                + '\n\n' + readmeSummary + '\n' 
                + readmeContent.substring(endIndex);
            fs.writeFileSync(readmePath, readmeContent);
            console.log(`Successfully updated summary in README.md`);
            formatMarkdown(readmePath);
        } else {
            console.log(`Markers not found in README.md`);
        }
    }
}

function formatMarkdown(filePath) {
    try {
        console.log(`Formatting ${filePath}...`);
        // Use npx to ensure we use local versions if available, falling back to global/download
        execSync(`npx prettier --write "${filePath}"`, { stdio: 'inherit' });
        execSync(`npx markdownlint-cli2 --fix --config .markdownlint.jsonc "${filePath}"`, { stdio: 'inherit' });
    } catch (e) {
        console.warn(`Warning: Could not format ${filePath}. Ensure prettier and markdownlint-cli2 are installed.`);
    }
}

exportRules();
