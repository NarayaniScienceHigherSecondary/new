import re
with open('data.js', 'r') as f:
    content = f.read()

# Fix createNewLibraryCard old card deletion
old_create = """        // Remove any old/deleted cards for this student to prevent conflicts
        cards = cards.filter(c => !(
            (c.studentId && String(c.studentId) === String(studentId)) || 
            (String(c.rollNo) === String(student.rollNo) && c.year === student.year)
        ));"""

new_create = """        // Remove any old/deleted cards for this student to prevent conflicts
        cards = cards.filter(c => !(
            (String(c.rollNo) === String(student.rollNo) && c.year === student.year)
        ));"""

content = content.replace(old_create, new_create)

# Fix updateStudent card logic
old_update = """                cards.forEach(c => {
                    if ((c.studentId && String(c.studentId) === studentIdStr) || 
                        (String(c.rollNo) === String(oldStudent.rollNo) && String(c.year) === String(oldStudent.year))) {"""

new_update = """                cards.forEach(c => {
                    if ((String(c.rollNo) === String(oldStudent.rollNo) && String(c.year) === String(oldStudent.year))) {"""

content = content.replace(old_update, new_update)

with open('data.js', 'w') as f:
    f.write(content)

