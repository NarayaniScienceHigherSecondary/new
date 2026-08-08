import re

with open('librarian.js', 'r') as f:
    content = f.read()

# Fix UI fallback
old_fallback = """            // Fallback for older books that might not have a valid card attached
            if (!activeStudent && b.studentRoll && b.studentYear) {"""
            
new_fallback = """            // Fallback for older books that might not have a valid card attached
            // If a book HAS a cardNumber but the card wasn't found, it means the student graduated/was deleted.
            if (!activeStudent && !b.cardNumber && b.studentRoll && b.studentYear) {"""

content = content.replace(old_fallback, new_fallback)

# Fix Export fallback
old_export_fallback = """        // Fallback for older books that might not have a valid card attached
        if (!activeStudent && b.studentRoll && b.studentYear) {"""

new_export_fallback = """        // Fallback for older books that might not have a valid card attached
        if (!activeStudent && !b.cardNumber && b.studentRoll && b.studentYear) {"""

content = content.replace(old_export_fallback, new_export_fallback)

with open('librarian.js', 'w') as f:
    f.write(content)

with open('admin.js', 'r') as f:
    admin_content = f.read()

old_admin = """    // Get books to check clearance
    const allBooks = DB.getLibraryBooks() || [];
    const blockedStudents = [];

    // Remove 2nd years from students array
    allStudents = allStudents.filter(s => s.year !== '+2 2nd year');"""

new_admin = """    // Get books to check clearance
    const allBooks = DB.getLibraryBooks() || [];
    const blockedStudents = [];

    // Mark graduating 2nd year students' books as Past / Deleted so they don't get mixed up if roll numbers are reused
    allBooks.forEach(b => {
        if (b.studentYear === '+2 2nd year') {
            b.studentYear = 'Past / Deleted';
        }
    });

    // Remove 2nd years from students array
    allStudents = allStudents.filter(s => s.year !== '+2 2nd year');"""

admin_content = admin_content.replace(old_admin, new_admin)

with open('admin.js', 'w') as f:
    f.write(admin_content)
