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
                fileTestCounts[file] = (content.match(/^===/gm) || []).length;
            }
        });
    });

    // 3. Run tree-sitter test and parse results
    let testOutput = "";
    try {
        testOutput = execSync('npx tree-sitter test', { encoding: 'utf8' });
    } catch (e) {
        testOutput = e.stdout || e.stderr || "";
    }

    const fileStats = {};
    corpusFiles.forEach(f => {
        const base = f.replace('.txt', '');
        fileStats[f] = { pass: 0, fail: 0 };
        const sectionRegex = new RegExp(`  ${base}:[\\s\\S]*?(?:  \\w+:|$)`, 'g');
        const sectionMatch = sectionRegex.exec(testOutput);
        if (sectionMatch) {
            const section = sectionMatch[0];
            fileStats[f].pass = (section.match(/✓/g) || []).length;
            fileStats[f].fail = (section.match(/✗/g) || []).length;
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
        totals.totalTests += catStats[catName].totalTests;
        totals.pass += catStats[catName].pass;
        totals.fail += catStats[catName].fail;
    });

    // 6. Generate Markdown
    let output = '# Tree-sitter Delphi Rules List\n\n';
    
    output += '## <a id="summary"></a>Summary\n\n';
    output += '| Category | Rules | Tested | Untested | Total Tests | Passing | Failing |\n';
    output += '| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n';
    
    Object.keys(catStats).sort().forEach(cat => {
        const s = catStats[cat];
        output += `| [${cat}](#${getSlug(cat)}) | ${s.rules} | ${s.tested} | ${s.untested} | ${s.totalTests} | ${s.pass} | ${s.fail} |\n`;
    });
    
    output += `| **TOTAL** | **${totals.rules}** | **${totals.tested}** | **${totals.untested}** | **${totals.totalTests}** | **${totals.pass}** | **${totals.fail}** |\n`;
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
}

exportRules();
