with open('admin.js', 'r') as f:
    content = f.read()

import re

old_promo = """    // Remove 2nd years from students array
    allStudents = allStudents.filter(s => s.year !== '+2 2nd year');
    
    // Prepare fresh library cards array for the new batch
    let allLibraryCards = [];
    
    // Promote 1st years
    allStudents.forEach((s, index) => {
        if(!s.year || s.year === '+2 1st year') {
            s.year = '+2 2nd year';
            s.profileComplete = false;
            
            // Promote corresponding user record
            const userRec = allUsers.find(u => {
                if (u.role !== 'student') return false;
                if (s._id && u._id) return String(u._id) === String(s._id);
                return String(u.id) === String(s.rollNo) && (!u.year || u.year === '+2 1st year');
            });
            if (userRec) {
                userRec.year = '+2 2nd year';
            }
            
            // Auto-generate new library card for the promoted student
            if (s.name && s.rollNo && !s.libraryCardRevoked) {
                const cardNo = `LIB-2-${new Date().getFullYear()}-${s.rollNo}`;
                allLibraryCards.push({
                    id: 'C' + Date.now() + index,
                    studentId: s.id || s._id,
                    studentName: s.name,
                    rollNo: s.rollNo,
                    year: s.year,
                    cardNumber: cardNo,
                    issueDate: new Date().toISOString().split('T')[0],
                    status: 'Active'
                });
            }
        }
    });"""

new_promo = """    // Remove 2nd years from students array
    allStudents = allStudents.filter(s => s.year !== '+2 2nd year');
    
    // Filter library cards to remove graduating 2nd years
    let allLibraryCards = DB.getLibraryCards() || [];
    allLibraryCards = allLibraryCards.filter(c => c.year !== '+2 2nd year');
    
    // Promote 1st years
    allStudents.forEach((s, index) => {
        if(!s.year || s.year === '+2 1st year') {
            // Update their library card to reflect the new year
            const theirCard = allLibraryCards.find(c => 
                (c.studentId && String(c.studentId) === String(s.id || s._id)) || 
                (String(c.rollNo) === String(s.rollNo) && c.year === s.year)
            );
            
            s.year = '+2 2nd year';
            s.profileComplete = false;
            
            if (theirCard) {
                theirCard.year = s.year;
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
    });"""

content = content.replace(old_promo, new_promo)

with open('admin.js', 'w') as f:
    f.write(content)
