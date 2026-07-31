function renderAdminFormFillUp() {
    window.currentAdminView = 'formfillup';
    
    return `
    <div class="animate-fade-in relative">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Form Fill Up (+2 2nd Year)</h2>
        </div>

        <div class="glass-card p-6 max-w-3xl mx-auto">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Process Student Form Fill Up</h3>
            
            <form id="formFillUpForm" onsubmit="handleFormFillUpSubmit(event)">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-sm font-medium mb-1">Roll Number or ID</label>
                        <input type="text" id="ffu_roll" required oninput="ffuFetchStudentName()" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter roll number or ID">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Student Name</label>
                        <input type="text" id="ffu_name" required readonly class="w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed" placeholder="Auto-filled">
                    </div>
                </div>
                
                <input type="hidden" id="ffu_student_id">

                <div class="mb-6 p-5 bg-blue-50 dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700">
                    <h4 class="font-bold text-gray-800 dark:text-white mb-4">Clearance Checklist</h4>
                    <div class="space-y-4">
                        <label class="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                            <input type="checkbox" id="ffu_lib" required class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary">
                            <span class="font-medium text-gray-700 dark:text-gray-200">Library Clearance Verified</span>
                        </label>
                        <label class="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                            <input type="checkbox" id="ffu_sports" required class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary">
                            <span class="font-medium text-gray-700 dark:text-gray-200">Sports Clearance Verified</span>
                        </label>
                        <label class="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                            <input type="checkbox" id="ffu_fee" required class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary">
                            <span class="font-medium text-gray-700 dark:text-gray-200">Fee Clearance Verified</span>
                        </label>
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium mb-1">Total Form Fill Up Fee (₹)</label>
                    <input type="number" id="ffu_total_fee" required min="1" class="w-full md:w-1/2 px-4 py-3 text-lg font-bold rounded-lg border-2 border-primary dark:bg-gray-700 dark:border-primary dark:text-white" placeholder="e.g. 1500">
                </div>

                <div class="flex flex-col md:flex-row items-center gap-4">
                    <button type="submit" id="ffu_submit_btn" class="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition w-full md:w-auto">
                        <i class="fas fa-check-circle mr-2"></i> Complete Form Fill Up
                    </button>
                    <div id="ffu_already_msg" class="hidden text-red-600 font-bold bg-red-50 px-4 py-2 rounded-lg border border-red-200 w-full md:w-auto text-center">
                        <i class="fas fa-exclamation-triangle mr-1"></i> Already Form Filled Up
                    </div>
                </div>
            </form>
        </div>
        
        <div class="glass-card p-6 max-w-5xl mx-auto mt-8">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 flex justify-between items-center">
                <span>Completed Form Fill Ups</span>
                <div class="flex space-x-3 items-center">
                    <span class="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full" id="ffu_completed_count"></span>
                    <button onclick="exportFormFillUpToExcel()" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition shadow-sm flex items-center">
                        <i class="fas fa-file-excel mr-2"></i> Export
                    </button>
                </div>
            </h3>
            
            <div class="overflow-x-auto w-full custom-scrollbar">
                <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold">Date</th>
                            <th class="px-4 py-3 font-semibold">Roll No</th>
                            <th class="px-4 py-3 font-semibold">Student Name</th>
                            <th class="px-4 py-3 font-semibold text-center">Clearances</th>
                            <th class="px-4 py-3 font-semibold">Total Fee (₹)</th>
                            <th class="px-4 py-3 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody id="ffu_completed_table_body" class="divide-y divide-gray-200 dark:divide-gray-700">
                        <!-- Populated by JS -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `;
}

