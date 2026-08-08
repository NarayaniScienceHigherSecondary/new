import re

with open('app.js', 'r') as f:
    content = f.read()

# Add a startup hook to repair any old LIB- cards
repair_code = """
// Startup hook to repair corrupted library cards from previous bugs
(function repairLibraryCards() {
    if (DB && typeof DB.getLibraryCards === 'function') {
        let cards = DB.getLibraryCards() || [];
        let modified = false;
        cards.forEach(c => {
            if (c.cardNumber && c.cardNumber.startsWith('LIB-')) {
                const uniqueNum = Math.floor(100000 + Math.random() * 900000);
                c.cardNumber = `NSHSS-${uniqueNum}`;
                modified = true;
            }
        });
        if (modified) {
            DB.set('libraryCards', cards);
            console.log("Repaired corrupted library cards automatically.");
        }
    }
})();
"""

# Inject right after "const DB = {" block definition or at the end of the file.
# We'll just append it to app.js
with open('app.js', 'a') as f:
    f.write("\n" + repair_code)

