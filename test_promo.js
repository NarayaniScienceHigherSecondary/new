const DB = {
    getStudents: () => [
        {rollNo: "1", year: "+2 1st year"},
        {rollNo: "2", year: "+2 2nd year"}
    ],
    getUsers: () => [
        {id: "1", role: "student", year: "+2 1st year"},
        {id: "2", role: "student", year: "+2 2nd year"}
    ],
    getLibraryCards: () => [
        {cardNumber: "C1", rollNo: "1", year: "+2 1st year"},
        {cardNumber: "C2", rollNo: "2", year: "+2 2nd year"}
    ],
    getLibraryBooks: () => [
        {id: "B1", cardNumber: "C1", studentRoll: "1", studentYear: "+2 1st year", status: "Issued"},
        {id: "B2", cardNumber: "C2", studentRoll: "2", studentYear: "+2 2nd year", status: "Returned"}
    ],
    set: (k, v) => console.log('SET', k, v)
};

let allStudents = DB.getStudents();
let allUsers = DB.getUsers();
const secondYearStudents = allStudents.filter(s => s.year === '+2 2nd year');
allUsers = allUsers.filter(u => {
    if (u.role !== 'student') return true;
    if (u.year === '+2 2nd year') return false;
    return true;
});

const allBooks = DB.getLibraryBooks() || [];
const blockedStudents = [];

allStudents = allStudents.filter(s => s.year !== '+2 2nd year');

let allLibraryCards = DB.getLibraryCards() || [];
allLibraryCards = allLibraryCards.filter(c => c.year !== '+2 2nd year');

let promotedCount = 0;
allStudents.forEach((s, index) => {
    if(!s.year || s.year === '+2 1st year') {
        const hasUnreturnedBook = allBooks.some(b => String(b.studentRoll) === String(s.rollNo) && String(b.studentYear) === String(s.year) && b.status === 'Issued');
        
        if (hasUnreturnedBook) {
            blockedStudents.push(`${s.name} (Roll: ${s.rollNo})`);
            return;
        }

        const theirCard = allLibraryCards.find(c => String(c.rollNo) === String(s.rollNo));
        
        allBooks.forEach(b => {
            if (String(b.studentRoll) === String(s.rollNo) && b.studentYear === '+2 1st year') {
                b.studentYear = '+2 2nd year';
            }
        });
        
        s.year = '+2 2nd year';
        s.profileComplete = false;
        
        if (theirCard) {
            theirCard.year = s.year;
        }
        promotedCount++;
    }
});

DB.set('users', allUsers);
DB.set('students', allStudents);
DB.set('libraryCards', allLibraryCards);
DB.set('libraryBooks', allBooks);
console.log('Blocked:', blockedStudents);

