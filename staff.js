// Staff Dashboard

window.toggleStaffSidebar = () => {
    const sidebar = document.getElementById('staff-sidebar');
    const overlay = document.getElementById('staff-sidebar-overlay');
    if(sidebar && overlay) {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }
};

function renderStaffDashboard() {
    const staff = DB.getStaff().find(s => s.id === currentUser.id);
    const notices = DB.getNotices();
    const isTeaching = staff && staff.type === 'Teaching';

    if (!staff) return `<div class="p-8 text-center text-red-500">Staff Profile Not Found</div>`;

    return `
    <div class="max-w-7xl mx-auto px-4 py-8 w-full animate-fade-in">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Welcome, ${staff.name}</h2>
            <div class="flex space-x-3">
                <button onclick="toggleTheme()" class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"><i class="fas fa-moon"></i></button>
                <button onclick="logout()" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm shadow-sm transition-colors flex items-center"><i class="fas fa-sign-out-alt mr-2"></i>Logout</button>
            </div>
        </div>
        
        <!-- Mobile Header with Hamburger -->
        <div class="lg:hidden flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
            <div class="font-bold text-lg text-gray-800 dark:text-white flex items-center"><i class="fas fa-chalkboard-teacher text-primary mr-2 text-xl"></i>My Profile & Actions</div>
            <button onclick="toggleStaffSidebar()" class="p-2 text-gray-600 dark:text-gray-300 hover:text-primary focus:outline-none">
                <i class="fas fa-bars text-2xl"></i>
            </button>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 relative">
            <!-- Sidebar Overlay -->
            <div id="staff-sidebar-overlay" onclick="toggleStaffSidebar()" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden lg:hidden"></div>

            <!-- Left Column -->
            <div id="staff-sidebar" class="fixed inset-y-0 left-0 transform -translate-x-full lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-80 lg:w-1/3 bg-white/95 dark:bg-gray-900/95 lg:bg-transparent lg:dark:bg-transparent z-50 overflow-y-auto p-6 lg:p-0 h-screen lg:h-auto border-r border-gray-200 dark:border-gray-700 lg:border-none shadow-2xl lg:shadow-none flex flex-col gap-6 custom-scrollbar">
                
                <div class="lg:hidden flex justify-between items-center mb-2">
                    <span class="font-bold text-gray-800 dark:text-white text-lg">Profile</span>
                    <button onclick="toggleStaffSidebar()" class="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white focus:outline-none">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>

                <!-- Profile Card -->
                <div class="glass-card p-6 text-center shadow-xl border border-white/40 dark:border-gray-700/50 backdrop-blur-xl">
                    <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow flex items-center justify-center">
                        <i class="fas fa-chalkboard-teacher text-4xl text-gray-400"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">${staff.name}</h3>
                    <p class="text-sm text-gray-500 mb-2">${staff.designation ? staff.designation + ' (' + staff.type + ')' : staff.type + ' Staff'}</p>
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">ID: ${staff.id}</span>
                </div>

                ${isTeaching ? `
                <!-- Teacher specific actions -->
                <div class="glass-card p-6 shadow-xl border border-white/40 dark:border-gray-700/50 backdrop-blur-xl">
                    <h4 class="font-bold mb-4 text-gray-800 dark:text-white">Quick Actions</h4>
                    <div class="space-y-3">
                        <button onclick="openAttendanceModal()" class="w-full py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-800 transition flex items-center justify-center">
                            <i class="fas fa-clipboard-list mr-2"></i> Mark Attendance
                        </button>
                        <button onclick="document.getElementById('staffNoticeModal').classList.remove('hidden')" class="w-full py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition flex items-center justify-center">
                            <i class="fas fa-bullhorn mr-2"></i> Publish Notice
                        </button>
                        <button onclick="navigate('staff_tests')" class="w-full py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition flex items-center justify-center">
                            <i class="fas fa-file-alt mr-2"></i> Manage Class Tests
                        </button>
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Right Column -->
            <div class="lg:w-2/3 flex-1 w-full space-y-6">
                <div class="glass-card p-6">
                    <h3 class="font-bold text-xl mb-4 flex items-center text-primary dark:text-blue-400">
                        <i class="fas fa-bullhorn mr-3"></i>Staff Notices
                    </h3>
                    <div class="space-y-4">
                        ${notices.length ? notices.slice(0, 4).map(n => `
                        <div onclick="openPublicNoticeModal('${n.id}')" class="cursor-pointer p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            <h4 class="font-semibold text-gray-800 dark:text-white mb-1">${n.title}</h4>
                            <span class="text-xs text-gray-500">${n.date}</span>
                        </div>
                    `).join('') : '<p class="text-gray-500">No notices.</p>'}
                    </div>
                </div>
            </div>
        </div>

        ${isTeaching ? `
        <!-- Mark Attendance Modal -->
        <div id="attendanceModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">Mark Daily Attendance</h3>
                        <div class="flex items-center space-x-2">
                            <select id="attTargetYear" class="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="" disabled selected>Select Year</option>
                                <option value="+2 1st year">+2 1st year</option>
                                <option value="+2 2nd year">+2 2nd year</option>
                            </select>
                            <input type="date" id="attDate" value="${new Date().toISOString().split('T')[0]}" class="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <button onclick="checkAttendanceLock()" class="px-4 py-1 bg-secondary text-white rounded hover:bg-blue-600">Load</button>
                        </div>
                        <button onclick="document.getElementById('attendanceModal').classList.add('hidden')" class="text-gray-500 hover:text-red-500">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                </div>
                
                <div class="overflow-y-auto flex-grow mb-4">
                    <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full text-left text-sm">
                        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sticky top-0">
                            <tr>
                                <th class="px-4 py-3">Roll No</th>
                                <th class="px-4 py-3">Student Name</th>
                                <th class="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody id="attendanceTableBody" class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-300">
                        </tbody>
                    </table></div>
                </div>

                <div class="flex justify-end pt-4 border-t dark:border-gray-700">
                    <button id="submitAttBtn" onclick="submitAttendance()" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Submit Attendance</button>
                </div>
            </div>
        </div>
        <!-- Staff Notice Modal -->
        <div id="staffNoticeModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Publish New Notice</h3>
                <form onsubmit="handleStaffAddNotice(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Notice Title</label>
                            <input type="text" id="staffNoticeTitle" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Content</label>
                            <textarea id="staffNoticeContent" required rows="4" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="document.getElementById('staffNoticeModal').classList.add('hidden')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Publish Notice</button>
                    </div>
                </form>
            </div>
        </div>
        ` : ''}
    </div>
    `;
}

function handleStaffAddNotice(e) {
    e.preventDefault();
    const title = document.getElementById('staffNoticeTitle').value;
    const content = document.getElementById('staffNoticeContent').value;
    const date = new Date().toISOString().split('T')[0];

    DB.addNotice({
        title,
        content,
        author: currentUser.name,
        date,
        pinned: false
    });

    showToast('Notice published successfully!');
    document.getElementById('staffNoticeModal').classList.add('hidden');
    navigate('staff');
}

function submitAttendance() {
    const date = document.getElementById('attDate').value;
    const targetYear = document.getElementById('attTargetYear').value;
    const students = DB.getStudents().filter(s => {
        if (targetYear) return s.year === targetYear;
        return true;
    });
    const records = {};
    
    students.forEach(s => {
        const selected = document.querySelector(`input[name="att_${s.rollNo}"]:checked`);
        if(selected) {
            records[s.rollNo] = selected.value;
        }
    });

    DB.saveAttendance(date, targetYear, records);
    showToast(`Attendance saved for ${targetYear} on ${date}`);
    document.getElementById('attendanceModal').classList.add('hidden');
}

window.openAttendanceModal = () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attDate').value = today;
    document.getElementById('attTargetYear').value = "";
    document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-gray-500">Please select a year and click Load.</td></tr>';
    document.getElementById('submitAttBtn').disabled = true;
    document.getElementById('submitAttBtn').classList.replace('bg-primary', 'bg-gray-400');
    document.getElementById('submitAttBtn').classList.replace('hover:bg-blue-800', 'cursor-not-allowed');
    document.getElementById('attendanceModal').classList.remove('hidden');
};

window.checkAttendanceLock = () => {
    const date = document.getElementById('attDate').value;
    const targetYear = document.getElementById('attTargetYear').value;
    
    if (!targetYear) {
        showToast("Please select a year first");
        return;
    }
    
    const attendanceList = DB.getAttendance();
    const exists = attendanceList.find(a => a.date === date && a.targetYear === targetYear);
    const btn = document.getElementById('submitAttBtn');
    
    // Render the table
    const tbody = document.getElementById('attendanceTableBody');
    const students = DB.getStudents().filter(s => s.year === targetYear);
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-gray-500">No students available in this batch.</td></tr>';
    } else {
        tbody.innerHTML = students.map(s => {
            let status = 'Present';
            if (exists && exists.records && exists.records[s.rollNo]) {
                status = exists.records[s.rollNo];
            }
            const disabled = exists ? 'disabled' : '';
            return `
                <tr>
                    <td class="px-4 py-3">${s.rollNo}</td>
                    <td class="px-4 py-3">${s.name}</td>
                    <td class="px-4 py-3">
                        <div class="flex space-x-2">
                            <label class="flex items-center"><input type="radio" name="att_${s.rollNo}" value="Present" ${status === 'Present' ? 'checked' : ''} ${disabled} class="mr-1 text-green-500 disabled:opacity-50"> P</label>
                            <label class="flex items-center"><input type="radio" name="att_${s.rollNo}" value="Absent" ${status === 'Absent' ? 'checked' : ''} ${disabled} class="mr-1 text-red-500 disabled:opacity-50"> A</label>
                            <label class="flex items-center"><input type="radio" name="att_${s.rollNo}" value="Late" ${status === 'Late' ? 'checked' : ''} ${disabled} class="mr-1 text-yellow-500 disabled:opacity-50"> L</label>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (exists) {
        btn.disabled = true;
        btn.classList.replace('bg-primary', 'bg-gray-400');
        btn.classList.replace('hover:bg-blue-800', 'cursor-not-allowed');
        btn.innerText = "Locked";
    } else {
        btn.disabled = false;
        btn.classList.replace('bg-gray-400', 'bg-primary');
        btn.classList.replace('cursor-not-allowed', 'hover:bg-blue-800');
        btn.innerText = "Submit Attendance";
    }
};

