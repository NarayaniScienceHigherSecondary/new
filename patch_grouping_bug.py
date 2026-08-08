import re

with open('librarian.js', 'r') as f:
    content = f.read()

old_grouping = """        // Group books
        const deletedBooks = [];
        const secondYearBooks = [];
        const firstYearBooks = [];
        
        books.forEach(b => {
            const activeStudent = allStudents.find(s => String(s.rollNo) === String(b.studentRoll));
            if (!activeStudent) {
                deletedBooks.push(b);
            } else if (activeStudent.year === '+2 2nd year') {
                secondYearBooks.push(b);
            } else {
                firstYearBooks.push(b);
            }
        });"""

new_grouping = """        // Group books
        const deletedBooks = [];
        const secondYearBooks = [];
        const firstYearBooks = [];
        
        const allCards = DB.getLibraryCards() || [];
        
        books.forEach(b => {
            const card = allCards.find(c => c.cardNumber === b.cardNumber);
            let activeStudent = null;
            if (card) {
                activeStudent = allStudents.find(s => String(s.rollNo) === String(card.rollNo) && s.year === card.year);
            }
            
            if (!activeStudent) {
                deletedBooks.push(b);
            } else if (activeStudent.year === '+2 2nd year') {
                secondYearBooks.push(b);
            } else {
                firstYearBooks.push(b);
            }
        });"""

content = content.replace(old_grouping, new_grouping)

with open('librarian.js', 'w') as f:
    f.write(content)
