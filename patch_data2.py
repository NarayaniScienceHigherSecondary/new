with open('data.js', 'r') as f:
    content = f.read()

new_func = """
    createNewLibraryCard: (studentId) => {
        let students = DB.getStudents();
        let student = students.find(s => String(s.id || s._id) === String(studentId));
        if (!student) return;

        let cards = DB.getLibraryCards() || [];
        
        let yearPrefix = '0';
        if (student.year === '+2 1st year') yearPrefix = '1';
        else if (student.year === '+2 2nd year') yearPrefix = '2';
        
        const cardNo = `LIB-${yearPrefix}-${new Date().getFullYear()}-${student.rollNo}`;
        
        cards.push({
            id: 'C' + Date.now() + Math.floor(Math.random() * 99999),
            studentId: student.id || student._id,
            studentName: student.name,
            rollNo: student.rollNo,
            year: student.year,
            cardNumber: cardNo,
            issueDate: new Date().toISOString().split('T')[0],
            status: 'Active'
        });
        
        DB.set('libraryCards', cards);
        student.libraryCardRevoked = false;
        DB.set('students', students);
    },
"""

# Find `generateLibraryCard: (cardId) => {` and insert before it
idx = content.find("generateLibraryCard: (cardId) => {")
content = content[:idx] + new_func + content[idx:]

with open('data.js', 'w') as f:
    f.write(content)
