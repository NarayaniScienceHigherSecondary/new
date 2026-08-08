import re

with open('admin.js', 'r') as f:
    content = f.read()

old_wipe_card = """        // Wipe library card
        let libraryCards = DB.getLibraryCards();
        if (libraryCards) {
            libraryCards = libraryCards.filter(c => !(String(c.rollNo) === String(studentToDelete.rollNo) && c.year === studentToDelete.year));
            DB.set('libraryCards', libraryCards);
        }

        // Wipe library books tracker data
        let libraryBooks = DB.getLibraryBooks();
        if (libraryBooks) {
            libraryBooks = libraryBooks.filter(b => !(String(b.studentRoll) === String(studentToDelete.rollNo) && b.studentYear === studentToDelete.year));
            DB.set('libraryBooks', libraryBooks);
        }"""

new_wipe_card = """        // Wipe library card
        let libraryCards = DB.getLibraryCards();
        if (libraryCards) {
            libraryCards = libraryCards.filter(c => !(String(c.rollNo) === String(studentToDelete.rollNo) && c.year === studentToDelete.year));
            DB.set('libraryCards', libraryCards);
        }"""

content = content.replace(old_wipe_card, new_wipe_card)

with open('admin.js', 'w') as f:
    f.write(content)
