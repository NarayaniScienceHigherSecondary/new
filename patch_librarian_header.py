with open('librarian.js', 'r') as f:
    content = f.read()

old_header = """<h3 class="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-id-card text-primary"></i> Library Cards Management</h3>"""
new_header = """<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 class="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-id-card text-primary"></i> Library Cards Management</h3>
            <button onclick="window.deleteAllLibraryCards()" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors shadow text-sm"><i class="fas fa-trash-alt mr-2"></i> Delete All Cards</button>
        </div>"""

content = content.replace(old_header, new_header)

new_func = """
window.deleteAllLibraryCards = () => {
    if(confirm("Are you ABSOLUTELY sure you want to delete ALL generated library cards for all students? This action cannot be undone!")) {
        if(confirm("FINAL WARNING: All cards will be deleted. Proceed?")) {
            if(DB && typeof DB.set === 'function') {
                DB.set('libraryCards', []);
                
                // Reset student flags
                let students = DB.getStudents() || [];
                students.forEach(s => { s.libraryCardRevoked = false; });
                DB.set('students', students);
                
                showToast('All Library Cards Deleted Successfully!');
                navigate('librarian');
            }
        }
    }
};
"""
content += new_func

with open('librarian.js', 'w') as f:
    f.write(content)
