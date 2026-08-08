import re

with open('student.js', 'r') as f:
    content = f.read()

old_books = """    const issuedBooks = (DB && typeof DB.getLibraryBooks === 'function' && student) ? DB.getLibraryBooks().filter(b => 
        (libraryCard && b.cardNumber === libraryCard.cardNumber) || 
        (b.studentRoll && String(b.studentRoll) === String(student.rollNo) && String(b.studentYear) === String(student.year))
    ) : [];
    
    const libraryFines = (DB && typeof DB.getLibraryFines === 'function' && student) ? DB.getLibraryFines().filter(f => 
        (libraryCard && f.cardNumber === libraryCard.cardNumber) || 
        (f.studentRoll && String(f.studentRoll) === String(student.rollNo) && String(f.studentYear) === String(student.year))
    ) : [];"""

new_books = """    const issuedBooks = (DB && typeof DB.getLibraryBooks === 'function' && student) ? DB.getLibraryBooks().filter(b => 
        String(b.studentYear) === String(student.year) && (
            (libraryCard && b.cardNumber === libraryCard.cardNumber) || 
            (b.studentRoll && String(b.studentRoll) === String(student.rollNo))
        )
    ) : [];
    
    const libraryFines = (DB && typeof DB.getLibraryFines === 'function' && student) ? DB.getLibraryFines().filter(f => 
        String(f.studentYear) === String(student.year) && (
            (libraryCard && f.cardNumber === libraryCard.cardNumber) || 
            (f.studentRoll && String(f.studentRoll) === String(student.rollNo))
        )
    ) : [];"""

content = content.replace(old_books, new_books)

with open('student.js', 'w') as f:
    f.write(content)
