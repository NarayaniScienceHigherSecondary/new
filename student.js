// Student Dashboard

window.toggleStudentSidebar = () => {
    const sidebar = document.getElementById('student-sidebar');
    const overlay = document.getElementById('student-sidebar-overlay');
    if(sidebar && overlay) {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }
};

function renderStudentDashboard() {
    const student = DB.getStudents().find(s => {
        if (currentUser._id) return s._id === currentUser._id;
        return !s._id && (s.id === currentUser.id || s.rollNo === currentUser.id) && (s.year || '') === (currentUser.year || '');
    });
    const notices = DB.getNotices();
    const holidays = DB.getHolidays();
    const attendance = DB.getAttendance();
    const publishedExams = DB.getExams().filter(e => e.isPublished && e.results[student?.rollNo] && (!e.targetYear || e.targetYear === student?.year));
    const publishedClassTests = DB.getClassTests().filter(t => t.isPublished && (!t.targetYear || t.targetYear === student?.year));
    const scholarships = DB.getScholarships();
    const info = DB.getCollegeInfo();

    if (!student) return `<div class="p-8 text-center text-red-500 font-bold text-xl">Student Profile Not Found</div>`;


    // Calculate Attendance
    let totalClasses = 0;
    let presentClasses = 0;
    let studentAttendanceRecords = [];
    
    attendance.forEach(att => {
        if (!att.targetYear || att.targetYear === student?.year) {
            if (att.records[student.rollNo]) {
                totalClasses++;
                const status = att.records[student.rollNo];
                if (status === 'Present') presentClasses++;
                studentAttendanceRecords.push({ date: att.date, status });
            }
        }
    });
    
    studentAttendanceRecords.sort((a,b) => new Date(b.date) - new Date(a.date));
    const attendancePercentage = totalClasses === 0 ? 0 : Math.round((presentClasses / totalClasses) * 100);
    const attendanceColor = totalClasses === 0 ? 'text-gray-500' : attendancePercentage >= 75 ? 'text-green-500' : attendancePercentage >= 50 ? 'text-yellow-500' : 'text-red-500';
    const attendanceMessage = totalClasses === 0 ? 'No attendance records yet.' : attendancePercentage >= 75 ? 'You are maintaining a good attendance record.' : 'Your attendance is low. Please attend classes regularly.';

    return `
    <div class="max-w-7xl mx-auto px-4 py-8 w-full animate-fade-in font-sans">
        
        <!-- Welcome Hero Banner -->
        <div class="w-full rounded-3xl mb-8 p-8 md:p-12 relative overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900 via-primary to-purple-900 text-white flex flex-col md:flex-row items-center justify-between group">
            <div class="absolute inset-0 bg-black opacity-10"></div>
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            
            <div class="relative z-10 text-center md:text-left mb-6 md:mb-0">
                <h1 class="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">Welcome back, <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">${student.name.split(' ')[0]}</span>!</h1>
                <p class="text-indigo-200 text-lg">Here's your academic overview for today.</p>
            </div>
            
            <div class="relative z-10 flex space-x-3 mt-4 md:mt-0">
                <button onclick="toggleTheme()" class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur shadow-sm border border-white/30 flex items-center justify-center text-white transition-colors" title="Toggle Theme"><i class="fas fa-moon"></i></button>
                <button onclick="logout()" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm shadow-sm transition-colors flex items-center border border-red-400"><i class="fas fa-sign-out-alt mr-2"></i>Logout</button>
            </div>
            ${student.profileLocked ? `
            <div class="relative z-10 flex items-center">
                <span class="px-4 py-2 bg-red-500/20 text-red-200 rounded-lg border border-red-500/30 flex items-center shadow-sm text-sm font-semibold backdrop-blur-md">
                    <i class="fas fa-lock mr-2 text-red-300"></i> Profile Edit Locked
                </span>
            </div>
            ` : `
            <div class="relative z-10">
                <button onclick="document.getElementById('editProfileModal').classList.remove('hidden')" class="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1 flex items-center font-semibold">
                    <i class="fas fa-edit mr-2"></i> Edit Profile
                </button>
            </div>
            `}
        </div>

        <!-- Mobile Header with Hamburger -->
        <div class="lg:hidden flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
            <div class="font-bold text-lg text-gray-800 dark:text-white flex items-center"><i class="fas fa-user-circle text-primary mr-2 text-xl"></i>My Profile</div>
            <button onclick="toggleStudentSidebar()" class="p-2 text-gray-600 dark:text-gray-300 hover:text-primary focus:outline-none">
                <i class="fas fa-bars text-2xl"></i>
            </button>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 relative">
            <!-- Sidebar Overlay -->
            <div id="student-sidebar-overlay" onclick="toggleStudentSidebar()" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden lg:hidden"></div>

            <!-- Left Sidebar: Profile Summary -->
            <div id="student-sidebar" class="fixed inset-y-0 left-0 transform -translate-x-full lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-80 lg:w-1/3 bg-white/95 dark:bg-gray-900/95 lg:bg-transparent lg:dark:bg-transparent z-50 overflow-y-auto p-6 lg:p-0 h-screen lg:h-auto border-r border-gray-200 dark:border-gray-700 lg:border-none shadow-2xl lg:shadow-none flex flex-col gap-6 custom-scrollbar">
                
                <div class="lg:hidden flex justify-between items-center mb-2">
                    <span class="font-bold text-gray-800 dark:text-white text-lg">Profile</span>
                    <button onclick="toggleStudentSidebar()" class="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white focus:outline-none">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>

                <!-- Glassmorphic Profile Card -->
                <div class="glass-card relative overflow-hidden rounded-3xl p-8 text-center shadow-xl border border-white/40 dark:border-gray-700/50 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 transform transition-all hover:shadow-2xl">
                    <div class="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/20"></div>
                    
                    <div class="relative w-36 h-36 bg-gradient-to-tr from-primary to-purple-500 rounded-full mx-auto mb-6 p-1 shadow-lg hover:rotate-3 transition-transform duration-500">
                        <div class="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                            <i class="fas fa-user-graduate text-6xl text-gray-300 dark:text-gray-600"></i>
                        </div>
                    </div>
                    
                    <h2 class="relative text-2xl font-bold text-gray-800 dark:text-white tracking-wide">${student.name}</h2>
                    <p class="relative text-primary dark:text-blue-400 font-medium mb-1 uppercase tracking-widest text-sm">${student.year || '+2 1st year'}</p>
                    <p class="relative text-gray-600 dark:text-gray-300 font-medium mb-1 uppercase tracking-widest text-sm">Roll No: ${student.rollNo}</p>
                    <p class="relative text-gray-600 dark:text-gray-300 font-medium mb-1 text-sm tracking-wide">Optionals: <span class="font-bold text-primary dark:text-blue-400">${student.optionalSubject1 || '-'}, ${student.optionalSubject2 || '-'}</span></p>
                    ${(!student.year || student.year === '+2 1st year') ? '' : 
                        (student.councilRollNo ? `<p class="relative text-gray-600 dark:text-gray-300 font-medium mb-6 uppercase tracking-wider text-xs">Council Roll: ${student.councilRollNo}</p>` : `<p class="relative text-gray-400 dark:text-gray-500 font-medium mb-6 uppercase tracking-wider text-xs italic">Council Roll: Pending</p>`)}
                    
                    <div class="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 shadow-inner overflow-hidden mt-4">
                        <div class="bg-gradient-to-r from-blue-400 via-primary to-purple-500 h-full rounded-full transition-all duration-1000 ease-out" style="width: ${student.profileComplete ? '100%' : '30%'}"></div>
                    </div>
                    <p class="relative text-xs text-gray-500 dark:text-gray-400 text-left font-medium">Profile Completion: ${student.profileComplete ? '100%' : '30%'}</p>
                </div>
            </div>

            <!-- Right Area: 3D Grid Layout -->
            <div class="lg:w-2/3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <!-- Attendance 3D Box -->
                    <div onclick="openStudentModal('attendanceModal')" class="relative bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl p-6 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 active:translate-y-2 shadow-[0_10px_0_0_#1e3a8a] hover:shadow-[0_15px_0_0_#1e3a8a] active:shadow-[0_0px_0_0_#1e3a8a]">
                        <div class="flex justify-between items-start mb-4">
                            <div class="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <i class="fas fa-chart-pie text-3xl"></i>
                            </div>
                            <span class="text-4xl font-black opacity-80">${totalClasses === 0 ? '-' : attendancePercentage + '%'}</span>
                        </div>
                        <h3 class="font-bold text-2xl tracking-tight mb-1">Attendance</h3>
                        <p class="text-blue-100 text-sm font-medium">Click to view records</p>
                    </div>

                    <!-- My Results 3D Box -->
                    <div onclick="openStudentModal('resultsModal')" class="relative bg-gradient-to-br from-indigo-500 to-purple-700 text-white rounded-3xl p-6 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 active:translate-y-2 shadow-[0_10px_0_0_#312e81] hover:shadow-[0_15px_0_0_#312e81] active:shadow-[0_0px_0_0_#312e81]">
                        <div class="flex justify-between items-start mb-4">
                            <div class="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <i class="fas fa-graduation-cap text-3xl"></i>
                            </div>
                            <span class="bg-white/20 px-3 py-1 rounded-xl text-sm font-bold backdrop-blur-sm">${publishedExams.length + publishedClassTests.length} New</span>
                        </div>
                        <h3 class="font-bold text-2xl tracking-tight mb-1">My Results</h3>
                        <p class="text-indigo-100 text-sm font-medium">Exams & Class Tests</p>
                    </div>

                    <!-- Scholarships 3D Box -->
                    <div onclick="openStudentModal('scholarshipsModal')" class="relative bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-6 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 active:translate-y-2 shadow-[0_10px_0_0_#064e3b] hover:shadow-[0_15px_0_0_#064e3b] active:shadow-[0_0px_0_0_#064e3b]">
                        <div class="flex justify-between items-start mb-4">
                            <div class="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <i class="fas fa-award text-3xl"></i>
                            </div>
                            <span class="bg-white/20 px-3 py-1 rounded-xl text-sm font-bold backdrop-blur-sm">${scholarships.length} Active</span>
                        </div>
                        <h3 class="font-bold text-2xl tracking-tight mb-1">Scholarships</h3>
                        <p class="text-emerald-100 text-sm font-medium">Apply & View Details</p>
                    </div>

                    ${(student.year || '').trim() === '+2 2nd year' && student.formFillUp?.completed ? `
                    <!-- Form Fill Up 3D Box -->
                    <div class="relative bg-gradient-to-br from-green-500 to-green-700 text-white rounded-3xl p-6 cursor-default transform transition-all duration-300 shadow-[0_10px_0_0_#14532d]">
                        <div class="flex justify-between items-start mb-4">
                            <div class="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <i class="fas fa-file-signature text-3xl"></i>
                            </div>
                            <span class="bg-white/20 px-3 py-1 rounded-xl text-sm font-bold backdrop-blur-sm"><i class="fas fa-check"></i> Verified</span>
                        </div>
                        <h3 class="font-bold text-2xl tracking-tight mb-1">Form Fill Up</h3>
                        <p class="text-green-100 text-sm font-medium">Successful</p>
                    </div>
                    ` : ''}

                    <!-- Holidays 3D Box -->
                    <div onclick="openStudentModal('holidaysModal')" class="relative bg-gradient-to-br from-orange-400 to-red-600 text-white rounded-3xl p-6 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 active:translate-y-2 shadow-[0_10px_0_0_#7c2d12] hover:shadow-[0_15px_0_0_#7c2d12] active:shadow-[0_0px_0_0_#7c2d12]">
                        <div class="flex justify-between items-start mb-4">
                            <div class="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <i class="fas fa-calendar-alt text-3xl"></i>
                            </div>
                            <span class="bg-white/20 px-3 py-1 rounded-xl text-sm font-bold backdrop-blur-sm">${holidays.length} Events</span>
                        </div>
                        <h3 class="font-bold text-2xl tracking-tight mb-1">Upcoming Holidays</h3>
                        <p class="text-orange-100 text-sm font-medium">View academic calendar</p>
                    </div>

                    ${info.timetableImageUrl ? `
                    <!-- Timetable 3D Box -->
                    <div onclick="window.open('${info.timetableImageUrl}', '_blank')" class="relative bg-gradient-to-br from-pink-500 to-rose-700 text-white rounded-3xl p-6 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 active:translate-y-2 shadow-[0_10px_0_0_#831843] hover:shadow-[0_15px_0_0_#831843] active:shadow-[0_0px_0_0_#831843]">
                        <div class="flex justify-between items-start mb-4">
                            <div class="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <i class="fas fa-clock text-3xl"></i>
                            </div>
                        </div>
                        <h3 class="font-bold text-2xl tracking-tight mb-1">Class Timetable</h3>
                        <p class="text-pink-100 text-sm font-medium">Click to view image</p>
                    </div>
                    ` : ''}

                </div>

                <!-- Scrolling Notices Section -->
                <div class="glass-card mt-6 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 h-72 flex flex-col relative overflow-hidden group">
                    <div class="flex items-center mb-4 z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm pb-2 border-b border-gray-100 dark:border-gray-700">
                        <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4">
                            <i class="fas fa-bullhorn text-lg"></i>
                        </div>
                        <h3 class="font-bold text-xl text-gray-800 dark:text-white">Latest Notices</h3>
                    </div>
                    <div class="notice-scroll-container">
                        <div class="notice-scroll-content">
                            ${notices.length ? notices.map(n => `
                                <div onclick="openPublicNoticeModal('${n.id}')" class="cursor-pointer p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col">
                                    <h4 class="font-bold text-gray-800 dark:text-white mb-1 group-hover:text-primary transition-colors">${n.title}</h4>
                                    <span class="text-xs text-gray-500 font-medium flex items-center"><i class="far fa-calendar mr-2"></i>${n.date}</span>
                                </div>
                            `).join('') : '<p class="text-gray-500 italic p-4">No recent notices.</p>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ================= MODALS START HERE ================= -->

        <!-- Attendance Modal -->
        <div id="attendanceModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-900 rounded-3xl p-0 max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white flex justify-between items-center">
                    <h3 class="text-2xl font-bold"><i class="fas fa-chart-pie mr-2"></i> Attendance Details</h3>
                    <button onclick="closeStudentModal('attendanceModal')" class="text-white hover:text-blue-200 transition bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><i class="fas fa-times"></i></button>
                </div>
                <div class="p-6 overflow-y-auto custom-scrollbar">
                    <div class="flex items-end justify-between mb-2">
                        <div class="flex flex-col">
                            <span class="text-4xl font-extrabold ${attendanceColor}">${totalClasses === 0 ? 'N/A' : attendancePercentage + '%'}</span>
                            <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">Overall (${totalClasses} Classes)</span>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">${attendanceMessage}</p>
                    
                    <h4 class="font-bold text-gray-800 dark:text-white mb-3">Recent Records</h4>
                    <div class="space-y-3">
                        ${studentAttendanceRecords.length ? studentAttendanceRecords.map(rec => `
                            <div class="flex justify-between items-center text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                <span class="font-medium text-gray-700 dark:text-gray-300"><i class="far fa-calendar-alt text-gray-400 mr-2"></i>${rec.date}</span>
                                <span class="font-bold px-2 py-1 rounded-md text-xs ${rec.status === 'Present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : rec.status === 'Absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}">${rec.status}</span>
                            </div>
                        `).join('') : '<p class="text-gray-500 italic text-center py-4">No records found.</p>'}
                    </div>
                </div>
            </div>
        </div>

        <!-- Results Modal -->
        <div id="resultsModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-900 rounded-3xl p-0 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div class="bg-gradient-to-r from-indigo-600 to-purple-800 p-6 text-white flex justify-between items-center">
                    <h3 class="text-2xl font-bold"><i class="fas fa-graduation-cap mr-2"></i> My Results</h3>
                    <button onclick="closeStudentModal('resultsModal')" class="text-white hover:text-indigo-200 transition bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><i class="fas fa-times"></i></button>
                </div>
                <div class="p-6 overflow-y-auto custom-scrollbar">
                    <h4 class="font-bold text-lg mb-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">College Exams</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        ${publishedExams.length ? publishedExams.map(e => `
                            <div class="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-lg transition-all cursor-pointer group" onclick="viewExamResult('${e.id}')">
                                <div class="flex justify-between items-start mb-3">
                                    <h4 class="font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors">${e.examType}</h4>
                                </div>
                                <p class="text-sm text-gray-500 mb-4 font-medium">${e.academicSession}</p>
                                <button class="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center group-hover:translate-x-1 transition-transform">
                                    View Sheet <i class="fas fa-arrow-right ml-2 text-xs"></i>
                                </button>
                            </div>
                        `).join('') : '<p class="text-gray-500 col-span-full italic">No exam results available.</p>'}
                    </div>

                    <h4 class="font-bold text-lg mb-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Class Tests</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        ${publishedClassTests.length ? publishedClassTests.map(t => {
                            const marks = t.results[student.rollNo];
                            return `
                            <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex justify-between items-center">
                                <div>
                                    <h4 class="font-bold text-gray-800 dark:text-white mb-1">${t.subjectName}</h4>
                                    <span class="text-xs text-gray-500 font-medium">${t.date}</span>
                                </div>
                                <div class="text-right bg-indigo-50 dark:bg-gray-700 px-3 py-1.5 rounded-xl">
                                    <span class="text-xl font-black ${marks !== undefined ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}">${marks !== undefined ? marks : '-'}</span>
                                    <span class="text-xs text-gray-500 font-bold">/${t.totalMarks}</span>
                                </div>
                            </div>
                            `;
                        }).join('') : '<p class="text-gray-500 col-span-full italic">No class test results available.</p>'}
                    </div>
                </div>
            </div>
        </div>

        <!-- Scholarships Modal -->
        <div id="scholarshipsModal" onclick="closeStudentModal('scholarshipsModal')" class="hidden fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in p-4">
            <div onclick="event.stopPropagation()" class="bg-white dark:bg-gray-900 rounded-3xl p-0 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div class="bg-gradient-to-r from-emerald-600 to-teal-800 p-6 text-white flex justify-between items-center">
                    <h3 class="text-2xl font-bold"><i class="fas fa-award mr-2"></i> Active Scholarships</h3>
                    <button onclick="closeStudentModal('scholarshipsModal')" class="text-white hover:text-emerald-200 transition bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><i class="fas fa-times"></i></button>
                </div>
                <div class="p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar space-y-4">
                    ${scholarships.length ? scholarships.map(s => `
                        <div class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                                <h4 class="font-extrabold text-xl text-gray-800 dark:text-white">${s.title}</h4>
                                ${s.deadline ? `<span class="inline-flex items-center text-xs font-bold px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg whitespace-nowrap"><i class="fas fa-stopwatch mr-1.5"></i>Due: ${s.deadline}</span>` : ''}
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mb-5 whitespace-pre-line break-words bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 leading-relaxed">${s.process}</p>
                            ${s.siteUrl ? `<a href="${s.siteUrl.startsWith('http') ? s.siteUrl : 'https://' + s.siteUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                Apply Now <i class="fas fa-external-link-alt ml-2"></i>
                            </a>` : ''}
                        </div>
                    `).join('') : '<p class="text-gray-500 italic text-center py-8">No active scholarships at the moment.</p>'}
                </div>
            </div>
        </div>

        <!-- Holidays Modal -->
        <div id="holidaysModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-900 rounded-3xl p-0 max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div class="bg-gradient-to-r from-orange-500 to-red-700 p-6 text-white flex justify-between items-center">
                    <h3 class="text-2xl font-bold"><i class="fas fa-calendar-alt mr-2"></i> Upcoming Holidays</h3>
                    <button onclick="closeStudentModal('holidaysModal')" class="text-white hover:text-orange-200 transition bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><i class="fas fa-times"></i></button>
                </div>
                <div class="p-6 overflow-y-auto custom-scrollbar">
                    <div class="flex flex-col gap-3">
                        ${holidays.length ? holidays.map(h => `
                            <div class="flex items-center p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div class="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-xl p-2 min-w-[60px] text-center shadow-inner mr-4">
                                    <div class="text-[10px] uppercase font-bold tracking-wider opacity-90">${new Date(h.date).toLocaleString('default', { month: 'short' })}</div>
                                    <div class="text-2xl font-black leading-none">${new Date(h.date).getDate()}</div>
                                </div>
                                <h4 class="font-bold text-gray-800 dark:text-white text-lg">${h.name}</h4>
                            </div>
                        `).join('') : '<p class="text-gray-500 italic text-center py-8">No upcoming holidays.</p>'}
                    </div>
                </div>
            </div>
        </div>




        <!-- Edit Profile Modal -->
        <div id="editProfileModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 class="text-xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">Complete Your Profile</h3>
                <form onsubmit="handleProfileUpdate(event)">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Name (Uneditable)</label>
                            <input type="text" value="${student.name}" disabled class="w-full px-4 py-2 rounded-lg bg-gray-100 border text-gray-500 dark:bg-gray-900 dark:border-gray-700 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Roll No (Uneditable)</label>
                            <input type="text" value="${student.rollNo}" disabled class="w-full px-4 py-2 rounded-lg bg-gray-100 border text-gray-500 dark:bg-gray-900 dark:border-gray-700 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Gender</label>
                            <select id="s_gender" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select Gender</option>
                                <option value="Male" ${student.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${student.gender === 'Female' ? 'selected' : ''}>Female</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Optional Subject 1</label>
                            <select id="s_optionalSubject1" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" required onchange="validateOptionals('s')">
                                <option value="">Select Optional Subject 1</option>
                                <option value="Odia Optional" ${student.optionalSubject1 === 'Odia Optional' ? 'selected' : ''}>Odia Optional</option>
                                <option value="Education" ${student.optionalSubject1 === 'Education' ? 'selected' : ''}>Education</option>
                                <option value="Economics" ${student.optionalSubject1 === 'Economics' ? 'selected' : ''}>Economics</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Optional Subject 2</label>
                            <select id="s_optionalSubject2" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" required onchange="validateOptionals('s')">
                                <option value="">Select Optional Subject 2</option>
                                <option value="Odia Optional" ${student.optionalSubject2 === 'Odia Optional' ? 'selected' : ''}>Odia Optional</option>
                                <option value="Education" ${student.optionalSubject2 === 'Education' ? 'selected' : ''}>Education</option>
                                <option value="Economics" ${student.optionalSubject2 === 'Economics' ? 'selected' : ''}>Economics</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-2">Compulsory Subjects (Assigned by Admin)</label>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 opacity-75">
                                <label class="flex items-center space-x-2 p-2 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-not-allowed">
                                    <input type="checkbox" value="MIL ODIA" class="s-compulsory-checkbox rounded text-primary focus:ring-primary" ${(student.compulsorySubjects || []).includes('MIL ODIA') ? 'checked' : ''} disabled>
                                    <span class="text-sm">MIL ODIA</span>
                                </label>
                                <label class="flex items-center space-x-2 p-2 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-not-allowed">
                                    <input type="checkbox" value="ENGLISH" class="s-compulsory-checkbox rounded text-primary focus:ring-primary" ${(student.compulsorySubjects || []).includes('ENGLISH') ? 'checked' : ''} disabled>
                                    <span class="text-sm">ENGLISH</span>
                                </label>
                                <label class="flex items-center space-x-2 p-2 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-not-allowed">
                                    <input type="checkbox" value="POLITICAL SCIENCE" class="s-compulsory-checkbox rounded text-primary focus:ring-primary" ${(student.compulsorySubjects || []).includes('POLITICAL SCIENCE') ? 'checked' : ''} disabled>
                                    <span class="text-sm">POLITICAL SCIENCE</span>
                                </label>
                                <label class="flex items-center space-x-2 p-2 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-not-allowed">
                                    <input type="checkbox" value="HISTORY" class="s-compulsory-checkbox rounded text-primary focus:ring-primary" ${(student.compulsorySubjects || []).includes('HISTORY') ? 'checked' : ''} disabled>
                                    <span class="text-sm">HISTORY</span>
                                </label>
                            </div>
                        </div>
                        ${student.year === '+2 2nd year' ? `
                        <div>
                            <label class="block text-sm font-medium mb-1">Council Reg No.</label>
                            <input type="text" id="s_regNo" value="${student.regNo || ''}" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Council Roll No.</label>
                            <input type="text" id="s_councilRollNo" value="${student.councilRollNo || ''}" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        ` : ''}
                        <div>
                            <label class="block text-sm font-medium mb-1">Father's Name</label>
                            <input type="text" id="s_fname" value="${student.fatherName}" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Mother's Name</label>
                            <input type="text" id="s_mname" value="${student.motherName}" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Mobile Number</label>
                            <input type="tel" id="s_mobileNo" value="${student.mobileNo || ''}" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="10-digit mobile number">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email Address</label>
                            <input type="email" id="s_email" value="${student.email || ''}" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" required placeholder="example@email.com">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1">Address</label>
                            <textarea id="s_address" rows="2" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">${student.address}</textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="document.getElementById('editProfileModal').classList.add('hidden')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Save Profile</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    const students = DB.getStudents();
    const student = students.find(s => {
        if (currentUser._id) return s._id === currentUser._id;
        return String(s.rollNo) === String(currentUser.id) && (s.year || '') === (currentUser.year || '');
    });
    
    if (student && student.profileLocked) {
        return showToast('Your profile is locked by the administrator.', 'error');
    }

    const opt1 = document.getElementById('s_optionalSubject1').value;
    const opt2 = document.getElementById('s_optionalSubject2').value;
    
    if (opt1 === opt2) {
        return showToast('Optional subjects must be different', 'error');
    }

    const data = {
        gender: document.getElementById('s_gender').value,
        optionalSubject1: opt1,
        optionalSubject2: opt2,
        fatherName: document.getElementById('s_fname').value,
        motherName: document.getElementById('s_mname').value,
        mobileNo: document.getElementById('s_mobileNo').value,
        email: document.getElementById('s_email').value,
        address: document.getElementById('s_address').value,
        profileComplete: true
    };
    
    // Save compulsory subjects
    const compulsorySubjects = [];
    document.querySelectorAll('.s-compulsory-checkbox:checked').forEach(cb => {
        compulsorySubjects.push(cb.value);
    });
    data.compulsorySubjects = compulsorySubjects;
    
    // Conditionally get elements if they exist (for 2nd year students)
    const regNoEl = document.getElementById('s_regNo');
    const rollNoEl = document.getElementById('s_councilRollNo');
    if (regNoEl) data.regNo = regNoEl.value;
    if (rollNoEl) data.councilRollNo = rollNoEl.value;
    
    DB.updateStudent(currentUser._id || currentUser.id, data, currentUser.year || '');
    showToast('Profile updated successfully!');
    document.getElementById('editProfileModal').classList.add('hidden');
    navigate('student'); // Reload view
}

window.validateOptionals = function(prefix) {
    const opt1 = document.getElementById(prefix + '_optionalSubject1');
    const opt2 = document.getElementById(prefix + '_optionalSubject2');
    if (opt1 && opt2 && opt1.value && opt2.value && opt1.value === opt2.value) {
        opt2.setCustomValidity('Subjects must be different');
    } else if(opt2) {
        opt2.setCustomValidity('');
    }
};

// Custom Modal Handlers for Student Dashboard
function openStudentModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
}

function closeStudentModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        // Restore body scroll
        document.body.style.overflow = '';
    }
}
