const fs = require('fs');
let code = fs.readFileSync('student.js', 'utf8');

if (!code.includes('try {')) {
    code = code.replace('function renderStudentDashboard() {', 'function renderStudentDashboard() {\n    try {');
    code = code.replace(/}\n*$/, '    } catch (e) {\n        console.error("Student Dashboard Render Error:", e);\n        return `<div class="p-8 text-center text-red-500"><h2 class="text-2xl font-bold">Dashboard Error</h2><p>${e.message}</p><p class="text-xs text-gray-400 mt-2">${e.stack}</p></div>`;\n    }\n}');
    fs.writeFileSync('student.js', code);
}
