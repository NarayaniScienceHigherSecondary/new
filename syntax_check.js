const fs = require('fs');
const esprima = require('./esprima.js');

function checkFile(file) {
    try {
        const content = fs.readFileSync(file, 'utf8');
        esprima.parseScript(content);
        console.log(file + ' syntax is OK');
    } catch (e) {
        console.log(file + ' syntax error: ' + e.message);
    }
}

checkFile('admin.js');
checkFile('librarian.js');
