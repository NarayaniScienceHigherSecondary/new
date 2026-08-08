with open('data.js', 'r') as f:
    content = f.read()

import re

old_func = """    createNewLibraryCard: (studentId) => {
        let students = DB.getStudents();
        let student = students.find(s => String(s.id || s._id) === String(studentId));
        if (!student) return;

        let cards = DB.getLibraryCards() || [];
        
        // Generate unique NSHSS number for the library card
        const uniqueNum = Math.floor(100000 + Math.random() * 900000);
        const cardNo = `NSHSS-${uniqueNum}`;
        
        cards.push({"""

new_func = """    createNewLibraryCard: (studentId) => {
        let students = DB.getStudents();
        let student = students.find(s => String(s.id || s._id) === String(studentId));
        if (!student) return;

        let cards = DB.getLibraryCards() || [];
        
        // Remove any old/deleted cards for this student to prevent conflicts
        cards = cards.filter(c => !(
            (c.studentId && String(c.studentId) === String(studentId)) || 
            (String(c.rollNo) === String(student.rollNo) && c.year === student.year)
        ));
        
        // Generate unique NSHSS number for the library card
        const uniqueNum = Math.floor(100000 + Math.random() * 900000);
        const cardNo = `NSHSS-${uniqueNum}`;
        
        cards.push({"""

content = content.replace(old_func, new_func)

with open('data.js', 'w') as f:
    f.write(content)