window.renderAdminFormFillUpList = () => {
    const students = DB.getStudents().filter(s => (s.year || '').trim() === '+2 2nd year' && s.formFillUp?.completed);
    
    document.getElementById('ffu_completed_count').textContent = `${students.length} Students`;
    
    const tbody = document.getElementById('ffu_completed_table_body');
    if (!tbody) return;
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No form fill ups completed yet.</td></tr>';
        return;
    }
    
    // Sort by timestamp descending if available, else by Roll No
    students.sort((a, b) => {
        if (a.formFillUp.timestamp && b.formFillUp.timestamp) {
            return new Date(b.formFillUp.timestamp) - new Date(a.formFillUp.timestamp);
        }
        return parseInt(a.rollNo) - parseInt(b.rollNo);
    });
    
    tbody.innerHTML = students.map(s => {
        const date = s.formFillUp.timestamp ? new Date(s.formFillUp.timestamp).toLocaleDateString() : 'N/A';
        return `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3">${date}</td>
                <td class="px-4 py-3 font-bold text-gray-900 dark:text-white">${s.rollNo}</td>
                <td class="px-4 py-3">${s.name}</td>
                <td class="px-4 py-3 text-center">
                    <span class="flex items-center justify-center space-x-2 text-xs">
                        <span title="Library" class="${s.formFillUp.libraryClearance ? 'text-green-500' : 'text-red-500'}"><i class="fas fa-book"></i></span>
                        <span title="Sports" class="${s.formFillUp.sportsClearance ? 'text-green-500' : 'text-red-500'}"><i class="fas fa-futbol"></i></span>
                        <span title="Fee" class="${s.formFillUp.feeClearance ? 'text-green-500' : 'text-red-500'}"><i class="fas fa-rupee-sign"></i></span>
                    </span>
                </td>
                <td class="px-4 py-3 font-bold text-green-600">₹${s.formFillUp.totalFee || 0}</td>
                <td class="px-4 py-3 text-center">
                    <button onclick="revertFormFillUp('${s._id || s.rollNo}')" class="text-red-500 hover:text-red-700 text-xs px-2 py-1 bg-red-50 hover:bg-red-100 rounded transition border border-red-200" title="Revert/Delete Form Fill Up">
                        <i class="fas fa-undo"></i> Revert
                    </button>
                </td>
            </tr>
        `;
    }).join('');
};

window.revertFormFillUp = (id) => {
    if(confirm('Are you sure you want to revert the Form Fill Up for this student?')) {
        DB.updateStudent(id, { formFillUp: { completed: false } }, '+2 2nd year');
        
        // Automatically remove the corresponding DCR record
        const student = DB.getStudents().find(s => (String(s._id) === String(id) || String(s.rollNo) === String(id)) && (s.year || '+2 1st year').trim() === '+2 2nd year');
        if (student && student.rollNo) {
            if (typeof DB.removeFormFillUpDcrRecord === 'function') {
                DB.removeFormFillUpDcrRecord(student.rollNo);
            }
        }
        
        showToast('Form Fill Up reverted and DCR entry removed.', 'info');
        if (typeof renderAdminFormFillUpList === 'function') {
            renderAdminFormFillUpList();
        }
    }
};

