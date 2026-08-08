import re
with open('student.js', 'r') as f:
    content = f.read()

# Remove the oldCards deletion block
old_cards_block = """    let oldCards = allStudentCards.filter(c => String(c.year) !== String(student.year));
    oldCards.forEach(c => {
        if (DB && typeof DB.deleteLibraryCard === 'function') {
            DB.deleteLibraryCard(c.id || c.cardNumber);
        }
    });"""

# We can replace it with empty string, but wait, maybe the librarian updated the card to 2nd year? Yes.
# But it's safer to just remove this aggressive client-side deletion.
content = content.replace(old_cards_block, "")

# Remove the Auto-generate library card block
auto_gen_block = """    // Auto-generate library card if student has all 3 details and it was not revoked by librarian
    if (student && !libraryCard && student.name && student.rollNo && student.year && !student.libraryCardRevoked) {
        let yearPrefix = '0';
        if (student.year === '+2 1st year') yearPrefix = '1';
        else if (student.year === '+2 2nd year') yearPrefix = '2';
        
        const cardNo = `LIB-${yearPrefix}-${new Date().getFullYear()}-${student.rollNo}`;
        libraryCard = {
            id: 'C' + Date.now(),
            studentId: student.id,
            studentName: student.name,
            rollNo: student.rollNo,
            year: student.year,
            cardNumber: cardNo,
            issueDate: new Date().toISOString().split('T')[0],
            status: 'Active'
        };
        if (DB && typeof DB.addLibraryCard === 'function') {
            DB.addLibraryCard(libraryCard);
        }
    }"""

content = content.replace(auto_gen_block, "")

# We also need to fix libraryCard finding since now we might just have a library card whose year is STILL +2 1st year
# even though the student is +2 2nd year? No, we update the card's year on promotion.
# But just in case, find ANY library card belonging to this student (Active or Suspended)
old_find = """    let libraryCard = allStudentCards.find(c => String(c.year) === String(student.year));"""
new_find = """    // Find the student's active or suspended library card
    let libraryCard = allStudentCards.find(c => c.status !== 'Deleted');"""
content = content.replace(old_find, new_find)

with open('student.js', 'w') as f:
    f.write(content)

