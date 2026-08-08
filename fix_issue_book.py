import re
with open('librarian.js', 'r') as f:
    content = f.read()

# Fix the issue book dropdown to use cardNumber instead of studentId
old_select = """            <option value="">-- Select Student --</option>
            ${allCards.filter(c => c.status !== 'Deleted').map(c => `
                <option value="${c.studentId}">${c.studentName} (Roll: ${c.rollNo}, ${c.year}) - Card: ${c.cardNumber}</option>
            `).join('')}
        </select>"""

new_select = """            <option value="">-- Select Student --</option>
            ${allCards.filter(c => c.status !== 'Deleted').map(c => `
                <option value="${c.cardNumber}">${c.studentName} (Roll: ${c.rollNo}, ${c.year}) - Card: ${c.cardNumber}</option>
            `).join('')}
        </select>"""

content = content.replace(old_select, new_select)

# Fix window.issueBook to look up by cardNumber
old_issue = """window.issueBook = (event) => {
    event.preventDefault();
    const studentId = document.getElementById('issue_student').value;
    const student = DB.getStudents().find(s => s._id === studentId || s.id === studentId);
    
    if(!student) return showToast('Student not found!', 'error');

    let allCards = DB.getLibraryCards() || [];
    const card = allCards.find(c => (c.studentId && (String(c.studentId) === String(student.id || student._id))) || (String(c.rollNo) === String(student.rollNo) && c.year === student.year));"""

new_issue = """window.issueBook = (event) => {
    event.preventDefault();
    const cardNumber = document.getElementById('issue_student').value;
    let allCards = DB.getLibraryCards() || [];
    const card = allCards.find(c => c.cardNumber === cardNumber);
    
    if(!card) return showToast('Library card not found!', 'error');
    
    const student = DB.getStudents().find(s => String(s.rollNo) === String(card.rollNo) && String(s.year) === String(card.year));
    if(!student) return showToast('Student not found!', 'error');"""

content = content.replace(old_issue, new_issue)

# Also fix the libraryFines and libraryBooks logic in student.js
with open('librarian.js', 'w') as f:
    f.write(content)

