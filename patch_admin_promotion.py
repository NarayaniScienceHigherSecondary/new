import re

with open('admin.js', 'r') as f:
    content = f.read()

old_promo = """    // Remove 2nd years from students array
    allStudents = allStudents.filter(s => s.year !== '+2 2nd year');
    
    // Filter library cards to remove graduating 2nd years
    let allLibraryCards = DB.getLibraryCards() || [];
    allLibraryCards = allLibraryCards.filter(c => c.year !== '+2 2nd year');
    
    // Promote 1st years
    allStudents.forEach((s, index) => {
        if(!s.year || s.year === '+2 1st year') {
            // Update their library card to reflect the new year
            const theirCard = allLibraryCards.find(c => String(c.rollNo) === String(s.rollNo));
            
            s.year = '+2 2nd year';
            s.profileComplete = false;
            
            if (theirCard) {
                console.log('Promoting card for RollNo', s.rollNo, 'Old number:', theirCard.cardNumber);
                theirCard.year = s.year;
                console.log('Promoted card. New number:', theirCard.cardNumber);
            } else {
                console.warn('NO CARD FOUND during promotion for RollNo', s.rollNo);
            }
            
            // Promote corresponding user record
            const userRec = allUsers.find(u => {
                if (u.role !== 'student') return false;
                if (s._id && u._id) return String(u._id) === String(s._id);
                return String(u.id) === String(s.rollNo) && (!u.year || u.year === '+2 1st year');
            });
            if (userRec) {
                userRec.year = '+2 2nd year';
            }
        }
    });

    // Save back to DB
    DB.set('users', allUsers);
    DB.set('students', allStudents);
    DB.set('libraryCards', allLibraryCards);
    DB.set('attendance', []); // Reset attendance for the new academic year
    DB.set('libraryBooks', []); // Clear old issued books for the new academic year
    DB.set('libraryFines', []); // Clear old library fines for the new academic year
    
    showToast("Successfully promoted 1st year students, cleared the old batch, and updated library cards.");
    navigate('admin_students'); // Refresh UI
};"""

new_promo = """    // Get books to check clearance
    const allBooks = DB.getLibraryBooks() || [];
    const blockedStudents = [];

    // Remove 2nd years from students array
    allStudents = allStudents.filter(s => s.year !== '+2 2nd year');
    
    // Filter library cards to remove graduating 2nd years
    let allLibraryCards = DB.getLibraryCards() || [];
    allLibraryCards = allLibraryCards.filter(c => c.year !== '+2 2nd year');
    
    // Promote 1st years
    let promotedCount = 0;
    allStudents.forEach((s, index) => {
        if(!s.year || s.year === '+2 1st year') {
            // Check library clearance
            const hasUnreturnedBook = allBooks.some(b => String(b.studentRoll) === String(s.rollNo) && String(b.studentYear) === String(s.year) && b.status === 'Issued');
            
            if (hasUnreturnedBook) {
                blockedStudents.push(`${s.name} (Roll: ${s.rollNo})`);
                return; // Skip promotion for this student
            }

            // Update their library card to reflect the new year
            const theirCard = allLibraryCards.find(c => String(c.rollNo) === String(s.rollNo));
            
            s.year = '+2 2nd year';
            s.profileComplete = false;
            
            if (theirCard) {
                console.log('Promoting card for RollNo', s.rollNo, 'Old number:', theirCard.cardNumber);
                theirCard.year = s.year;
                console.log('Promoted card. New number:', theirCard.cardNumber);
            } else {
                console.warn('NO CARD FOUND during promotion for RollNo', s.rollNo);
            }
            
            // Promote corresponding user record
            const userRec = allUsers.find(u => {
                if (u.role !== 'student') return false;
                if (s._id && u._id) return String(u._id) === String(s._id);
                return String(u.id) === String(s.rollNo) && (!u.year || u.year === '+2 1st year');
            });
            if (userRec) {
                userRec.year = '+2 2nd year';
            }
            promotedCount++;
        }
    });

    // Save back to DB
    DB.set('users', allUsers);
    DB.set('students', allStudents);
    DB.set('libraryCards', allLibraryCards);
    DB.set('attendance', []); // Reset attendance for the new academic year
    
    // We must NOT clear library books if there are blocked students holding them!
    // But the prompt says "Clear old issued books for the new academic year". 
    // We should only clear returned books, OR we keep unreturned books.
    // Let's keep unreturned books and delete returned ones.
    const remainingBooks = allBooks.filter(b => b.status === 'Issued');
    DB.set('libraryBooks', remainingBooks); 
    
    DB.set('libraryFines', []); // Clear old library fines for the new academic year
    
    if (blockedStudents.length > 0) {
        alert(`Successfully promoted ${promotedCount} students.\\n\\nWARNING: ${blockedStudents.length} students were BLOCKED from promotion because they have unreturned library books (No Clearance):\\n\\n${blockedStudents.join('\\n')}`);
    } else {
        showToast("Successfully promoted 1st year students, cleared the old batch, and updated library cards.");
    }
    navigate('admin_students'); // Refresh UI
};"""

content = content.replace(old_promo, new_promo)

with open('admin.js', 'w') as f:
    f.write(content)
