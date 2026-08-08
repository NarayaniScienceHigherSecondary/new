import re

with open('admin.js', 'r') as f:
    content = f.read()

old_logic = """    // We must NOT clear library books if there are blocked students holding them!
    // But the prompt says "Clear old issued books for the new academic year". 
    // We should only clear returned books, OR we keep unreturned books.
    // Let's keep unreturned books and delete returned ones.
    const remainingBooks = allBooks.filter(b => b.status === 'Issued');
    DB.set('libraryBooks', remainingBooks);"""

new_logic = """    // DO NOT CLEAR LIBRARY BOOKS ON PROMOTION!
    // We must preserve all book history (Returned and Issued).
    // The library tracker will automatically move 2nd year students' books to "Past / Deleted"
    // when their profiles are deleted, and will dynamically shift 1st year books to "2nd Year"
    // based on the student's new promoted year!"""

content = content.replace(old_logic, new_logic)

with open('admin.js', 'w') as f:
    f.write(content)