window.ffuFetchStudentName = () => {
    const rollOrId = document.getElementById('ffu_roll')?.value?.trim().toLowerCase();
    
    if (rollOrId) {
        // Enforce +2 2nd year only for this feature
        const year = '+2 2nd year';
        
        let student = DB.getStudents().find(s => s._id && String(s._id).trim().toLowerCase() === rollOrId);
        
        // If not found by ID, try finding by Roll Number within +2 2nd year
        if (!student) {
            student = DB.getStudents().find(s => {
                const matchesRoll = s.rollNo != null && String(s.rollNo).trim().toLowerCase() === rollOrId;
                const matchesYear = (s.year || '+2 1st year').trim() === year;
                return matchesRoll && matchesYear;
            });
        }
        
        if (student && (student.year || '').trim() === year) {
            document.getElementById('ffu_name').value = student.name;
            document.getElementById('ffu_student_id').value = student._id || student.rollNo;
            
            const btn = document.getElementById('ffu_submit_btn');
            const msg = document.getElementById('ffu_already_msg');
            const lib = document.getElementById('ffu_lib');
            const sports = document.getElementById('ffu_sports');
            const fee = document.getElementById('ffu_fee');
            const totalFee = document.getElementById('ffu_total_fee');

            // Auto-check if already filled up
            if (student.formFillUp && student.formFillUp.completed) {
                lib.checked = student.formFillUp.libraryClearance || false;
                sports.checked = student.formFillUp.sportsClearance || false;
                fee.checked = student.formFillUp.feeClearance || false;
                totalFee.value = student.formFillUp.totalFee || '';
                
                // Disable inputs and button
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
                msg.classList.remove('hidden');
                lib.disabled = true;
                sports.disabled = true;
                fee.disabled = true;
                totalFee.disabled = true;
            } else {
                lib.checked = false;
                sports.checked = false;
                fee.checked = false;
                totalFee.value = '';
                
                // Enable inputs and button
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
                msg.classList.add('hidden');
                lib.disabled = false;
                sports.disabled = false;
                fee.disabled = false;
                totalFee.disabled = false;
            }
        } else {
            document.getElementById('ffu_name').value = '';
            document.getElementById('ffu_student_id').value = '';
            
            // Reset state
            const btn = document.getElementById('ffu_submit_btn');
            const msg = document.getElementById('ffu_already_msg');
            if(btn) {
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            if(msg) msg.classList.add('hidden');
            document.getElementById('ffu_lib').disabled = false;
            document.getElementById('ffu_sports').disabled = false;
            document.getElementById('ffu_fee').disabled = false;
            document.getElementById('ffu_total_fee').disabled = false;
        }
    } else {
        document.getElementById('ffu_name').value = '';
        document.getElementById('ffu_student_id').value = '';
        
        // Reset state
        const btn = document.getElementById('ffu_submit_btn');
        const msg = document.getElementById('ffu_already_msg');
        if(btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        if(msg) msg.classList.add('hidden');
        document.getElementById('ffu_lib').disabled = false;
        document.getElementById('ffu_sports').disabled = false;
        document.getElementById('ffu_fee').disabled = false;
        document.getElementById('ffu_total_fee').disabled = false;
    }
};

window.handleFormFillUpSubmit = (e) => {
    e.preventDefault();
    const studentId = document.getElementById('ffu_student_id').value;
    const totalFee = parseInt(document.getElementById('ffu_total_fee').value) || 0;
    
    if (!studentId) {
        showToast('Please select a valid +2 2nd year student first.', 'error');
        return;
    }
    
    const student = DB.getStudents().find(s => String(s._id) === String(studentId) || String(s.rollNo) === String(studentId));
    if (student && student.formFillUp && student.formFillUp.completed) {
        showToast('This student has already completed Form Fill Up.', 'error');
        return;
    }
    
    const formFillUpData = {
        completed: true,
        libraryClearance: document.getElementById('ffu_lib').checked,
        sportsClearance: document.getElementById('ffu_sports').checked,
        feeClearance: document.getElementById('ffu_fee').checked,
        totalFee: totalFee,
        timestamp: new Date().toISOString()
    };
    
    DB.updateStudent(studentId, { formFillUp: formFillUpData }, '+2 2nd year');
    
    // Add to DCR Collection History
    const dcrStudent = DB.getStudents().find(s => (String(s._id) === String(studentId) || String(s.rollNo) === String(studentId)) && (s.year || '+2 1st year').trim() === '+2 2nd year');
    if (dcrStudent) {
        const record = {
            id: 'DCR_' + Date.now(),
            timestamp: new Date().toISOString(),
            name: dcrStudent.name,
            rollNo: dcrStudent.rollNo,
            year: dcrStudent.year || '+2 2nd year',
            totalAmount: totalFee,
            isFormFillUp: true,
            breakdown: {
                fees: [{ name: 'Form Fill Up Fee', amount: totalFee }],
                developmentFee: 0
            }
        };
        DB.addDcrRecord(record);
    }
    
    showToast('Form fill up successful!', 'success');
    
    // Reset form
    document.getElementById('formFillUpForm').reset();
    document.getElementById('ffu_student_id').value = '';
    
    // Update the list
    if (typeof renderAdminFormFillUpList === 'function') {
        renderAdminFormFillUpList();
    }
};

window.exportFormFillUpToExcel = () => {
    const students = DB.getStudents().filter(s => (s.year || '').trim() === '+2 2nd year' && s.formFillUp?.completed);
    
    if (students.length === 0) {
        showToast('No records to export', 'error');
        return;
    }
    
    // Sort by timestamp descending
    students.sort((a, b) => {
        if (a.formFillUp.timestamp && b.formFillUp.timestamp) {
            return new Date(b.formFillUp.timestamp) - new Date(a.formFillUp.timestamp);
        }
        return parseInt(a.rollNo) - parseInt(b.rollNo);
    });

    let csvContent = "data:text/csv;charset=utf-8,";
    // Header
    csvContent += "Date,Roll No,Student Name,Library Clearance,Sports Clearance,Fee Clearance,Total Fee (Rs)\n";
    
    // Rows
    students.forEach(s => {
        const date = s.formFillUp.timestamp ? new Date(s.formFillUp.timestamp).toLocaleDateString() : 'N/A';
        const lib = s.formFillUp.libraryClearance ? 'Yes' : 'No';
        const sports = s.formFillUp.sportsClearance ? 'Yes' : 'No';
        const fee = s.formFillUp.feeClearance ? 'Yes' : 'No';
        const total = s.formFillUp.totalFee || 0;
        
        // Escape quotes and commas in names
        const safeName = '"' + (s.name || '').replace(/"/g, '""') + '"';
        const safeRoll = '"' + (s.rollNo || '').toString().replace(/"/g, '""') + '"';
        
        const row = `${date},${safeRoll},${safeName},${lib},${sports},${fee},${total}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = `Form_Fill_Up_2nd_Year_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link); // Required for FF
    
    link.click();
    document.body.removeChild(link);
};
