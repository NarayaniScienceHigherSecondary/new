import re

with open('librarian.js', 'r') as f:
    content = f.read()

old_header = """function renderLibrarianCardsView() {
    window.currentLibrarianView = 'cards';
    let allStudents = DB.getStudents() || [];
    let allCards = DB.getLibraryCards() || [];"""

new_header = """function renderLibrarianCardsView() {
    window.currentLibrarianView = 'cards';
    
    // FORCE REPAIR ANY OLD CARDS ON RENDER
    let allCards = DB.getLibraryCards() || [];
    let modified = false;
    allCards.forEach(c => {
        if (c.cardNumber && c.cardNumber.startsWith('LIB-')) {
            const uniqueNum = Math.floor(100000 + Math.random() * 900000);
            c.cardNumber = `NSHSS-${uniqueNum}`;
            modified = true;
        }
    });
    if (modified) {
        DB.set('libraryCards', allCards);
        alert('Automatically repaired old LIB- formatted cards! They are now NSHSS- format.');
    }

    let allStudents = DB.getStudents() || [];"""

content = content.replace(old_header, new_header)

with open('librarian.js', 'w') as f:
    f.write(content)
