const fs = require('fs');

let adminContent = fs.readFileSync('admin.js', 'utf8');

const oldAdd = `    // Auto-generate library card immediately for the new student`;
const newAdd = `    // Clear stale data for this rollNo in this year (from previous batches)
    let exams = DB.getExams();
    exams.forEach(e => {
        if (e.targetYear === year && e.results && e.results[rollNo]) {
            delete e.results[rollNo];
        }
    });
    DB.set('exams', exams);

    let classTests = DB.getClassTests();
    classTests.forEach(t => {
        if (t.targetYear === year && t.results && t.results[rollNo]) {
            delete t.results[rollNo];
        }
    });
    DB.set('classTests', classTests);

    let attendance = DB.getAttendance();
    attendance.forEach(a => {
        if (a.targetYear === year && a.records && a.records[rollNo]) {
            delete a.records[rollNo];
        }
    });
    DB.set('attendance', attendance);

    // Auto-generate library card immediately for the new student`;

adminContent = adminContent.replace(oldAdd, newAdd);
fs.writeFileSync('admin.js', adminContent, 'utf8');
