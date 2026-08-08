const fs = require('fs');

let librarianContent = fs.readFileSync('librarian.js', 'utf8');

// 1. Update the status display in the tracker
librarianContent = librarianContent.replace(
    '${status === \'Suspended\' ? \'bg-yellow-100 text-yellow-800\' : \'bg-green-100 text-green-800\'}',
    '${status === \'Deleted\' ? \'bg-red-100 text-red-800\' : status === \'Suspended\' ? \'bg-yellow-100 text-yellow-800\' : \'bg-green-100 text-green-800\'}'
);

// 2. Update the buttons logic
const oldButtonsLogic = `                    \${status === 'Suspended' ? \`
                    <button onclick="window.renewLibraryCard('\${c.id || c.cardNumber}')" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                        <i class="fas fa-check"></i> Renew
                    </button>
                    \` : \`
                    <button onclick="window.suspendLibraryCard('\${c.id || c.cardNumber}')" class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                        <i class="fas fa-pause"></i> Suspend
                    </button>
                    \`}
                    <button onclick="window.revokeLibraryCard('\${c.id || c.cardNumber}')" class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                        <i class="fas fa-trash"></i> Delete
                    </button>`;

const newButtonsLogic = `                    \${status === 'Deleted' ? \`
                    <button onclick="window.generateLibraryCard('\${c.id || c.cardNumber}')" class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                        <i class="fas fa-id-card"></i> Generate New Card
                    </button>
                    \` : status === 'Suspended' ? \`
                    <button onclick="window.renewLibraryCard('\${c.id || c.cardNumber}')" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                        <i class="fas fa-check"></i> Renew
                    </button>
                    <button onclick="window.revokeLibraryCard('\${c.id || c.cardNumber}')" class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    \` : \`
                    <button onclick="window.suspendLibraryCard('\${c.id || c.cardNumber}')" class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                        <i class="fas fa-pause"></i> Suspend
                    </button>
                    <button onclick="window.revokeLibraryCard('\${c.id || c.cardNumber}')" class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    \`}`;

librarianContent = librarianContent.replace(oldButtonsLogic, newButtonsLogic);

// 3. Add window.generateLibraryCard to the bottom of the functions
const generateFunction = `
window.generateLibraryCard = (cardId) => {
    if(confirm("Are you sure you want to generate a NEW library card for this student? The issue date will be updated to today.")) {
        if(DB && typeof DB.generateLibraryCard === 'function') {
            DB.generateLibraryCard(cardId);
            showToast('New Library Card Generated Successfully');
            navigate('librarian');
        }
    }
};
`;

librarianContent += generateFunction;
fs.writeFileSync('librarian.js', librarianContent, 'utf8');

let dataContent = fs.readFileSync('data.js', 'utf8');
const oldDeleteFunc = `    deleteLibraryCard: (cardId) => {
        let cards = DB.getLibraryCards();
        const card = cards.find(c => c.id === cardId || c.cardNumber === cardId);
        if(!card) return;
        
        cards = cards.filter(c => c.id !== cardId && c.cardNumber !== cardId);
        DB.set('libraryCards', cards);
    },`;
const newDeleteFunc = `    deleteLibraryCard: (cardId) => {
        let cards = DB.getLibraryCards();
        const card = cards.find(c => c.id === cardId || c.cardNumber === cardId);
        if(!card) return;
        
        card.status = 'Deleted';
        DB.set('libraryCards', cards);
        
        let students = DB.getStudents();
        let student = students.find(s => String(s.rollNo) === String(card.rollNo) && String(s.year) === String(card.year));
        if (student) {
            student.libraryCardRevoked = true;
            DB.set('students', students);
        }
    },
    generateLibraryCard: (cardId) => {
        let cards = DB.getLibraryCards();
        const card = cards.find(c => c.id === cardId || c.cardNumber === cardId);
        if(!card) return;
        
        card.status = 'Active';
        card.issueDate = new Date().toISOString().split('T')[0];
        DB.set('libraryCards', cards);
        
        let students = DB.getStudents();
        let student = students.find(s => String(s.rollNo) === String(card.rollNo) && String(s.year) === String(card.year));
        if (student) {
            student.libraryCardRevoked = false;
            DB.set('students', students);
        }
    },`;

dataContent = dataContent.replace(oldDeleteFunc, newDeleteFunc);
fs.writeFileSync('data.js', dataContent, 'utf8');
