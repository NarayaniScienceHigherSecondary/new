import re

with open('librarian.js', 'r') as f:
    content = f.read()

old_logic = """        books.forEach(b => {
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

new_logic = """        books.forEach(b => {
            const card = allCards.find(c => c.cardNumber === b.cardNumber);
            let activeStudent = null;
            if (card) {
                activeStudent = allStudents.find(s => String(s.rollNo) === String(card.rollNo) && s.year === card.year);
            }
            // Fallback for older books that might not have a valid card attached
            if (!activeStudent && b.studentRoll && b.studentYear) {
                activeStudent = allStudents.find(s => String(s.rollNo) === String(b.studentRoll) && s.year === b.studentYear);
            }
            
            if (!activeStudent) {
                deletedBooks.push(b);
            } else if (activeStudent.year === '+2 2nd year') {
                secondYearBooks.push(b);
            } else {
                firstYearBooks.push(b);
            }
        });"""

content = content.replace(old_logic, new_logic)

with open('librarian.js', 'w') as f:
    f.write(content)
