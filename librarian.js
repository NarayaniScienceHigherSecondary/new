// librarian.js - Library Management System

window.renderLibrarianDashboard = () => {
    // Top-level layout with sidebar (similar to staff dashboard, but for librarian)
    
    return `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
        
        <!-- Sidebar -->
        <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block relative z-20">
            <div class="p-6">
                <div class="flex items-center gap-3">
                    <i class="fas fa-book-reader text-2xl text-primary"></i>
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white">Library</h2>
                </div>
            </div>
            
            <nav class="px-4 py-4 space-y-2">
                <button onclick="window.currentLibrarianView='issue'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${!window.currentLibrarianView || window.currentLibrarianView === 'issue' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-book-medical w-6"></i> Issue Book
                </button>
                <button onclick="window.currentLibrarianView='track'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'track' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-list-alt w-6"></i> Tracker
                </button>
                <button onclick="window.currentLibrarianView='clearance'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'clearance' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-clipboard-check w-6"></i> Clearance (+2 1st)
                </button>
                
                <div class="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
                    <button onclick="logout()" class="w-full text-left px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <i class="fas fa-sign-out-alt w-6"></i> Logout
                    </button>
                </div>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-4 md:p-8 overflow-y-auto w-full">
            <!-- Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Librarian Dashboard</h1>
                    <p class="text-gray-600 dark:text-gray-400">Manage digital library cards and book issuance</p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold">
                            ${(currentUser.name || 'Librarian').charAt(0)}
                        </div>
                        <div>
                            <p class="font-medium text-gray-800 dark:text-white">${currentUser.name || 'Librarian'}</p>
                            <p class="text-xs text-gray-500">${currentUser.designation || 'Staff'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            ${(!window.currentLibrarianView || window.currentLibrarianView === 'issue') ? renderLibrarianIssueView() : (window.currentLibrarianView === 'track' ? renderLibrarianTrackerView() : (window.currentLibrarianView === 'profile' ? renderLibrarianProfile() : renderLibrarianClearanceView()))}
            
        </main>
    </div>
    `;
};

