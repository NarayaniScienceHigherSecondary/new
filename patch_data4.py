import re
with open('data.js', 'r') as f:
    content = f.read()

# We need to remove the auto-update library card block in updateStudent
old_block = """            // Auto-update library card if year or rollNo changed
            if (oldStudent.year !== newStudent.year || oldStudent.rollNo !== newStudent.rollNo) {
                let cards = DB.getLibraryCards();
                const studentIdStr = String(newStudent.id || newStudent._id);
                // Remove ALL old cards for this student (by ID, or by old roll/year combo)
                cards = cards.filter(c => {
                    const cardStudentIdStr = String(c.studentId);
                    if (studentIdStr && cardStudentIdStr === studentIdStr && cardStudentIdStr !== 'undefined') return false;
                    if (String(c.rollNo) === String(oldStudent.rollNo) && String(c.year) === String(oldStudent.year)) return false;
                    return true; // keep other cards
                });
                
                // Add new card if they are not revoked and have required info
                if (newStudent.name && newStudent.rollNo && newStudent.year && !newStudent.libraryCardRevoked) {
                    let yearPrefix = '0';
                    if (newStudent.year === '+2 1st year') yearPrefix = '1';
                    else if (newStudent.year === '+2 2nd year') yearPrefix = '2';
                    
                    const cardNo = `LIB-${yearPrefix}-${new Date().getFullYear()}-${newStudent.rollNo}`;
                    cards.push({
                        id: 'C' + Date.now(),
                        studentId: newStudent.id || newStudent._id,
                        studentName: newStudent.name,
                        rollNo: newStudent.rollNo,
                        year: newStudent.year,
                        cardNumber: cardNo,
                        issueDate: new Date().toISOString().split('T')[0],
                        status: 'Active'
                    });
                }
                DB.set('libraryCards', cards);
            }"""

# Actually, if rollNo or year changes, we should UPDATE the existing card's rollNo/year, not auto-generate a new one!
# Let's change this to just update the existing card's info!

new_block = """            // Auto-update library card info if year, rollNo, or name changed
            if (oldStudent.year !== newStudent.year || oldStudent.rollNo !== newStudent.rollNo || oldStudent.name !== newStudent.name) {
                let cards = DB.getLibraryCards() || [];
                const studentIdStr = String(newStudent.id || newStudent._id);
                
                cards.forEach(c => {
                    if ((c.studentId && String(c.studentId) === studentIdStr) || 
                        (String(c.rollNo) === String(oldStudent.rollNo) && String(c.year) === String(oldStudent.year))) {
                        
                        c.year = newStudent.year;
                        c.rollNo = newStudent.rollNo;
                        c.studentName = newStudent.name;
                    }
                });
                DB.set('libraryCards', cards);
            }"""

content = content.replace(old_block, new_block)

with open('data.js', 'w') as f:
    f.write(content)
