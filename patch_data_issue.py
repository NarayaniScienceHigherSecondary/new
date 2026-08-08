import re
with open('data.js', 'r') as f:
    content = f.read()

# Add deleteIssuedBook right after renewLibraryBook
old_func = """    renewLibraryBook: (id, extraDays) => {
        let books = DB.getLibraryBooks();
        let book = books.find(b => b.id === id);
        if(book) {
            let currentReturn = new Date(book.returnDate);
            currentReturn.setDate(currentReturn.getDate() + parseInt(extraDays));
            book.returnDate = currentReturn.toISOString().split('T')[0];
            DB.set('libraryBooks', books);
        }
    },"""

new_func = """    renewLibraryBook: (id, extraDays) => {
        let books = DB.getLibraryBooks();
        let book = books.find(b => b.id === id);
        if(book) {
            let currentReturn = new Date(book.returnDate);
            currentReturn.setDate(currentReturn.getDate() + parseInt(extraDays));
            book.returnDate = currentReturn.toISOString().split('T')[0];
            DB.set('libraryBooks', books);
        }
    },
    deleteIssuedBook: (id) => {
        let books = DB.getLibraryBooks();
        books = books.filter(b => b.id !== id);
        DB.set('libraryBooks', books);
    },"""

content = content.replace(old_func, new_func)

with open('data.js', 'w') as f:
    f.write(content)
