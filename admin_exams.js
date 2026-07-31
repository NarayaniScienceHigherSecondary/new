// Admin Exams & Results Module

function renderAdminExams() {
    window.currentAdminView = 'exams';
    const exams = DB.getExams();
    
    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Exams & Results Management</h2>
            <div class="flex space-x-3">
                <button onclick="showTimetableModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center shadow-md">
                    <i class="fas fa-calendar-alt mr-2"></i> Generate Timetable
                </button>
                <button onclick="showCreateExamModal()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition flex items-center shadow-md">
                    <i class="fas fa-plus mr-2"></i> Create New Exam
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${exams.map(exam => `
                <div class="glass-card p-6 border-l-4 ${exam.isPublished ? 'border-green-500' : 'border-yellow-500'} relative">
                    ${exam.isPublished ? 
                        '<span class="absolute top-4 right-4 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full"><i class="fas fa-check-circle mr-1"></i> Published</span>' : 
                        '<span class="absolute top-4 right-4 text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full"><i class="fas fa-clock mr-1"></i> Draft</span>'
                    }
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-1">${exam.examType}</h3>
                    <p class="text-sm text-gray-500 mb-4">${exam.courseClass} | ${exam.academicSession}</p>
                    <div class="space-y-2 mb-6">
                        <p class="text-sm text-gray-600 dark:text-gray-300"><i class="fas fa-book text-gray-400 mr-2 w-4"></i> ${exam.subjects.length} Subjects</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300"><i class="fas fa-users text-gray-400 mr-2 w-4"></i> ${Object.keys(exam.results || {}).length} Student Results</p>
                    </div>
                        <p class="text-sm font-bold text-gray-800 dark:text-white mb-2"><i class="fas fa-graduation-cap text-primary w-5"></i> Target: <span class="text-primary">${exam.targetYear || 'All'}</span></p>
                        <div class="flex gap-2">
                            <button onclick="manageExam('${exam.id}')" class="flex-grow py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition text-sm font-semibold">
                                ${exam.isPublished ? 'View Results' : 'Manage Marks'}
                            </button>
                        <button onclick="handleDeleteExam('${exam.id}')" class="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition" title="Delete Exam">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
            ${exams.length === 0 ? '<div class="col-span-full p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-dashed border-gray-300 dark:border-gray-700">No exams created yet.</div>' : ''}
        </div>

        <!-- Create Exam Modal -->
        <div id="createExamModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full shadow-2xl max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">Create New Exam</h3>
                    <button onclick="document.getElementById('createExamModal').classList.add('hidden')" class="text-gray-500 hover:text-red-500">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="overflow-y-auto flex-grow pr-2">
                    <form id="createExamForm" onsubmit="handleCreateExam(event)">
                        <h4 class="font-semibold text-primary mb-3">College & Exam Info</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label class="block text-sm font-medium mb-1">College Code</label>
                                <input type="text" id="ex_collegeCode" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Academic Session</label>
                                <input type="text" id="ex_session" placeholder="e.g. 2025-2026" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Course / Class</label>
                                <input type="text" id="ex_course" placeholder="e.g. B.Sc Computer Science" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            </div>
                            <div class="md:col-span-1">
                                <label class="block text-sm font-medium mb-1">Examination Type</label>
                                <select id="ex_type" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="Internal">Internal</option>
                                    <option value="Half Yearly">Half Yearly</option>
                                    <option value="Annual">Annual</option>
                                    <option value="Promotion Test">Promotion Test</option>
                                </select>
                            </div>
                            <div class="md:col-span-1">
                                <label class="block text-sm font-medium mb-1">Target Student Batch</label>
                                <select id="ex_targetYear" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="+2 1st year">+2 1st year</option>
                                    <option value="+2 2nd year">+2 2nd year</option>
                                </select>
                            </div>
                        </div>

                        <h4 class="font-semibold text-primary mb-3 flex justify-between items-center">
                            Subjects
                            <button type="button" onclick="addSubjectRow()" class="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                                <i class="fas fa-plus mr-1"></i> Add Subject
                            </button>
                        </h4>
                        <div id="subjectsContainer" class="space-y-3 mb-4">
                            <!-- Subject rows will be appended here -->
                        </div>
                    </form>
                </div>
                
                <div class="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end">
                    <button type="submit" form="createExamForm" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Save Exam Configuration</button>
                </div>
            </div>
        </div>

        <!-- Generate Timetable Modal -->
        <div id="timetableModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white"><i class="fas fa-calendar-alt text-purple-600 mr-2"></i> Generate Exam Timetable</h3>
                    <button onclick="document.getElementById('timetableModal').classList.add('hidden')" class="text-gray-500 hover:text-red-500">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="overflow-y-auto flex-grow pr-2" id="timetableWizard">
                    <!-- Step 1 -->
                    <div id="tt_step1">
                        <h4 class="font-semibold text-primary mb-4">Step 1: Basic Information</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label class="block text-sm font-medium mb-1">Target Year</label>
                                <select id="tt_year" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="+2 1st year">+2 1st year</option>
                                    <option value="+2 2nd year">+2 2nd year</option>
                                    <option value="All Years">All Years</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Exam Type</label>
                                <select id="tt_type" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="Internal">Internal</option>
                                    <option value="Promotion Test">Promotion Test</option>
                                    <option value="Half Yearly">Half Yearly</option>
                                    <option value="Annual">Annual</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Number of Days / Subjects</label>
                                <input type="number" id="tt_days" min="1" max="20" value="5" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button onclick="setupTimetableStep2()" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Next Step <i class="fas fa-arrow-right ml-2"></i></button>
                        </div>
                    </div>
                    
                    <!-- Step 2 -->
                    <div id="tt_step2" class="hidden">
                        <h4 class="font-semibold text-primary mb-4 flex justify-between items-center">
                            Step 2: Subject Scheduling
                            <button onclick="document.getElementById('tt_step1').classList.remove('hidden'); document.getElementById('tt_step2').classList.add('hidden');" class="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300">
                                <i class="fas fa-arrow-left mr-1"></i> Back
                            </button>
                        </h4>
                        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4 text-sm text-gray-700 dark:text-gray-300">
                            <strong>Note:</strong> Enter times in clear text (e.g., "10:00 AM - 1:00 PM").
                        </div>
                        <form id="generateTimetableForm" onsubmit="generateTimetable(event)">
                            <div id="tt_subjectsContainer" class="space-y-4 mb-4">
                                <!-- Dynamic rows -->
                            </div>
                            <div class="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end">
                                <button type="submit" class="px-6 py-2 bg-purple-600 text-white font-bold shadow-lg rounded-lg hover:bg-purple-700 transition transform hover:-translate-y-1">Generate & Publish Timetable</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function showCreateExamModal() {
    document.getElementById('createExamModal').classList.remove('hidden');
    document.getElementById('subjectsContainer').innerHTML = '';
    // Add 3 default rows
    addSubjectRow();
    addSubjectRow();
    addSubjectRow();
}

function addSubjectRow() {
    const container = document.getElementById('subjectsContainer');
    const index = container.children.length;
    const row = document.createElement('div');
    row.className = "flex space-x-3 items-end";
    row.innerHTML = `
        <div class="flex-grow">
            <input type="text" placeholder="Subject Name" required class="subj-name w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
        </div>
        <div class="w-32">
            <input type="number" placeholder="Full Mark" required min="1" class="subj-mark w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
        </div>
        <button type="button" onclick="this.parentElement.remove()" class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition mb-1">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(row);
}

function handleCreateExam(e) {
    e.preventDefault();
    const subjects = [];
    const rows = document.querySelectorAll('#subjectsContainer > div');
    
    if(rows.length === 0) {
        alert('Please add at least one subject.');
        return;
    }

    let valid = true;
    rows.forEach(row => {
        const name = row.querySelector('.subj-name').value.trim();
        const fullMark = parseInt(row.querySelector('.subj-mark').value);
        if(!name || isNaN(fullMark)) valid = false;
        subjects.push({ name, fullMark });
    });

    if(!valid) return;

    const exam = {
        id: 'EXAM_' + Date.now(),
        collegeCode: document.getElementById('ex_collegeCode').value,
        academicSession: document.getElementById('ex_session').value,
        courseClass: document.getElementById('ex_course').value,
        examType: document.getElementById('ex_type').value,
        targetYear: document.getElementById('ex_targetYear').value,
        subjects: subjects,
        results: {},
        isPublished: false,
        publishDate: null
    };

    DB.addExam(exam);
    document.getElementById('createExamModal').classList.add('hidden');
    showToast('Exam created successfully!');
    navigate('admin_exams');
}

// --- Manage Specific Exam ---
function manageExam(id) {
    window.currentAdminView = 'exam_manage_' + id;
    const exam = DB.getExams().find(e => e.id === id);
    if(!exam) {
        navigate('admin_exams');
        return;
    }

    // Filter students by exam targetYear. If legacy (no targetYear), show all or try to guess
    const students = DB.getStudents().filter(s => {
        if (exam.targetYear) return s.year === exam.targetYear;
        return true; // Legacy exams show everyone
    });
    
    const content = `
    <div>
        <div class="flex items-center mb-6">
            <button onclick="navigate('admin_exams')" class="mr-4 text-gray-500 hover:text-primary transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <i class="fas fa-arrow-left text-xl"></i>
            </button>
            <div class="flex-grow">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${exam.examType} Results</h2>
                <p class="text-sm text-gray-500">${exam.courseClass} | ${exam.academicSession}</p>
            </div>
            ${!exam.isPublished ? `
                <button onclick="saveAllStudentMarks('${exam.id}')" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-md mr-4">
                    <i class="fas fa-save mr-2"></i> Save All Marks
                </button>
                <button onclick="publishExam('${exam.id}')" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center shadow-md">
                    <i class="fas fa-bullhorn mr-2"></i> Publish Results
                </button>
            ` : `
                <span class="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold flex items-center border border-green-200">
                    <i class="fas fa-check-circle mr-2"></i> Published on ${exam.publishDate}
                </span>
            `}
        </div>

        <div class="glass-card overflow-hidden">
            <div class="overflow-x-auto">
                <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full text-left text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th class="px-4 py-4 font-semibold">Roll No</th>
                            <th class="px-4 py-4 font-semibold">Student Name</th>
                            ${exam.subjects.map(s => `<th class="px-4 py-4 font-semibold text-center" title="Full Marks: ${s.fullMark}">${s.name}<br><span class="text-xs text-gray-500">(FM: ${s.fullMark})</span></th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        ${students.map(s => {
                            const result = exam.results[s.rollNo] || { marks: {}, attendancePct: '' };
                            return `
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50" id="row_${s.rollNo}">
                                <td class="px-4 py-3 font-mono">${s.rollNo}</td>
                                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">${s.name}</td>
                                ${exam.subjects.map(subj => `
                                    <td class="px-4 py-3 text-center">
                                        <input type="number" min="0" max="${subj.fullMark}" class="w-16 px-2 py-1 text-center border rounded dark:bg-gray-700 dark:border-gray-600 input-mark" data-subj="${subj.name}" value="${result.marks[subj.name] !== undefined ? result.marks[subj.name] : ''}" ${exam.isPublished ? 'disabled' : ''}>
                                    </td>
                                `).join('')}
                            </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table></div>
            </div>
        </div>
    </div>
    `;
    
    setAppContent(renderAdminLayout(content));
}

window.saveAllStudentMarks = (examId) => {
    const tbody = document.querySelector('tbody');
    if(!tbody) return;

    const rows = tbody.querySelectorAll('tr[id^="row_"]');
    
    let exams = DB.getExams();
    let examIndex = exams.findIndex(e => e.id === examId);
    if(examIndex === -1) return;
    
    if(!exams[examIndex].results) exams[examIndex].results = {};
    
    rows.forEach(row => {
        const rollNo = row.id.replace('row_', '');
        const markInputs = row.querySelectorAll('.input-mark');
        
        let marks = {};
        markInputs.forEach(input => {
            const subj = input.getAttribute('data-subj');
            const val = input.value;
            if(val !== '') marks[subj] = parseFloat(val);
        });

        exams[examIndex].results[rollNo] = { marks: marks, attendancePct: '' };
    });

    DB.set('exams', exams);
    showToast('All marks saved successfully!');
}

function publishExam(examId) {
    if(confirm('Are you sure you want to publish this result? This action cannot be undone and students will immediately see their results.')) {
        let exams = DB.getExams();
        let exam = exams.find(e => e.id === examId);
        if(!exam) return;
        
        const dateStr = new Date().toLocaleDateString('en-GB');
        
        DB.updateExam(examId, { 
            isPublished: true, 
            publishDate: dateStr
        });

        DB.addNotice({
            title: `Result Published for ${exam.targetYear}`,
            content: `Your ${exam.examType} examination results have been officially published. Students can log in to the school portal to view their results. For any discrepancies, please contact the school office.\n\nNarayani Science Higher Secondary School`,
            pinned: true,
            date: dateStr,
            author: 'System Admin'
        });

        showToast('Results published successfully & Notice sent!');
        manageExam(examId); // refresh view
    }
}

window.handleDeleteExam = (examId) => {
    if(confirm("Are you sure you want to completely delete this exam? All student results tied to this exam will be lost permanently.")) {
        DB.deleteExam(examId);
        showToast("Exam Deleted Successfully", true);
        navigate('admin_exams');
    }
};

// ---------------------------------------------------
// TIMETABLE GENERATOR LOGIC
// ---------------------------------------------------

window.showTimetableModal = () => {
    document.getElementById('timetableModal').classList.remove('hidden');
    document.getElementById('tt_step1').classList.remove('hidden');
    document.getElementById('tt_step2').classList.add('hidden');
    document.getElementById('tt_subjectsContainer').innerHTML = '';
};

window.setupTimetableStep2 = () => {
    const days = parseInt(document.getElementById('tt_days').value);
    if (isNaN(days) || days < 1) {
        showToast('Please enter a valid number of days', 'error');
        return;
    }
    
    const container = document.getElementById('tt_subjectsContainer');
    container.innerHTML = '';
    
    for (let i = 1; i <= days; i++) {
        container.innerHTML += `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700 shadow-sm tt_row">
                <div class="md:col-span-1">
                    <label class="block text-xs font-medium text-gray-500 mb-1">Date</label>
                    <input type="date" required class="tt_date w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
                </div>
                <div class="md:col-span-1">
                    <label class="block text-xs font-medium text-gray-500 mb-1">Time</label>
                    <input type="text" placeholder="10:00 AM - 1:00 PM" required class="tt_time w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
                </div>
                <div class="md:col-span-1">
                    <label class="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                    <input type="text" placeholder="Subject Name" required class="tt_subj w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
                </div>
                <div class="md:col-span-1">
                    <label class="block text-xs font-medium text-gray-500 mb-1">Full Mark</label>
                    <input type="number" placeholder="100" required class="tt_mark w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
                </div>
            </div>
        `;
    }
    
    document.getElementById('tt_step1').classList.add('hidden');
    document.getElementById('tt_step2').classList.remove('hidden');
};

window.generateTimetable = (e) => {
    e.preventDefault();
    
    const year = document.getElementById('tt_year').value;
    const type = document.getElementById('tt_type').value;
    
    const rows = document.querySelectorAll('.tt_row');
    const schedule = [];
    
    rows.forEach(row => {
        schedule.push({
            date: row.querySelector('.tt_date').value,
            time: row.querySelector('.tt_time').value,
            subject: row.querySelector('.tt_subj').value,
            mark: row.querySelector('.tt_mark').value
        });
    });
    
    // Generate HTML Table
    let tableHtml = `
    <div style="font-family: sans-serif;">
        <p style="margin-bottom: 15px;">The <strong>${type}</strong> for <strong>${year}</strong> has been scheduled as follows:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
            <thead>
                <tr style="background-color: #f3f4f6; text-align: left;">
                    <th style="padding: 12px; border: 1px solid #e5e7eb;">Date</th>
                    <th style="padding: 12px; border: 1px solid #e5e7eb;">Time</th>
                    <th style="padding: 12px; border: 1px solid #e5e7eb;">Subject</th>
                    <th style="padding: 12px; border: 1px solid #e5e7eb;">Full Mark</th>
                </tr>
            </thead>
            <tbody>
                ${schedule.map(s => `
                    <tr>
                        <td style="padding: 12px; border: 1px solid #e5e7eb;">${new Date(s.date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                        <td style="padding: 12px; border: 1px solid #e5e7eb;">${s.time}</td>
                        <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${s.subject}</td>
                        <td style="padding: 12px; border: 1px solid #e5e7eb;">${s.mark}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">All students must carry their college ID cards during the examination. Mobile phones are strictly prohibited.</p>
    </div>
    `;
    
    // Auto-create Notice
    const notices = DB.getNotices() || [];
    const newNotice = {
        id: 'N' + Date.now(),
        title: `${year} - ${type} Timetable`,
        date: new Date().toISOString().split('T')[0],
        content: tableHtml,
        target: year === 'All Years' ? 'All' : year
    };
    
    notices.push(newNotice);
    DB.set('notices', notices);
    
    document.getElementById('timetableModal').classList.add('hidden');
    showToast('Timetable Generated and Published to Notice Board!', 'success');
};
