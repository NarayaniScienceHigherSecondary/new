import re
with open('student.js', 'r') as f:
    content = f.read()

old_filter = "? DB.getLibraryCards().filter(c => String(c.studentId) === String(student.id || student._id) || (String(c.rollNo) === String(student.rollNo) && String(c.year) === String(student.year)))"
new_filter = "? DB.getLibraryCards().filter(c => String(c.rollNo) === String(student.rollNo) && String(c.year) === String(student.year))"

content = content.replace(old_filter, new_filter)

with open('student.js', 'w') as f:
    f.write(content)

