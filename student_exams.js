// Student Exams Module

function getGrade(obtained, full) {
    if (full === 0) return 'N/A';
    const pct = (obtained / full) * 100;
    if (pct >= 90) return 'O';
    if (pct >= 80) return 'E';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'B';
    if (pct >= 50) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
}

function getResultStatus(grade) {
    return grade === 'F' ? 'FAIL' : 'PASS';
}

function viewExamResult(examId) {
    const exam = DB.getExams().find(e => e.id === examId);
    const student = DB.getStudents().find(s => {
        if (currentUser._id) return s._id === currentUser._id;
        return !s._id && (s.id === currentUser.id || s.rollNo === currentUser.id) && (s.year || '') === (currentUser.year || '');
    });
    const collegeInfo = DB.getCollegeInfo();
    
    if (!exam || !student || !exam.isPublished) return;

    const result = exam.results[student.rollNo];
    if (!result || !result.marks) {
        showToast('Marks have not been uploaded for your roll number.');
        return;
    }

    let totalFull = 0;
    let totalObtained = 0;
    let hasFailed = false;

    const subjectsHtml = exam.subjects.map(subj => {
        const full = subj.fullMark;
        const obtained = result.marks[subj.name] !== undefined ? result.marks[subj.name] : 0;
        const grade = getGrade(obtained, full);
        const status = getResultStatus(grade);
        
        totalFull += full;
        totalObtained += obtained;
        if(status === 'FAIL') hasFailed = true;

        return `
        <tr class="border-b dark:border-gray-700">
            <td class="py-2 px-4">${subj.name}</td>
            <td class="py-2 px-4 text-center">${full}</td>
            <td class="py-2 px-4 text-center font-semibold">${obtained}</td>
            <td class="py-2 px-4 text-center font-bold ${grade === 'F' ? 'text-red-500' : 'text-green-500'}">${grade}</td>
            <td class="py-2 px-4 text-center ${status === 'FAIL' ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}">${status}</td>
        </tr>`;
    }).join('');

    const percentage = totalFull > 0 ? ((totalObtained / totalFull) * 100).toFixed(2) : 0;
    const overallGrade = getGrade(totalObtained, totalFull);
    const overallStatus = hasFailed ? 'FAIL' : 'PASS';
    const statusColor = overallStatus === 'PASS' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-red-600 bg-red-100 dark:bg-red-900/30';

    // Calculate Real Attendance
    let totalClasses = 0;
    let presentClasses = 0;
    DB.getAttendance().forEach(att => {
        if (att.records[student.rollNo]) {
            totalClasses++;
            if (att.records[student.rollNo] === 'Present') presentClasses++;
        }
    });
    const realAttendancePct = totalClasses === 0 ? 'N/A' : Math.round((presentClasses / totalClasses) * 100);

    const modalHtml = `
    <style>
        @media print {
            body * { visibility: hidden; }
            #result-print-area, #result-print-area * { visibility: visible; }
            #result-print-area { position: absolute; left: 0; top: 0; width: 100%; height: auto; }
            #resultModal { background: white !important; overflow: visible !important; }
            .bg-white, .dark\\:bg-gray-800 { background-color: white !important; }
            .text-gray-800, .dark\\:text-gray-200 { color: #1f2937 !important; }
            @page { size: A4; margin: 20mm; }
        }
    </style>
    <div id="resultModal" class="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] overflow-y-auto animate-fade-in p-4">
        <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl my-8 relative">
            <button onclick="document.getElementById('resultModal').remove()" class="absolute top-4 right-4 text-gray-500 hover:text-red-500 bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow z-10">
                <i class="fas fa-times text-xl"></i>
            </button>
            
            <div id="result-print-area" class="p-8 md:p-12 text-gray-800 dark:text-gray-200 print-bg bg-white dark:bg-gray-800">
                <div class="flex flex-col items-center justify-center mb-6">
                    ${collegeInfo.logoUrl ? `<img src="${collegeInfo.logoUrl}" alt="College Logo" class="h-24 mb-4 object-contain">` : ''}
                    <h1 class="text-2xl md:text-3xl font-black text-center tracking-widest text-primary dark:text-blue-400">
                        ${collegeInfo.name.toUpperCase()}
                    </h1>
                    <span class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-2">RESULT PUBLISH SHEET</span>
                </div>
                
                <hr class="border-t-2 border-primary mb-6">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <!-- College Info -->
                    <div class="bg-blue-50 dark:bg-gray-900/50 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                        <h2 class="text-lg font-bold mb-4 flex items-center text-primary"><i class="fas fa-university mr-2"></i> College Information</h2>
                        <div class="overflow-x-auto w-full custom-scrollbar"><table class="text-sm w-full">
                            <tbody>
                                <tr><td class="py-1 font-semibold text-gray-500">College Name:</td><td class="font-bold">${collegeInfo.name}</td></tr>
                                <tr><td class="py-1 font-semibold text-gray-500">College Code:</td><td class="font-bold">${exam.collegeCode}</td></tr>
                                <tr><td class="py-1 font-semibold text-gray-500">Academic Session:</td><td class="font-bold">${exam.academicSession}</td></tr>
                                <tr><td class="py-1 font-semibold text-gray-500">Examination Type:</td><td class="font-bold text-accent">${exam.examType}</td></tr>
                                <tr><td class="py-1 font-semibold text-gray-500">Result Publish Date:</td><td class="font-bold">${exam.publishDate}</td></tr>
                            </tbody>
                        </table></div>
                    </div>
                    
                    <!-- Student Info -->
                    <div class="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h2 class="text-lg font-bold mb-4 flex items-center text-gray-700 dark:text-gray-300"><i class="fas fa-user-graduate mr-2"></i> Student Information</h2>
                        <div class="overflow-x-auto w-full custom-scrollbar"><table class="text-sm w-full">
                            <tbody>
                                <tr><td class="py-1 font-semibold text-gray-500">Student Name:</td><td class="font-bold text-lg">${student.name}</td></tr>
                                <tr><td class="py-1 font-semibold text-gray-500">Student ID / Roll No:</td><td class="font-bold font-mono">${student.rollNo}</td></tr>
                                <tr><td class="py-1 font-semibold text-gray-500">Registration Number:</td><td class="font-bold">${student.regNo || 'N/A'}</td></tr>
                                <tr><td class="py-1 font-semibold text-gray-500">Course/Class:</td><td class="font-bold">${exam.courseClass}</td></tr>
                            </tbody>
                        </table></div>
                    </div>
                </div>
                
                <h2 class="text-lg font-bold mb-4 flex items-center text-gray-700 dark:text-gray-300"><i class="fas fa-chart-bar mr-2"></i> Subject-wise Marks</h2>
                <div class="overflow-x-auto mb-8">
                    <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full border border-gray-300 dark:border-gray-600 text-sm">
                        <thead class="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th class="py-3 px-4 text-left border-b border-gray-300 dark:border-gray-600">Subject</th>
                                <th class="py-3 px-4 text-center border-b border-gray-300 dark:border-gray-600">Full Marks</th>
                                <th class="py-3 px-4 text-center border-b border-gray-300 dark:border-gray-600">Obtained Marks</th>
                                <th class="py-3 px-4 text-center border-b border-gray-300 dark:border-gray-600">Grade</th>
                                <th class="py-3 px-4 text-center border-b border-gray-300 dark:border-gray-600">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subjectsHtml}
                            <tr class="bg-gray-50 dark:bg-gray-800 font-bold border-t-2 border-gray-300 dark:border-gray-600">
                                <td class="py-3 px-4 text-right">TOTAL</td>
                                <td class="py-3 px-4 text-center">${totalFull}</td>
                                <td class="py-3 px-4 text-center text-lg text-primary">${totalObtained}</td>
                                <td class="py-3 px-4"></td>
                                <td class="py-3 px-4"></td>
                            </tr>
                        </tbody>
                    </table></div>
                </div>

                <div class="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700/30">
                    <h2 class="text-lg font-bold mb-4 flex items-center text-yellow-700 dark:text-yellow-500"><i class="fas fa-star mr-2"></i> Overall Performance Details</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div class="p-3 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Percentage</p>
                            <p class="text-xl font-bold">${percentage}%</p>
                        </div>
                        <div class="p-3 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Overall Grade</p>
                            <p class="text-xl font-bold">${overallGrade}</p>
                        </div>
                        <div class="p-3 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Attendance</p>
                            <p class="text-xl font-bold">${realAttendancePct}${realAttendancePct !== 'N/A' ? '%' : ''}</p>
                        </div>
                        <div class="p-3 ${statusColor} rounded shadow-sm border border-transparent flex flex-col justify-center items-center">
                            <p class="text-xs uppercase font-semibold mb-1 opacity-80">Result Status</p>
                            <p class="text-2xl font-black">${overallStatus}</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-12 text-center text-sm text-gray-400 flex justify-between items-end border-t pt-4">
                    <p class="text-left w-1/3">Generated dynamically by Narayani Science Higher Secondary School</p>
                    <div class="text-center w-1/3">
                        <div class="h-16 flex items-end justify-center mb-2">
                            ${collegeInfo.signatureImageUrl ? `<img src="${collegeInfo.signatureImageUrl}" alt="Principal Signature" class="max-h-16 object-contain">` : '<div class="w-32 border-b border-gray-400"></div>'}
                        </div>
                        <p class="font-semibold text-gray-600 dark:text-gray-300">Principal's Signature</p>
                    </div>
                </div>
            </div>
            
            <div class="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 rounded-b-xl flex justify-end">
                <button onclick="window.print()" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center">
                    <i class="fas fa-print mr-2"></i> Print Result
                </button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}
