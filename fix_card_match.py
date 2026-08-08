import re
with open('librarian.js', 'r') as f:
    content = f.read()

# Fix in renderLibrarianCardsView
old_find = "const card = allCards.find(c => (c.studentId && (String(c.studentId) === String(student.id || student._id))) || (String(c.rollNo) === String(student.rollNo) && c.year === student.year));"
new_find = "const card = allCards.find(c => String(c.rollNo) === String(student.rollNo) && c.year === student.year);"

content = content.replace(old_find, new_find)

with open('librarian.js', 'w') as f:
    f.write(content)

