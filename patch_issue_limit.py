import re

with open('librarian.js', 'r') as f:
    content = f.read()

old_handle = """    if(!card) return showToast('Student has no library card', 'error');
    if(card.status === 'Suspended') return showToast('Cannot issue books to a suspended library card', 'error');
    
    const bookName = document.getElementById('lib_book_name').value.trim();"""

new_handle = """    if(!card) return showToast('Student has no library card', 'error');
    if(card.status === 'Suspended') return showToast('Cannot issue books to a suspended library card', 'error');
    
    // Enforce ONE book per student limit
    const allBooks = DB.getLibraryBooks() || [];
    const unreturnedBook = allBooks.find(b => String(b.studentRoll) === String(student.rollNo) && String(b.studentYear) === String(student.year) && b.status === 'Issued');
    if (unreturnedBook) {
        return showToast('Student already has an unreturned book. They must return it before a new one can be issued.', 'error');
    }
    
    const bookName = document.getElementById('lib_book_name').value.trim();"""

content = content.replace(old_handle, new_handle)

with open('librarian.js', 'w') as f:
    f.write(content)