// --- Class Test Management ---

function renderStaffTests() {
    const tests = DB.getClassTests().filter(t => t.staffId === currentUser.id);
    window.currentStaffTest = null;
    
    return `
    <div class="max-w-7xl mx-auto px-4 py-8 w-full animate-fade-in">
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center space-x-4">
                <button onclick="navigate('staff')" class="text-gray-500 hover:text-primary transition">
                    <i class="fas fa-arrow-left text-xl"></i>
                </button>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Manage Class Tests</h2>
            </div>
            <button onclick="document.getElementById('createTestModal').classList.remove('hidden')" class="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-800 transition">
                <i class="fas fa-plus mr-2"></i>New Class Test
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${tests.map(test => `
                <div class="glass-card p-6 relative">
                    <div class="absolute top-4 right-4 flex space-x-2">
                        <button onclick="handleDeleteTest('${test.id}')" class="text-red-500 hover:text-red-700" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                    <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-1 w-5/6">${test.subjectName} <span class="text-sm font-normal text-primary">(${test.targetYear || 'All'})</span></h3>
                    <p class="text-sm text-gray-500 mb-2">Date: ${test.date} | Total Marks: ${test.totalMarks}</p>
                    <div class="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                        <span class="text-sm font-semibold px-2 py-1 rounded ${test.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                            ${test.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <button onclick="openTestMarksModal('${test.id}')" class="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded transition text-sm">
                            ${test.isPublished ? 'View Marks' : 'Enter Marks & Publish'}
                        </button>
                    </div>
                </div>
            `).join('')}
            ${tests.length === 0 ? '<div class="col-span-full p-8 text-center text-gray-500 glass-card">No class tests created yet.</div>' : ''}
        </div>

        <!-- Create Test Modal -->
        <div id="createTestModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Create New Class Test</h3>
                <form onsubmit="handleCreateTest(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Target Student Batch</label>
                            <select id="testTargetYear" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="+2 1st year">+2 1st year</option>
                                <option value="+2 2nd year">+2 2nd year</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Subject / Paper Name</label>
                            <input type="text" id="testSubject" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Total Marks</label>
                            <input type="number" id="testMarks" min="1" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Date</label>
                            <input type="date" id="testDate" required value="${new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="document.getElementById('createTestModal').classList.add('hidden')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Create Test</button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Marks Entry Modal -->
        <div id="testMarksModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh]">
                <div class="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white" id="testMarksTitle">Enter Marks</h3>
                    <button onclick="document.getElementById('testMarksModal').classList.add('hidden')" class="text-gray-500 hover:text-red-500">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="overflow-y-auto flex-grow mb-4">
                    <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full text-left text-sm">
                        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sticky top-0">
                            <tr>
                                <th class="px-4 py-3">Roll No</th>
                                <th class="px-4 py-3">Student Name</th>
                                <th class="px-4 py-3">Marks Obtained</th>
                            </tr>
                        </thead>
                        <tbody id="testMarksBody" class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-300">
                        </tbody>
                    </table></div>
                </div>
                <div class="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end space-x-3" id="testMarksActions">
                    <!-- Buttons injected via JS -->
                </div>
            </div>
        </div>
    </div>
    `;
}

function handleCreateTest(e) {
    e.preventDefault();
    const test = {
        id: 'CT_' + Date.now(),
        staffId: currentUser.id,
        subjectName: document.getElementById('testSubject').value,
        targetYear: document.getElementById('testTargetYear').value,
        totalMarks: parseInt(document.getElementById('testMarks').value),
        date: document.getElementById('testDate').value,
        isPublished: false,
        results: {}
    };
    DB.saveClassTest(test);
    showToast('Class test created successfully!');
    navigate('staff_tests');
}

function handleDeleteTest(id) {
    if(confirm('Delete this class test? This will remove all associated marks.')) {
        DB.deleteClassTest(id);
        showToast('Class test deleted');
        navigate('staff_tests');
    }
}

function openTestMarksModal(id) {
    const test = DB.getClassTests().find(t => t.id === id);
    if(!test) return;
    window.currentStaffTest = test;
    
    document.getElementById('testMarksTitle').innerText = `Marks for ${test.subjectName} (Max: ${test.totalMarks})`;
    const tbody = document.getElementById('testMarksBody');
    const students = DB.getStudents().filter(s => !test.targetYear || s.year === test.targetYear);
    
    tbody.innerHTML = students.map(s => {
        const mark = test.results[s.rollNo] !== undefined ? test.results[s.rollNo] : '';
        return `
            <tr>
                <td class="px-4 py-3">${s.rollNo}</td>
                <td class="px-4 py-3">${s.name}</td>
                <td class="px-4 py-3">
                    <input type="number" data-roll="${s.rollNo}" value="${mark}" min="0" max="${test.totalMarks}" 
                        class="test-mark-input w-24 px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        ${test.isPublished ? 'disabled' : ''}>
                </td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="3" class="px-4 py-8 text-center text-gray-500">No students available.</td></tr>';
    
    const actions = document.getElementById('testMarksActions');
    if (test.isPublished) {
        actions.innerHTML = `<button type="button" onclick="document.getElementById('testMarksModal').classList.add('hidden')" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Close</button>`;
    } else {
        actions.innerHTML = `
            <button onclick="saveTestMarks(false)" class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:bg-gray-800 rounded-lg">Save Draft</button>
            <button onclick="saveTestMarks(true)" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Publish Results</button>
        `;
    }
    
    document.getElementById('testMarksModal').classList.remove('hidden');
}

function saveTestMarks(publish) {
    if (!window.currentStaffTest) return;
    const test = window.currentStaffTest;
    
    const inputs = document.querySelectorAll('.test-mark-input');
    inputs.forEach(input => {
        const roll = input.getAttribute('data-roll');
        const val = input.value;
        if (val !== '') {
            test.results[roll] = parseInt(val);
        } else {
            delete test.results[roll];
        }
    });
    
    if (publish) {
        if(confirm('Are you sure you want to publish these results? They will become visible to students immediately.')) {
            test.isPublished = true;
            DB.saveClassTest(test);
            showToast('Test results published successfully!');
            navigate('staff_tests');
        }
    } else {
        DB.saveClassTest(test);
        showToast('Marks saved as draft.');
        document.getElementById('testMarksModal').classList.add('hidden');
        navigate('staff_tests');
    }
}
