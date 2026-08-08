import re

with open('admin.js', 'r') as f:
    content = f.read()

old_save = """    // Save back to DB
    DB.set('users', allUsers);
    DB.set('students', allStudents);
    DB.set('libraryCards', allLibraryCards);
    DB.set('attendance', []); // Reset attendance for the new academic year"""

new_save = """    // Save back to DB
    DB.set('users', allUsers);
    DB.set('students', allStudents);
    DB.set('libraryCards', allLibraryCards);
    DB.set('attendance', []); // Reset attendance for the new academic year
    DB.set('libraryBooks', []); // Clear old issued books for the new academic year
    DB.set('libraryFines', []); // Clear old library fines for the new academic year"""

content = content.replace(old_save, new_save)

with open('admin.js', 'w') as f:
    f.write(content)