function renderLibrarianIssueView() {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if a student is selected
    const selectedYear = window.librarySelectedYear || '';
    const selectedRoll = window.librarySelectedRoll || '';
    
    let studentCard = null;
    let studentObj = null;
    if(selectedYear && selectedRoll) {
        studentObj = DB.getStudents().find(s => String(s.year) === String(selectedYear) && String(s.rollNo) === String(selectedRoll));
        if(studentObj) {
            studentCard = DB.getLibraryCards().find(c => String(c.rollNo) === String(studentObj.rollNo) && String(c.year) === String(studentObj.year));
        }
    }
    
    return `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Step 1: Select Student -->
        <div class="glass-card p-6">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-search text-primary"></i> Find Student</h3>
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Year</label>
                    <select id="lib_search_year" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="">Select Year</option>
                        <option value="+2 1st year" ${selectedYear === '+2 1st year' ? 'selected' : ''}>+2 1st Year</option>
                        <option value="+2 2nd year" ${selectedYear === '+2 2nd year' ? 'selected' : ''}>+2 2nd Year</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Roll Number</label>
                    <input type="text" id="lib_search_roll" value="${selectedRoll}" placeholder="e.g. 101" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" onkeydown="if(event.key==='Enter') document.getElementById('lib_search_btn').click()">
                </div>
                <div class="col-span-2">
                    <button id="lib_search_btn" onclick="window.librarySelectedYear=document.getElementById('lib_search_year').value; window.librarySelectedRoll=document.getElementById('lib_search_roll').value; navigate('librarian')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
                        <i class="fas fa-search"></i> Search Student
                    </button>
                </div>
            </div>
            
            ${studentObj ? `
                <div class="mt-6 p-4 border rounded-lg bg-blue-50 dark:bg-gray-700 border-blue-200 dark:border-gray-600">
                    <h4 class="font-bold text-gray-800 dark:text-white mb-2">Student Found</h4>
                    <p><strong>Name:</strong> ${studentObj.name}</p>
                    <p><strong>Roll No:</strong> ${studentObj.rollNo}</p>
                    <p><strong>Email:</strong> ${studentObj.email}</p>
                    
                    ${studentCard ? (
                        studentCard.status === 'Suspended' ? `
                        <div class="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded border border-yellow-200 flex items-center justify-between font-bold">
                            <div><i class="fas fa-exclamation-triangle"></i> Library Card Suspended (No: ${studentCard.cardNumber})</div>
                            <button onclick="window.renewLibraryCard('${studentCard.id || studentCard.cardNumber}')" class="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors shadow-sm"><i class="fas fa-check"></i> Renew</button>
                        </div>
                        ` : `
                        <div class="mt-4 p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded border border-green-200 flex items-center justify-between font-bold">
                            <div><i class="fas fa-check-circle"></i> Digital Library Card Verified (No: ${studentCard.cardNumber})</div>
                            <button onclick="window.suspendLibraryCard('${studentCard.id || studentCard.cardNumber}')" class="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded transition-colors shadow-sm mr-2"><i class="fas fa-pause"></i> Suspend</button>
                            <button onclick="window.revokeLibraryCard('${studentCard.id || studentCard.cardNumber}')" class="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors shadow-sm"><i class="fas fa-trash"></i> Delete Card</button>
                        </div>
                        `
                    ) : `
                        <div class="mt-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded border border-red-200 flex items-center gap-2 font-bold">
                            <i class="fas fa-times-circle"></i> Student has not generated their Library Card yet! (Or it was deleted)
                        </div>
                    `}
                </div>
            ` : (selectedRoll ? `<div class="mt-4 text-red-500 font-bold">Student not found.</div>` : '')}
        </div>
        
        <!-- Step 2: Issue Book -->
        <div class="glass-card p-6 ${!studentCard ? 'opacity-50 pointer-events-none' : ''}">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-book text-primary"></i> Issue Book</h3>
            <form onsubmit="handleIssueBook(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Book Name</label>
                    <input type="text" id="lib_book_name" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Author</label>
                    <input type="text" id="lib_book_author" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Book Number / ISBN</label>
                    <input type="text" id="lib_book_number" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Issue Date</label>
                        <input type="date" id="lib_issue_date" value="${today}" readonly class="w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 cursor-not-allowed">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Return Due Date</label>
                        <input type="date" id="lib_return_date" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                </div>
                
                <button type="submit" class="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-4 flex items-center justify-center gap-2">
                    <i class="fas fa-check-circle"></i> Issue Book
                </button>
            </form>
        </div>
    </div>
    `;
}

window.handleIssueBook = (e) => {
    e.preventDefault();
    const student = DB.getStudents().find(s => String(s.year) === String(window.librarySelectedYear) && String(s.rollNo) === String(window.librarySelectedRoll));
    if(!student) return showToast('Select a valid student first', 'error');
    
    const card = DB.getLibraryCards().find(c => String(c.rollNo) === String(student.rollNo) && String(c.year) === String(student.year));
    if(!card) return showToast('Student has no library card', 'error');
    if(card.status === 'Suspended') return showToast('Cannot issue books to a suspended library card', 'error');
    
    // Enforce ONE book per student limit
    const allBooks = DB.getLibraryBooks() || [];
    const unreturnedBook = allBooks.find(b => String(b.studentRoll) === String(student.rollNo) && String(b.studentYear) === String(student.year) && b.status === 'Issued');
    if (unreturnedBook) {
        return showToast('Student already has an unreturned book. They must return it before a new one can be issued.', 'error');
    }
    
    const bookName = document.getElementById('lib_book_name').value.trim();
    const author = document.getElementById('lib_book_author').value.trim();
    const bookNumber = document.getElementById('lib_book_number').value.trim();
    const issueDate = document.getElementById('lib_issue_date').value;
    const returnDate = document.getElementById('lib_return_date').value;
    
    const newBook = {
        id: 'B' + Date.now(),
        studentId: student.id,
        studentName: student.name,
        studentRoll: student.rollNo,
        studentYear: student.year,
        cardNumber: card.cardNumber,
        bookName,
        author,
        bookNumber,
        issueDate,
        returnDate,
        status: 'Issued'
    };
    
    DB.addLibraryBook(newBook);
    showToast('Book issued successfully!');
    
    // Clear form
    document.getElementById('lib_book_name').value = '';
    document.getElementById('lib_book_author').value = '';
    document.getElementById('lib_book_number').value = '';
    document.getElementById('lib_return_date').value = '';
    
    // Switch to tracker to see it
    window.currentLibrarianView = 'track';
    navigate('librarian');
};

