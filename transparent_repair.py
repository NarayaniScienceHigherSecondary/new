import re

with open('data.js', 'r') as f:
    content = f.read()

old_get = """    getLibraryCards: () => {
        return window._state.libraryCards;
    },"""

new_get = """    getLibraryCards: () => {
        let cards = window._state.libraryCards;
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
                // Save it back to localStorage
                localStorage.setItem('libraryCards', JSON.stringify(cards));
            }
        }
        return cards;
    },"""

content = content.replace(old_get, new_get)

with open('data.js', 'w') as f:
    f.write(content)
