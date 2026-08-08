import re

with open('librarian.js', 'r') as f:
    content = f.read()

# 1. Add Export Button to Header
old_header = """        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 class="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-list text-primary"></i> Issued Books Tracker</h3>
            <select id="tracker_category_filter" onchange="window.filterTrackerGroups()" class="px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm shadow-sm focus:ring-primary focus:border-primary">
                <option value="all">View All Batches</option>
                <option value="past">Past / Deleted Students</option>
                <option value="2nd">+2 2nd Year Students</option>
                <option value="1st">+2 1st Year Students</option>
            </select>
        </div>"""

new_header = """        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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
        </div>"""

content = content.replace(old_header, new_header)

# 2. Add Export Logic
export_func = """
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
    
    const csvData = csvRows.join('\\n');
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
"""
content += export_func

with open('librarian.js', 'w') as f:
    f.write(content)
