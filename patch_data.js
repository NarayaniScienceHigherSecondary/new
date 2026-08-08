// ONE-TIME CLEANUP: Removed auto-generation of library cards per user request
window.cleanUpLibraryCards = function cleanUpLibraryCards() {
    if (typeof DB === 'undefined') return;

    // Clear all library cards
    if (DB.getLibraryCards && DB.getLibraryCards().length > 0) {
        DB.set('libraryCards', []);
        
        // Reset libraryCardRevoked flag on students
        if (DB.getStudents) {
            let students = DB.getStudents();
            let changed = false;
            students.forEach(s => {
                if (s.libraryCardRevoked) {
                    s.libraryCardRevoked = false;
                    changed = true;
                }
            });
            if (changed) DB.set('students', students);
        }
        console.log("All library cards have been cleared as requested.");
    }
}; window.cleanUpLibraryCards();
