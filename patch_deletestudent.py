with open('admin.js', 'r') as f:
    content = f.read()

# Add library card cleanup and other data cleanup to deleteStudent
old_delete = """        DB.set('users', allUsers);
        DB.set('students', allStudents);
        
        showToast('Student deleted successfully');"""

new_delete = """        DB.set('users', allUsers);
        DB.set('students', allStudents);
        
        // Wipe library card
        let libraryCards = DB.getLibraryCards();
        if (libraryCards) {
            libraryCards = libraryCards.filter(c => String(c.studentId) !== String(studentToDelete._id || studentToDelete.id));
            DB.set('libraryCards', libraryCards);
        }

        // Wipe exam results
        let exams = DB.getExams();
        if (exams) {
            exams.forEach(e => {
                if (e.targetYear === studentToDelete.year && e.results && e.results[studentToDelete.rollNo]) {
                    delete e.results[studentToDelete.rollNo];
                }
            });
            DB.set('exams', exams);
        }

        // Wipe class tests
        let classTests = DB.getClassTests();
        if (classTests) {
            classTests.forEach(t => {
                if (t.targetYear === studentToDelete.year && t.results && t.results[studentToDelete.rollNo]) {
                    delete t.results[studentToDelete.rollNo];
                }
            });
            DB.set('classTests', classTests);
        }

        // Wipe attendance
        let attendance = DB.getAttendance();
        if (attendance) {
            attendance.forEach(a => {
                if (a.targetYear === studentToDelete.year && a.records && a.records[studentToDelete.rollNo]) {
                    delete a.records[studentToDelete.rollNo];
                }
            });
            DB.set('attendance', attendance);
        }
        
        showToast('Student and all related data deleted successfully');"""

content = content.replace(old_delete, new_delete)

with open('admin.js', 'w') as f:
    f.write(content)
