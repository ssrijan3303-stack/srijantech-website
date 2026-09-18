const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach(f => {
        const full = path.join(dir, f.name);
        if (f.isDirectory() && f.name !== 'node_modules' && f.name !== '.git' && f.name !== 'dist') {
            results.push(...walk(full));
        } else if (f.name.toLowerCase().includes('founder') && f.name.endsWith('.tsx')) {
            results.push(full);
        }
    });
    return results;
}

const comps = walk('src');
comps.forEach(c => {
    let code = fs.readFileSync(c, 'utf8');
    // Replace any image src inside founder component with /founder.jpg
    code = code.replace(/src=["'][^"']*["']/g, 'src="/founder.jpg"');
    fs.writeFileSync(c, code, 'utf8');
    console.log('Successfully updated:', c);
});