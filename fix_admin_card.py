import re
with open('admin.js', 'r') as f:
    content = f.read()

old_delete = "            libraryCards = libraryCards.filter(c => String(c.studentId) !== String(studentToDelete._id || studentToDelete.id));"
new_delete = "            libraryCards = libraryCards.filter(c => !(String(c.rollNo) === String(studentToDelete.rollNo) && c.year === studentToDelete.year));"
content = content.replace(old_delete, new_delete)

old_promo = "                (c.studentId && String(c.studentId) === String(s.id || s._id)) || "
new_promo = ""
content = content.replace(old_promo, new_promo)

# Also fix the dangling OR condition:
# "(String(c.rollNo) === String(s.rollNo) && c.year === s.year)"

with open('admin.js', 'w') as f:
    f.write(content)
