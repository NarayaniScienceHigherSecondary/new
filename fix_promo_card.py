import re

with open('admin.js', 'r') as f:
    content = f.read()

old_promo = """            // Update their library card to reflect the new year
            const theirCard = allLibraryCards.find(c => 
                
                (String(c.rollNo) === String(s.rollNo) && c.year === s.year)
            );"""

new_promo = """            // Update their library card to reflect the new year
            const theirCard = allLibraryCards.find(c => String(c.rollNo) === String(s.rollNo));"""

content = content.replace(old_promo, new_promo)

with open('admin.js', 'w') as f:
    f.write(content)
