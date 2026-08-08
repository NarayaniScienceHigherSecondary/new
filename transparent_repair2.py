import re

with open('data.js', 'r') as f:
    content = f.read()

old_get = "    getLibraryCards: () => DB.get('libraryCards') || [],"

new_get = """    getLibraryCards: () => {
        let cards = DB.get('libraryCards') || [];
        let modified = false;
        if (cards && Array.isArray(cards)) {
            cards.forEach(c => {
                if (c.cardNumber && c.cardNumber.startsWith('LIB-')) {
                    const uniqueNum = Math.floor(100000 + Math.random() * 900000);
                    c.cardNumber = `NSHSS-${uniqueNum}`;
                    modified = true;
                }
            });
            if (modified) {
                // Save it back to localStorage (DB.set would cause an infinite loop if DB is referenced inside DB)
                // Actually DB.set is safe because DB is already initialized
                const str = JSON.stringify(cards);
                localStorage.setItem('libraryCards', str);
                if (window._state) window._state['libraryCards'] = cards;
            }
        }
        return cards;
    },"""

content = content.replace(old_get, new_get)

with open('data.js', 'w') as f:
    f.write(content)
