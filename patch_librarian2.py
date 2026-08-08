with open('librarian.js', 'r') as f:
    content = f.read()

new_func = """
window.createNewLibraryCard = (studentId) => {
    if(confirm("Generate a new library card for this student?")) {
        if(DB && typeof DB.createNewLibraryCard === 'function') {
            DB.createNewLibraryCard(studentId);
            showToast('Library Card Generated Successfully');
            navigate('librarian');
        }
    }
};
"""

content += new_func

with open('librarian.js', 'w') as f:
    f.write(content)
