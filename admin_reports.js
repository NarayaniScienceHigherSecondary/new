function renderAdminReports() {
    window.currentAdminView = 'reports';

    const rawStudents = DB.getStudents().filter(s => (s.year || '').trim() === '+2 2nd year' && s.councilRollNo && s.councilRollNo.trim() !== '');
    
    const students = [];
    const seen = new Set();
    rawStudents.forEach(s => {
        const key = s.rollNo || s._id;
        if (key && !seen.has(key)) {
            seen.add(key);
            students.push(s);
        }
    });
    
    // Group by Council Roll No
    const rollGroups = {};
    students.forEach(s => {
        const roll = s.councilRollNo.trim();
        if (!rollGroups[roll]) rollGroups[roll] = [];
        rollGroups[roll].push(s);
    });

    // Find duplicates
    const duplicateGroups = Object.entries(rollGroups).filter(([roll, group]) => group.length > 1);
    
    let reportContent = '';

    if (duplicateGroups.length === 0) {
        reportContent = `
            <div class="glass-card p-12 text-center">
                <div class="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-sm">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">System Healthy</h3>
                <p class="text-gray-500 dark:text-gray-400">No data anomalies or duplicate Council Roll Numbers detected in +2 2nd Year.</p>
            </div>
        `;
    } else {
        reportContent = `
            <div class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-6 rounded-r-lg mb-8 shadow-sm">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-triangle text-red-500 text-2xl mt-1"></i>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-bold text-red-800 dark:text-red-400 mb-1">Attention: Duplicate Council Roll Numbers Detected</h3>
                        <p class="text-red-700 dark:text-red-300">
                            We found ${duplicateGroups.length} Council Roll Number(s) shared by multiple students in the +2 2nd Year batch. Council Roll Numbers must be strictly unique. Please correct them below.
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="space-y-8">
                ${duplicateGroups.map(([councilRoll, group]) => `
                    <div class="glass-card overflow-hidden border border-red-100 dark:border-red-900/50">
                        <div class="bg-red-50 dark:bg-gray-800 p-4 border-b border-red-100 dark:border-gray-700 flex justify-between items-center">
                            <div>
                                <span class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Conflicting Council Roll No</span>
                                <span class="text-xl font-bold text-red-600 dark:text-red-400">${councilRoll}</span>
                            </div>
                            <span class="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                ${group.length} Students Affected
                            </span>
                        </div>
                        <div class="overflow-x-auto w-full custom-scrollbar">
                            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                                <thead class="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th class="px-6 py-4 font-semibold">Internal Roll No</th>
                                        <th class="px-6 py-4 font-semibold">Student Name</th>
                                        <th class="px-6 py-4 font-semibold">Profile Status</th>
                                        <th class="px-6 py-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                    ${group.map(s => `
                                        <tr class="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                                            <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">${s.rollNo}</td>
                                            <td class="px-6 py-4">${s.name}</td>
                                            <td class="px-6 py-4">
                                                <span class="px-2 py-1 rounded text-xs ${s.profileComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                                                    ${s.profileComplete ? 'Complete' : 'Pending'}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 text-right">
                                                <button onclick="openEditStudentModal('${s._id || s.rollNo}', '${s.year || ''}')" class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-primary font-medium text-sm transition">
                                                    <i class="fas fa-edit mr-2"></i>Edit Profile
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    return `
    <div class="animate-fade-in relative">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                <i class="fas fa-exclamation-triangle text-red-500 mr-3"></i> Reports & Anomalies
            </h2>
        </div>
        ${reportContent}
    </div>
    `;
}
