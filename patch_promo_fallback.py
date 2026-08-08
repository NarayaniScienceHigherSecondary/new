import re

with open('admin.js', 'r') as f:
    content = f.read()

old_logic = """            // Update their library card to reflect the new year
            const theirCard = allLibraryCards.find(c => String(c.rollNo) === String(s.rollNo));
            
            s.year = '+2 2nd year';
            s.profileComplete = false;"""

new_logic = """            // Update their library card to reflect the new year
            const theirCard = allLibraryCards.find(c => String(c.rollNo) === String(s.rollNo));
            
            // Also update any of their library books to reflect the new year
            allBooks.forEach(b => {
                if (String(b.studentRoll) === String(s.rollNo) && b.studentYear === '+2 1st year') {
                    b.studentYear = '+2 2nd year';
                }
            });
            
            s.year = '+2 2nd year';
            s.profileComplete = false;"""

content = content.replace(old_logic, new_logic)

old_save_logic = """    // DO NOT CLEAR LIBRARY BOOKS ON PROMOTION!"""

new_save_logic = """    DB.set('libraryBooks', allBooks); // Save updated book years
    // DO NOT CLEAR LIBRARY BOOKS ON PROMOTION!"""

content = content.replace(old_save_logic, new_save_logic)

with open('admin.js', 'w') as f:
    f.write(content)
