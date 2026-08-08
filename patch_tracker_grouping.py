import re

with open('librarian.js', 'r') as f:
    content = f.read()

old_loop = """    if(books.length === 0) {
        html += `<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">No books have been issued yet.</td></tr>`;
    } else {
        // Sort by newest issue date
        const sortedBooks = [...books].sort((a,b) => new Date(b.issueDate) - new Date(a.issueDate));
        
        sortedBooks.forEach(b => {
            const isOverdue = b.status === 'Issued' && new Date(b.returnDate) < new Date(new Date().toISOString().split('T')[0]);
            const statusClass = b.status === 'Returned' ? 'bg-green-100 text-green-800' : (isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800');
            
            html += `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-4 py-3">
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
                <td class="px-4 py-3 flex gap-2">
                    ${b.status === 'Issued' ? `
                        <button onclick="window.markBookReturned('${b.id}')" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-check"></i> Return
                        </button>
                    ` : '<span class="text-gray-400 text-sm">Completed</span>'}
                    <button onclick="window.deleteIssuedBook('${b.id}')" class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors shadow-sm ml-auto" title="Delete Record">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        });
    }"""

new_loop = """    if(books.length === 0) {
        html += `<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">No books have been issued yet.</td></tr>`;
    } else {
        const allStudents = DB.getStudents() || [];
        
        // Group books
        const deletedBooks = [];
        const secondYearBooks = [];
        const firstYearBooks = [];
        
        books.forEach(b => {
            const activeStudent = allStudents.find(s => String(s.rollNo) === String(b.studentRoll));
            if (!activeStudent) {
                deletedBooks.push(b);
            } else if (activeStudent.year === '+2 2nd year') {
                secondYearBooks.push(b);
            } else {
                firstYearBooks.push(b);
            }
        });
        
        // Helper function to render a category
        const renderCategory = (categoryBooks, title, bgColorClass, iconClass) => {
            if (categoryBooks.length === 0) return '';
            
            // Sort by newest issue date within the category
            const sorted = [...categoryBooks].sort((a,b) => new Date(b.issueDate) - new Date(a.issueDate));
            
            let catHtml = `
            <tr class="${bgColorClass}">
                <td colspan="8" class="px-4 py-2 font-bold text-gray-700 dark:text-gray-200">
                    <i class="${iconClass} mr-2"></i> ${title} (${sorted.length})
                </td>
            </tr>`;
            
            sorted.forEach(b => {
                const isOverdue = b.status === 'Issued' && new Date(b.returnDate) < new Date(new Date().toISOString().split('T')[0]);
                const statusClass = b.status === 'Returned' ? 'bg-green-100 text-green-800' : (isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800');
                
                catHtml += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
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
                    <td class="px-4 py-3 flex gap-2">
                        ${b.status === 'Issued' ? `
                            <button onclick="window.markBookReturned('${b.id}')" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                                <i class="fas fa-check"></i> Return
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
        html += renderCategory(deletedBooks, 'Past / Deleted Students', 'bg-gray-200 dark:bg-gray-800', 'fas fa-user-slash');
        html += renderCategory(secondYearBooks, '+2 2nd Year Students', 'bg-blue-100 dark:bg-blue-900', 'fas fa-user-graduate');
        html += renderCategory(firstYearBooks, '+2 1st Year Students', 'bg-green-100 dark:bg-green-900', 'fas fa-user');
    }"""

content = content.replace(old_loop, new_loop)

with open('librarian.js', 'w') as f:
    f.write(content)
