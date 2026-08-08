import re

with open('librarian.js', 'r') as f:
    content = f.read()

old_logic = """            if (!activeStudent) {
                deletedBooks.push(b);
            } else if (activeStudent.year === '+2 2nd year') {
                secondYearBooks.push(b);
            } else {
                firstYearBooks.push(b);
            }
        });"""

new_logic = """            if (!activeStudent) {
                deletedBooks.push(b);
            } else if (activeStudent.year === '+2 2nd year') {
                secondYearBooks.push(b);
            } else {
                firstYearBooks.push(b);
            }
        });
        
        console.log('Deleted Books Count:', deletedBooks.length, deletedBooks);
        console.log('Second Year Books Count:', secondYearBooks.length, secondYearBooks);
        console.log('First Year Books Count:', firstYearBooks.length, firstYearBooks);"""

content = content.replace(old_logic, new_logic)

with open('librarian.js', 'w') as f:
    f.write(content)
