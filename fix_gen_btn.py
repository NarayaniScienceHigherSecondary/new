import re
with open('librarian.js', 'r') as f:
    content = f.read()

old_btn = "window.createNewLibraryCard('${student.id || student._id}')"
new_btn = "window.createNewLibraryCard('${student.rollNo}', '${student.year}')"

content = content.replace(old_btn, new_btn)

with open('librarian.js', 'w') as f:
    f.write(content)

