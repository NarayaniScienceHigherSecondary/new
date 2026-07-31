function renderAdminStatement() {
    window.currentAdminView = 'statement';
    
    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Question Paper Statement</h2>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <form id="statementForm" onsubmit="handleStatementSetupSubmit(event)">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-sm font-medium mb-1">Target Batch</label>
                        <select id="stmt_targetYear" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">Select Batch</option>
                            <option value="+2 1st year">+2 1st year</option>
                            <option value="+2 2nd year">+2 2nd year</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button type="submit" class="w-full px-6 py-2 bg-primary text-white font-bold rounded-lg shadow hover:bg-blue-800 transition">
                            <i class="fas fa-magic mr-2"></i> Generate Statement
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <div id="statementResultsContainer" class="hidden">
            <div class="flex justify-between items-center mb-4 print-btn-container">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">Statement Results</h3>
                <button onclick="printElement('statementPrintArea', 'Question Paper Statement')" class="px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm">
                    <i class="fas fa-print mr-2"></i> Print Statement
                </button>
            </div>
            
            <div id="statementPrintArea" class="bg-white p-8 rounded-xl shadow border dark:border-gray-700 text-black mb-8 overflow-x-auto custom-scrollbar page-break-inside-avoid">
                <!-- Content generated via JS -->
            </div>
        </div>
    </div>
    `;
}

window.handleStatementSetupSubmit = (e) => {
    e.preventDefault();
    
    const targetYear = document.getElementById('stmt_targetYear').value;
    const rawStudents = DB.getStudents().filter(s => s.year === targetYear);
    const allStudents = [];
    const seen = new Set();
    rawStudents.forEach(s => {
        const key = s.rollNo || s._id;
        if (key && !seen.has(key)) {
            seen.add(key);
            allStudents.push(s);
        }
    });
    
    let totalValidStudents = allStudents.length;

    const compulsoryCounts = {
        "MIL ODIA": totalValidStudents,
        "ENGLISH": totalValidStudents,
        "POLITICAL SCIENCE": totalValidStudents,
        "HISTORY": totalValidStudents
    };
    const optionalCounts = {};
    
    allStudents.forEach(s => {
        // Count Optionals
        if (s.optionalSubject1) {
            optionalCounts[s.optionalSubject1] = (optionalCounts[s.optionalSubject1] || 0) + 1;
        }
        if (s.optionalSubject2) {
            optionalCounts[s.optionalSubject2] = (optionalCounts[s.optionalSubject2] || 0) + 1;
        }
    });
    
    const container = document.getElementById('statementPrintArea');
    
    let html = `
        <div class="text-center mb-6 border-b-2 border-gray-800 pb-4">
            <h2 class="text-3xl font-bold uppercase text-black">Question Paper Statement</h2>
            <h3 class="text-xl font-bold mt-1 text-black">Batch: ${targetYear}</h3>
            <p class="text-lg font-semibold mt-2 text-black">Total Registered Students: ${totalValidStudents}</p>
        </div>
        
        <table class="w-full text-left border-collapse border border-gray-800 text-black">
            <thead>
                <tr class="bg-gray-200 border border-gray-800">
                    <th class="p-3 border border-gray-800 text-center w-16">Sl No</th>
                    <th class="p-3 border border-gray-800">Subject Name</th>
                    <th class="p-3 border border-gray-800 text-center">Type</th>
                    <th class="p-3 border border-gray-800 text-center font-bold text-lg">Total Students (Papers)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let slNo = 1;
    let totalPapers = 0;
    
    // Render Compulsory
    Object.keys(compulsoryCounts).forEach(sub => {
        if (compulsoryCounts[sub] > 0) {
            html += `
                <tr class="border border-gray-800">
                    <td class="p-3 border border-gray-800 text-center">${slNo++}</td>
                    <td class="p-3 border border-gray-800 font-medium">${sub}</td>
                    <td class="p-3 border border-gray-800 text-center">Compulsory</td>
                    <td class="p-3 border border-gray-800 text-center font-bold text-lg">${compulsoryCounts[sub]}</td>
                </tr>
            `;
            totalPapers += compulsoryCounts[sub];
        }
    });
    
    // Render Optional
    Object.keys(optionalCounts).forEach(sub => {
        if (optionalCounts[sub] > 0) {
            html += `
                <tr class="border border-gray-800 bg-gray-50">
                    <td class="p-3 border border-gray-800 text-center">${slNo++}</td>
                    <td class="p-3 border border-gray-800 font-medium">${sub}</td>
                    <td class="p-3 border border-gray-800 text-center">Optional</td>
                    <td class="p-3 border border-gray-800 text-center font-bold text-lg text-blue-800">${optionalCounts[sub]}</td>
                </tr>
            `;
            totalPapers += optionalCounts[sub];
        }
    });
    
    if (totalPapers === 0) {
        html += `
            <tr>
                <td colspan="4" class="p-6 text-center text-gray-500 italic">No subject data found for this batch.</td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
            <tfoot>
                <tr class="bg-gray-200 border-t-2 border-gray-800">
                    <td colspan="3" class="p-3 text-right font-bold text-xl uppercase">Total Papers Required:</td>
                    <td class="p-3 text-center font-black text-2xl">${totalPapers}</td>
                </tr>
            </tfoot>
        </table>
        
        <div class="mt-16 pt-8 flex justify-between px-10">
            <div class="text-center font-bold border-t border-gray-800 pt-2 w-48">
                Exam Controller
            </div>
            <div class="text-center font-bold border-t border-gray-800 pt-2 w-48">
                Principal
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    document.getElementById('statementResultsContainer').classList.remove('hidden');
};

window.printElement = function(elemId, title) {
    const printContent = document.getElementById(elemId).innerHTML;
    const printWindow = window.open('', '_blank', 'height=800,width=800');
    printWindow.document.write(`
        <html>
        <head>
            <title>${title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: #fff;
                    padding: 40px;
                }
                @media print {
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    body { 
                        padding: 0;
                        margin: 0;
                        width: 100%;
                    }
                    .no-print { display: none; }
                    /* Ensure backgrounds and colors print properly */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 1000);
};