function renderLibrarianTrackerView() {
    const books = DB.getLibraryBooks();
    
    let html = `
    <div class="glass-card p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 class="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-list text-primary"></i> Issued Books Tracker</h3>
            <div class="flex gap-2 w-full sm:w-auto">
                <select id="tracker_category_filter" onchange="window.filterTrackerGroups()" class="px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm shadow-sm focus:ring-primary focus:border-primary">
                    <option value="all">View All Batches</option>
                    <option value="past">Past / Deleted Students</option>
                    <option value="2nd">+2 2nd Year Students</option>
                    <option value="1st">+2 1st Year Students</option>
                </select>
                <button onclick="window.exportTrackerToExcel()" class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-colors">
                    <i class="fas fa-file-excel"></i> Export
                </button>
            </div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Books Issued</p>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">${books.length}</p>
            </div>
            <div class="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg border border-yellow-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Currently Issued</p>
                <p class="text-2xl font-bold text-yellow-700 dark:text-yellow-400">${books.filter(b => b.status === 'Issued').length}</p>
            </div>
            <div class="bg-green-50 dark:bg-gray-700 p-4 rounded-lg border border-green-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Returned</p>
                <p class="text-2xl font-bold text-green-700 dark:text-green-400">${books.filter(b => b.status === 'Returned').length}</p>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left whitespace-nowrap">
                <thead>
                    <tr class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <th class="px-4 py-3 font-semibold rounded-tl-lg">Student</th>
                        <th class="px-4 py-3 font-semibold">Roll & Year</th>
                        <th class="px-4 py-3 font-semibold">Book Name</th>
                        <th class="px-4 py-3 font-semibold">Book No.</th>
                        <th class="px-4 py-3 font-semibold">Issue Date</th>
                        <th class="px-4 py-3 font-semibold">Return Date</th>
                        <th class="px-4 py-3 font-semibold">Status</th>
                        <th class="px-4 py-3 font-semibold rounded-tr-lg">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
    `;
    
    if(books.length === 0) {
        html += `<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">No books have been issued yet.</td></tr>`;
    } else {
        const allStudents = DB.getStudents() || [];
        
        // Group books
        const deletedBooks = [];
        const secondYearBooks = [];
        const firstYearBooks = [];
        
        const allCards = DB.getLibraryCards() || [];
        
        books.forEach(b => {
            const card = allCards.find(c => c.cardNumber === b.cardNumber);
            let activeStudent = null;
            if (card) {
                activeStudent = allStudents.find(s => String(s.rollNo) === String(card.rollNo) && s.year === card.year);
            }
            // Fallback for older books that might not have a valid card attached
            // If a book HAS a cardNumber but the card wasn't found, it means the student graduated/was deleted.
            if (!activeStudent && !b.cardNumber && b.studentRoll && b.studentYear) {
                activeStudent = allStudents.find(s => String(s.rollNo) === String(b.studentRoll) && s.year === b.studentYear);
            }
            
            if (!activeStudent) {
                deletedBooks.push(b);
            } else if (activeStudent.year === '+2 2nd year') {
                secondYearBooks.push(b);
            } else {
                firstYearBooks.push(b);
            }
        });
        
        console.log('Deleted Books Count:', deletedBooks.length, deletedBooks);
        console.log('Second Year Books Count:', secondYearBooks.length, secondYearBooks);
        console.log('First Year Books Count:', firstYearBooks.length, firstYearBooks);
        
        // Helper function to render a category
        const renderCategory = (categoryBooks, title, bgColorClass, iconClass, categoryId) => {
            if (categoryBooks.length === 0) return '';
            
            // Sort by newest issue date within the category
            const sorted = [...categoryBooks].sort((a,b) => new Date(b.issueDate) - new Date(a.issueDate));
            
            let catHtml = `
            <tr class="${bgColorClass} tracker-group" data-category="${categoryId}">
                <td colspan="8" class="px-4 py-2 font-bold text-gray-700 dark:text-gray-200">
                    <i class="${iconClass} mr-2"></i> ${title} (${sorted.length})
                </td>
            </tr>`;
            
            sorted.forEach(b => {
                const isOverdue = b.status === 'Issued' && new Date(b.returnDate) < new Date(new Date().toISOString().split('T')[0]);
                const statusClass = b.status === 'Returned' ? 'bg-green-100 text-green-800' : (isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800');
                
                catHtml += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors tracker-group" data-category="${categoryId}">
                    <td class="px-4 py-3 border-l-4 border-transparent hover:border-primary">
                        <p class="font-medium text-gray-800 dark:text-white">${b.studentName}</p>
                        <p class="text-xs text-gray-500">Card: ${b.cardNumber}</p>
                    </td>
                    <td class="px-4 py-3">
                        Roll: ${b.studentRoll}<br><span class="text-xs">Yr: ${b.studentYear}</span>
                    </td>
                    <td class="px-4 py-3">
                        <p class="font-medium text-gray-800 dark:text-white">${b.bookName}</p>
                        <p class="text-xs text-gray-500">${b.author}</p>
                    </td>
                    <td class="px-4 py-3">${b.bookNumber}</td>
                    <td class="px-4 py-3">${b.issueDate}</td>
                    <td class="px-4 py-3 ${isOverdue ? 'text-red-500 font-bold' : ''}">${b.returnDate}</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 text-xs rounded-full font-medium ${statusClass}">
                            ${b.status} ${isOverdue ? '(Overdue)' : ''}
                        </span>
                    </td>
                    <td class="px-4 py-3 flex gap-2 items-center">
                        ${b.status === 'Issued' ? `
                            <button onclick="window.markBookReturned('${b.id}')" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors shadow-sm" title="Mark as Returned">
                                <i class="fas fa-check"></i>
                            </button>
                            <button onclick="window.openRenewBookModal('${b.id}')" class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors shadow-sm" title="Renew Book">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        ` : '<span class="text-gray-400 text-sm">Completed</span>'}
                        <button onclick="window.deleteIssuedBook('${b.id}')" class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors shadow-sm ml-auto" title="Delete Record">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
                `;
            });
            return catHtml;
        };

        // Render in requested order: Past/Deleted -> 2nd Year -> 1st Year
        html += renderCategory(deletedBooks, 'Past / Deleted Students', 'bg-gray-200 dark:bg-gray-800', 'fas fa-user-slash', 'past');
        html += renderCategory(secondYearBooks, '+2 2nd Year Students', 'bg-blue-100 dark:bg-blue-900', 'fas fa-user-graduate', '2nd');
        html += renderCategory(firstYearBooks, '+2 1st Year Students', 'bg-green-100 dark:bg-green-900', 'fas fa-user', '1st');
    }
    
    html += `
                </tbody>
            </table>
        </div>
    </div>
    
    `;
    
    const allStudents = DB.getStudents() || [];
    const allCards = DB.getLibraryCards() || [];
    
    let generatedCount = 0;
    allStudents.forEach(student => {
        const card = allCards.find(c => String(c.rollNo) === String(student.rollNo) && c.year === student.year);
        if (card && card.status !== 'Deleted') generatedCount++;
    });

    html += `
    <!-- Library Cards Tracker -->
    <div class="glass-card p-6 mt-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 class="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-id-card text-primary"></i> Library Cards Management</h3>
            <button onclick="window.deleteAllLibraryCards()" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors shadow text-sm"><i class="fas fa-trash-alt mr-2"></i> Delete All Cards</button>
        </div>
        
        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                <p class="text-2xl font-bold text-gray-800 dark:text-white" id="stat_total_students">${allStudents.length}</p>
            </div>
            <div class="bg-green-50 dark:bg-gray-700 p-4 rounded-lg border border-green-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Cards Generated</p>
                <p class="text-2xl font-bold text-green-700 dark:text-green-400" id="stat_cards_generated">${generatedCount}</p>
            </div>
            <div class="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg border border-yellow-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Pending to Generate</p>
                <p class="text-2xl font-bold text-yellow-700 dark:text-yellow-400" id="stat_pending_cards">${allStudents.length - generatedCount}</p>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left whitespace-nowrap">
                <thead>
                    <tr class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <th class="px-4 py-3 font-semibold rounded-tl-lg">Student Name</th>
                        <th class="px-4 py-3 font-semibold">Roll Number</th>
                        <th class="px-4 py-3 font-semibold">Year</th>
                        <th class="px-4 py-3 font-semibold">Card Number</th>
                        <th class="px-4 py-3 font-semibold">Status</th>
                        <th class="px-4 py-3 font-semibold rounded-tr-lg">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
    `;
    
    if(allStudents.length === 0) {
        html += `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No students registered yet.</td></tr>`;
    } else {
        allStudents.forEach(student => {
            const card = allCards.find(c => String(c.rollNo) === String(student.rollNo) && c.year === student.year);
            
            if (card && card.status !== 'Deleted') {
                
                const status = card.status || 'Active';
                html += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-4 py-3 font-medium text-gray-800 dark:text-white">${student.name}</td>
                    <td class="px-4 py-3">${student.rollNo}</td>
                    <td class="px-4 py-3">${student.year}</td>
                    <td class="px-4 py-3 font-mono text-sm text-primary">${card.cardNumber}</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 text-xs rounded-full font-medium ${status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">${status}</span>
                    </td>
                    <td class="px-4 py-3 flex gap-2">
                        ${status === 'Suspended' ? `
                        <button onclick="window.renewLibraryCard('${card.id || card.cardNumber}')" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-check"></i> Renew
                        </button>
                        ` : `
                        <button onclick="window.suspendLibraryCard('${card.id || card.cardNumber}')" class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-pause"></i> Suspend
                        </button>
                        `}
                        <button onclick="window.revokeLibraryCard('${card.id || card.cardNumber}')" class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
                `;
            } else {
                html += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-4 py-3 font-medium text-gray-800 dark:text-white">${student.name}</td>
                    <td class="px-4 py-3">${student.rollNo}</td>
                    <td class="px-4 py-3">${student.year}</td>
                    <td class="px-4 py-3 font-mono text-sm text-gray-400">Not Generated</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-600">Pending</span>
                    </td>
                    <td class="px-4 py-3 flex gap-2">
                        <button onclick="window.createNewLibraryCard('${student.rollNo}', '${student.year}')" class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-id-card"></i> Generate Card
                        </button>
                    </td>
                </tr>
                `;
            }
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

window.markBookReturned = (bookId) => {
    if(confirm('Are you sure you want to mark this book as returned?')) {
        DB.updateLibraryBook(bookId, { status: 'Returned' });
        showToast('Book marked as returned!');
        navigate('librarian');
    }
};

window.revokeLibraryCard = (cardId) => {
    if(confirm("Are you sure you want to permanently delete this student's library card? They will need to re-save their profile to generate a new one.")) {
        if(DB && typeof DB.deleteLibraryCard === 'function') {
            DB.deleteLibraryCard(cardId);
            showToast('Library Card Deleted Successfully');
            navigate('librarian');
        }
    }
};

window.suspendLibraryCard = (cardId) => {
    if(confirm("Are you sure you want to suspend this student's library card? They will not be able to issue books until renewed.")) {
        if(DB && typeof DB.suspendLibraryCard === 'function') {
            DB.suspendLibraryCard(cardId);
            showToast('Library Card Suspended');
            navigate('librarian');
        }
    }
};

window.renewLibraryCard = (cardId) => {
    if(confirm("Are you sure you want to renew this student's library card?")) {
        if(DB && typeof DB.renewLibraryCard === 'function') {
            DB.renewLibraryCard(cardId);
            showToast('Library Card Renewed');
            navigate('librarian');
        }
    }
};

window.openRenewBookModal = (bookId) => {
    const book = DB.getLibraryBooks().find(b => b.id === bookId);
    if(!book) return showToast('Book not found', 'error');
    
    // Add modal to body if it doesn't exist
    if (!document.getElementById('renewBookModalWrapper')) {
        const modalHtml = `
        <div id="renewBookModalWrapper" class="fixed inset-0 bg-black/60 z-[100] hidden items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button onclick="document.getElementById('renewBookModalWrapper').classList.add('hidden')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <i class="fas fa-times text-xl"></i>
                </button>
                <h3 class="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-sync-alt text-blue-500"></i> Renew Book</h3>
                
                <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                    <p><span class="font-bold">Book:</span> <span id="renew_book_name"></span></p>
                    <p><span class="font-bold">Student:</span> <span id="renew_student_name"></span> (<span id="renew_student_roll"></span>)</p>
                </div>
                
                <form id="renewBookForm" onsubmit="window.submitBookRenewal(event)" class="space-y-4">
                    <input type="hidden" id="renew_book_id">
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Book Condition</label>
                        <select id="renew_condition" required onchange="window.handleRenewConditionChange()" class="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                            <option value="Good">Good (Ready to Renew)</option>
                            <option value="Not Good">Not Good / Pages Missing</option>
                        </select>
                    </div>
                    
                    <div id="renew_date_section">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extended Return Date</label>
                        <input type="date" id="renew_return_date" class="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                    </div>
                    
                    <div id="renew_fine_section" class="hidden">
                        <label class="block text-sm font-medium text-red-600 dark:text-red-400 mb-1">Fine Amount (Rs)</label>
                        <input type="number" id="renew_fine_amount" min="1" placeholder="Enter fine amount" class="w-full px-3 py-2 border border-red-300 dark:border-red-600/50 rounded-lg focus:ring-red-500 focus:border-red-500 bg-red-50/50 dark:bg-red-900/10 text-gray-900 dark:text-white">
                        <p class="text-xs text-red-500 mt-1"><i class="fas fa-info-circle"></i> The book will NOT be renewed. A fine receipt will be issued directly to the student's Library Card.</p>
                    </div>
                    
                    <button type="submit" id="renew_submit_btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg mt-4 flex items-center justify-center gap-2">
                        <i class="fas fa-check"></i> Process Renewal
                    </button>
                </form>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    
    // Populate modal
    document.getElementById('renew_book_id').value = book.id;
    document.getElementById('renew_book_name').textContent = book.bookName;
    document.getElementById('renew_student_name').textContent = book.studentName;
    document.getElementById('renew_student_roll').textContent = book.studentRoll;
    
    // Reset form
    document.getElementById('renew_condition').value = 'Good';
    
    // Set default date to +7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    document.getElementById('renew_return_date').value = nextWeek.toISOString().split('T')[0];
    
    document.getElementById('renew_fine_amount').value = '';
    
    window.handleRenewConditionChange(); // reset visibility
    
    // Show modal
    const modal = document.getElementById('renewBookModalWrapper');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.handleRenewConditionChange = () => {
    const condition = document.getElementById('renew_condition').value;
    const dateSection = document.getElementById('renew_date_section');
    const fineSection = document.getElementById('renew_fine_section');
    const submitBtn = document.getElementById('renew_submit_btn');
    const dateInput = document.getElementById('renew_return_date');
    const fineInput = document.getElementById('renew_fine_amount');
    
    if (condition === 'Good') {
        dateSection.classList.remove('hidden');
        fineSection.classList.add('hidden');
        dateInput.required = true;
        fineInput.required = false;
        
        submitBtn.className = 'w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg mt-4 flex items-center justify-center gap-2 transition-colors';
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Process Renewal';
    } else {
        dateSection.classList.add('hidden');
        fineSection.classList.remove('hidden');
        dateInput.required = false;
        fineInput.required = true;
        
        submitBtn.className = 'w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg mt-4 flex items-center justify-center gap-2 transition-colors';
        submitBtn.innerHTML = '<i class="fas fa-file-invoice-dollar"></i> Issue Fine & Mark Returned';
    }
};

window.submitBookRenewal = (e) => {
    e.preventDefault();
    const bookId = document.getElementById('renew_book_id').value;
    const condition = document.getElementById('renew_condition').value;
    const book = DB.getLibraryBooks().find(b => b.id === bookId);
    
    if(!book) return showToast('Book not found', 'error');
    
    if (condition === 'Good') {
        const newDate = document.getElementById('renew_return_date').value;
        DB.updateLibraryBook(bookId, { returnDate: newDate });
        showToast('Book renewed successfully!');
    } else {
        const amount = document.getElementById('renew_fine_amount').value;
        
        // Mark book as returned but damaged
        DB.updateLibraryBook(bookId, { status: 'Returned (Damaged)' });
        
        // Issue fine
        const fine = {
            id: 'F' + Date.now(),
            studentId: book.studentId,
            studentRoll: book.studentRoll,
            studentYear: book.studentYear,
            cardNumber: book.cardNumber,
            bookName: book.bookName,
            bookNumber: book.bookNumber,
            amount: amount,
            reason: 'Book damaged / pages missing',
            date: new Date().toISOString().split('T')[0],
            status: 'Unpaid'
        };
        
        if(DB && typeof DB.addLibraryFine === 'function') {
            DB.addLibraryFine(fine);
        }
        showToast('Book marked as damaged. Fine receipt issued to student!');
    }
    
    document.getElementById('renewBookModalWrapper').classList.add('hidden');
    navigate('librarian');
};

window.createNewLibraryCard = (rollNo, year) => {
    if(confirm("Generate a new library card for this student?")) {
        if(DB && typeof DB.createNewLibraryCard === 'function') {
            DB.createNewLibraryCard(rollNo, year);
            showToast('Library Card Generated Successfully');
            navigate('librarian');
        }
    }
};

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

window.deleteIssuedBook = (id) => {
    if(confirm("Are you sure you want to permanently delete this issued book record?")) {
        if(DB && typeof DB.deleteIssuedBook === 'function') {
            DB.deleteIssuedBook(id);
            showToast('Issued book record deleted');
            navigate('librarian');
        }
    }
};


// ===== LIBRARY CLEARANCE FEATURE =====
window.publishClearanceNotice = () => {
    const deadline = document.getElementById('clearance_deadline').value;
    if(!deadline) return showToast('Please select a deadline', 'error');

    // Get all +2 1st year students with unreturned books
    const students = DB.getStudents() || [];
    const books = DB.getLibraryBooks() || [];
    
    const unreturnedFirstYears = students.filter(s => s.year === '+2 1st year' && books.some(b => String(b.studentRoll) === String(s.rollNo) && String(b.studentYear) === String(s.year) && b.status === 'Issued'));
    
    if(unreturnedFirstYears.length === 0) return showToast('No students require clearance', 'error');
    
    let studentListHTML = unreturnedFirstYears.map(s => `- ${s.name} (Roll: ${s.rollNo})`).join('\n');
    
    const newNotice = {
        id: 'N' + Date.now(),
        title: 'URGENT: Library Clearance Required for +2 1st Year',
        content: `The following +2 1st year students have unreturned library books. You MUST return your books by **${deadline}** or your promotion to 2nd year will be blocked.\n\nStudents:\n${studentListHTML}`,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
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

window.filterTrackerGroups = () => {
    const filter = document.getElementById('tracker_category_filter').value;
    const rows = document.querySelectorAll('.tracker-group');
    rows.forEach(row => {
        if (filter === 'all' || row.getAttribute('data-category') === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
};

window.exportTrackerToExcel = () => {
    const filter = document.getElementById('tracker_category_filter').value;
    const allBooks = DB.getLibraryBooks() || [];
    const allStudents = DB.getStudents() || [];
    const allCards = DB.getLibraryCards() || [];
    
    let booksToExport = [];
    
    allBooks.forEach(b => {
        const card = allCards.find(c => c.cardNumber === b.cardNumber);
        let activeStudent = null;
        if (card) {
            activeStudent = allStudents.find(s => String(s.rollNo) === String(card.rollNo) && s.year === card.year);
        }
        // Fallback for older books that might not have a valid card attached
        if (!activeStudent && !b.cardNumber && b.studentRoll && b.studentYear) {
            activeStudent = allStudents.find(s => String(s.rollNo) === String(b.studentRoll) && s.year === b.studentYear);
        }
        
        let category = '';
        if (!activeStudent) category = 'past';
        else if (activeStudent.year === '+2 2nd year') category = '2nd';
        else category = '1st';
        
        if (filter === 'all' || filter === category) {
            booksToExport.push({
                Category: category === 'past' ? 'Past/Deleted' : (category === '2nd' ? '+2 2nd Year' : '+2 1st Year'),
                'Student Name': b.studentName,
                'Roll No': b.studentRoll,
                'Card Number': b.cardNumber,
                'Book Name': b.bookName,
                'Author': b.author,
                'Book ID': b.bookNumber,
                'Issue Date': b.issueDate,
                'Return Date': b.returnDate,
                'Status': b.status
            });
        }
    });
    
    if (booksToExport.length === 0) {
        return showToast('No books found for the selected category to export.', 'error');
    }
    
    // Sort by issue date descending
    booksToExport.sort((a,b) => new Date(b['Issue Date']) - new Date(a['Issue Date']));
    
    // Convert JSON to CSV
    const headers = Object.keys(booksToExport[0]);
    const csvRows = [];
    csvRows.push(headers.join(',')); // Add headers
    
    for (const row of booksToExport) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    
    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `Library_Issued_Books_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Export successful!');
};

function renderLibrarianProfile() {
    return `
    <div class="max-w-2xl mx-auto">
        <div class="glass-card p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-bl-full opacity-10"></div>
            
            <div class="flex items-center gap-6 mb-8 relative z-10">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-md flex items-center justify-center text-4xl text-white font-bold border-4 border-white dark:border-gray-800">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-white">${currentUser.name || 'Librarian'}</h2>
                    <p class="text-gray-500 text-lg flex items-center gap-2 mt-1">
                        <i class="fas fa-id-badge"></i> ID: ${currentUser.id}
                    </p>
                    <p class="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                        ${currentUser.role} Account
                    </p>
                </div>
            </div>

            <div class="border-t border-gray-100 dark:border-gray-700 pt-8 mt-4 relative z-10">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <i class="fas fa-lock text-primary"></i> Security & Settings
                </h3>
                
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><i class="fas fa-font"></i></span>
                                <input type="text" id="lib_profile_name" value="${currentUser.name || ''}" class="w-full pl-10 pr-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Password</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><i class="fas fa-key"></i></span>
                                <input type="password" id="lib_profile_pass" placeholder="Enter new password" class="w-full pl-10 pr-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-6 flex justify-end">
                        <button onclick="window.saveLibrarianProfile()" class="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

window.saveLibrarianProfile = () => {
    const newName = document.getElementById('lib_profile_name').value.trim();
    const newPass = document.getElementById('lib_profile_pass').value.trim();
    
    if(!newName) return showToast('Name cannot be empty', 'error');
    
    let allUsers = DB.getUsers();
    let userRec = allUsers.find(u => u.id === currentUser.id && u.role === currentUser.role);
    
    if(userRec) {
        userRec.name = newName;
        if(newPass) userRec.password = newPass;
        DB.set('users', allUsers);
        
        // Update current session
        currentUser.name = newName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showToast('Profile updated successfully!');
        navigate('librarian');
    }
};
