import re
with open('data.js', 'r') as f:
    content = f.read()

old_func = """    updateLibraryBook: (id, updates) => {
        const books = DB.getLibraryBooks();
        const index = books.findIndex(b => b.id === id);
        if(index > -1) {
            books[index] = { ...books[index], ...updates };
            DB.set('libraryBooks', books);
        }
    }"""

new_func = """    updateLibraryBook: (id, updates) => {
        const books = DB.getLibraryBooks();
        const index = books.findIndex(b => b.id === id);
        if(index > -1) {
            books[index] = { ...books[index], ...updates };
            DB.set('libraryBooks', books);
        }
    },
    deleteIssuedBook: (id) => {
        let books = DB.getLibraryBooks();
        books = books.filter(b => b.id !== id);
        DB.set('libraryBooks', books);
    }"""

content = content.replace(old_func, new_func)

with open('data.js', 'w') as f:
    f.write(content)
