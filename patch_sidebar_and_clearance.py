import re

with open('librarian.js', 'r') as f:
    content = f.read()

# Add Library Clearance button to sidebar
old_sidebar = """                <button onclick="window.currentLibrarianView='track'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'track' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-list-alt w-6"></i> Tracker
                </button>
                
                <div class="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">"""

new_sidebar = """                <button onclick="window.currentLibrarianView='track'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'track' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-list-alt w-6"></i> Tracker
                </button>
                <button onclick="window.currentLibrarianView='clearance'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'clearance' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-clipboard-check w-6"></i> Clearance (+2 1st)
                </button>
                
                <div class="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">"""

content = content.replace(old_sidebar, new_sidebar)

# Add conditional rendering for clearance view
old_render = "${(!window.currentLibrarianView || window.currentLibrarianView === 'issue') ? renderLibrarianIssueView() : renderLibrarianTrackerView()}"

new_render = "${(!window.currentLibrarianView || window.currentLibrarianView === 'issue') ? renderLibrarianIssueView() : (window.currentLibrarianView === 'track' ? renderLibrarianTrackerView() : renderLibrarianClearanceView())}"

content = content.replace(old_render, new_render)

# Append clearance logic
clearance_logic = """

// ===== LIBRARY CLEARANCE FEATURE =====
window.publishClearanceNotice = () => {
    const deadline = document.getElementById('clearance_deadline').value;
    if(!deadline) return showToast('Please select a deadline', 'error');

    // Get all +2 1st year students with unreturned books
    const students = DB.getStudents() || [];
    const books = DB.getLibraryBooks() || [];
    
    const unreturnedFirstYears = students.filter(s => s.year === '+2 1st year' && books.some(b => String(b.studentRoll) === String(s.rollNo) && String(b.studentYear) === String(s.year) && b.status === 'Issued'));
    
    if(unreturnedFirstYears.length === 0) return showToast('No students require clearance', 'error');
    
    let studentListHTML = unreturnedFirstYears.map(s => `- ${s.name} (Roll: ${s.rollNo})`).join('\\n');
    
    const newNotice = {
        id: 'N' + Date.now(),
        title: 'URGENT: Library Clearance Required for +2 1st Year',
        content: `The following +2 1st year students have unreturned library books. You MUST return your books by **${deadline}** or your promotion to 2nd year will be blocked.\\n\\nStudents:\\n${studentListHTML}`,
        date: new Date().toISOString().split('T')[0],
        target: 'all' // visible to all students
    };
    
    let allNotices = DB.getNotices() || [];
    allNotices.push(newNotice);
    DB.set('notices', allNotices);
    
    showToast('Clearance notice published successfully!');
    navigate('librarian');
};

function renderLibrarianClearanceView() {
    const students = DB.getStudents() || [];
    const books = DB.getLibraryBooks() || [];
    
    const unreturnedFirstYears = students.filter(s => s.year === '+2 1st year' && books.some(b => String(b.studentRoll) === String(s.rollNo) && String(b.studentYear) === String(s.year) && b.status === 'Issued'));
    
    let html = `
    <div class="glass-card p-6">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-clipboard-check text-primary"></i> +2 1st Year Library Clearance</h3>
        </div>
        
        <div class="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <p class="font-bold text-gray-800 dark:text-white">${unreturnedFirstYears.length} Students Pending Clearance</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">These 1st year students cannot be promoted until they return their issued books.</p>
            </div>
            
            <div class="flex gap-2 w-full sm:w-auto">
                <input type="date" id="clearance_deadline" class="px-3 py-2 rounded-lg border dark:bg-gray-600 dark:border-gray-500 text-sm">
                <button onclick="publishClearanceNotice()" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm text-sm whitespace-nowrap">
                    <i class="fas fa-bullhorn mr-1"></i> Publish Notice
                </button>
            </div>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left whitespace-nowrap">
                <thead>
                    <tr class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <th class="px-4 py-3 font-semibold rounded-tl-lg">Student Name</th>
                        <th class="px-4 py-3 font-semibold">Roll Number</th>
                        <th class="px-4 py-3 font-semibold">Unreturned Book</th>
                        <th class="px-4 py-3 font-semibold rounded-tr-lg">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
    `;
    
    if(unreturnedFirstYears.length === 0) {
        html += `<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500">All 1st year students have cleared their library dues!</td></tr>`;
    } else {
        unreturnedFirstYears.forEach(s => {
            const theirBook = books.find(b => String(b.studentRoll) === String(s.rollNo) && String(b.studentYear) === String(s.year) && b.status === 'Issued');
            html += `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td class="px-4 py-3 font-medium">${s.name}</td>
                <td class="px-4 py-3">${s.rollNo}</td>
                <td class="px-4 py-3 text-red-600 font-medium">${theirBook ? theirBook.bookName : 'Unknown'}</td>
                <td class="px-4 py-3">
                    <button onclick="window.currentLibrarianView='track'; navigate('librarian')" class="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded font-medium transition-colors">Go to Tracker</button>
                </td>
            </tr>
            `;
        });
    }
    
    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;
    return html;
}
"""

with open('librarian.js', 'a') as f:
    f.write(clearance_logic)

with open('librarian.js', 'w') as f:
    f.write(content + clearance_logic)

