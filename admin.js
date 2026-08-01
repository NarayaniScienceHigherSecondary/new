// Admin Layout and Views

window.toggleAdminSidebar = () => {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('admin-sidebar-overlay');
    if(sidebar && overlay) {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }
};

function renderAdminLayout(content) {
    return `
    <div class="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 w-full relative" id="admin-layout-root">
        
        <!-- Mobile Header with Hamburger -->
        <div class="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30 shadow-sm">
            <div class="flex items-center space-x-3 text-primary dark:text-blue-400 font-bold text-lg">
                <i class="fas fa-shield-alt"></i>
                <span>Admin Panel</span>
            </div>
            <button onclick="toggleAdminSidebar()" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 p-2 focus:outline-none">
                <i class="fas fa-bars text-2xl"></i>
            </button>
        </div>

        <!-- Sidebar Overlay -->
        <div id="admin-sidebar-overlay" onclick="toggleAdminSidebar()" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden md:hidden"></div>

        <!-- Sidebar -->
        <aside id="admin-sidebar" class="fixed inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 z-50 h-screen overflow-y-auto pb-20 custom-scrollbar md:h-auto">
            <div class="p-6">
                <div class="hidden md:flex items-center space-x-3 text-primary dark:text-blue-400 font-bold text-xl mb-6">
                    <i class="fas fa-shield-alt"></i>
                    <span>Admin Panel</span>
                </div>
                <div class="md:hidden flex justify-end mb-4">
                    <button onclick="toggleAdminSidebar()" class="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white focus:outline-none">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <nav class="space-y-1">
                    <button onclick="navigate('admin')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-colors ${window.currentAdminView === 'dashboard' || !window.currentAdminView ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-tachometer-alt w-6"></i> Dashboard
                    </button>
                    <button onclick="navigate('admin_students')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        <i class="fas fa-user-graduate w-6"></i> Students
                    </button>
                    <button onclick="navigate('admin_staff')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        <i class="fas fa-chalkboard-teacher w-6"></i> Staff
                    </button>
                    <button onclick="navigate('admin_attendance')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        <i class="fas fa-calendar-check w-6"></i> Attendance
                    </button>
                    <button onclick="navigate('admin_notices')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        <i class="fas fa-bullhorn w-6"></i> Notice Board
                    </button>
                    <a href="#" onclick="navigate('admin_holidays')" class="flex items-center px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors ${window.currentAdminView === 'holidays' ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-calendar-alt w-6"></i> Holidays
                    </a>
                    <a href="#" onclick="navigate('admin_dcr')" class="flex items-center px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors ${window.currentAdminView === 'dcr' ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-file-invoice-dollar w-6"></i> DCR & Fees
                    </a>
                    <a href="#" onclick="navigate('admin_cashbook')" class="flex items-center px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors ${window.currentAdminView === 'cashbook' ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-book-open w-6"></i> Cash Book
                    </a>
                    <button onclick="navigate('admin_exams')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors ${window.currentAdminView === 'exams' ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-file-alt w-6"></i> Exams & Results
                    </button>
                    <button onclick="navigate('admin_formfillup')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors ${window.currentAdminView === 'formfillup' ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-file-signature w-6"></i> Form Fill Up
                    </button>
                    <button onclick="navigate('admin_seating')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 ${window.currentAdminView === 'seating' ? 'bg-blue-50 text-primary dark:bg-gray-700' : ''}">
                        <i class="fas fa-chair w-6"></i> Sitting Arrangement
                    </button>
                    <button onclick="navigate('admin_statement')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 ${window.currentAdminView === 'statement' ? 'bg-blue-50 text-primary dark:bg-gray-700' : ''}">
                        <i class="fas fa-file-invoice w-6"></i> Question Paper Statement
                    </button>
                    <button onclick="navigate('admin_credentials')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        <i class="fas fa-key w-6"></i> Credentials
                    </button>
                    <button onclick="navigate('admin_certificate')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors ${window.currentAdminView === 'certificate' ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-award w-6"></i> Achievement Certificate
                    </button>
                    <a href="#" onclick="navigate('admin_scholarships')" class="flex items-center px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors ${window.currentAdminView === 'scholarships' ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-graduation-cap w-6"></i> Scholarships
                    </a>
                    <button onclick="navigate('admin_reports')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors ${window.currentAdminView === 'reports' ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-exclamation-triangle w-6 text-red-500"></i> Reports & Anomalies
                    </button>
                    <a href="#" onclick="navigate('admin_settings')" class="flex items-center px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors ${window.currentAdminView === 'settings' ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-cog w-6"></i> Settings
                    </a>
                    <button onclick="navigate('admin_email')" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors ${['email', 'emailHistory', 'emailTemplates'].includes(window.currentAdminView) ? 'bg-blue-50 text-primary dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}">
                        <i class="fas fa-paper-plane w-6 text-blue-500"></i> Email Center
                    </button>
                </nav>
                
                <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <button onclick="toggleTheme()" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        <i class="fas fa-moon w-6"></i> Toggle Theme
                    </button>
                    <button onclick="logout()" class="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                        <i class="fas fa-sign-out-alt w-6"></i> Logout
                    </button>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-full">
            ${content}
        </div>

        <!-- Credential Display Modal (Global for Admin) -->
        <div id="credModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 w-11/12 md:max-w-md shadow-2xl text-center">
                <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="fas fa-check"></i>
                </div>
                <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">Account Generated!</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-6">Please save these credentials.</p>
                <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-left mb-6 font-mono text-sm overflow-x-auto">
                    <p><span class="text-gray-500">ID / Roll No:</span> <strong id="credId" class="text-gray-900 dark:text-white"></strong></p>
                    <p><span class="text-gray-500">Password:</span> <strong id="credPass" class="text-gray-900 dark:text-white"></strong></p>
                </div>
                <div class="flex justify-center space-x-4">
                    <button onclick="closeCredModalAndReload()" class="px-6 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">Close</button>
                    <button onclick="document.getElementById('credModal').classList.add('hidden'); document.getElementById('addStudentModal').classList.remove('hidden');" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition shadow">Add Another</button>
                </div>
            </div>
        </div>

        <!-- Edit Student Modal (Global for Admin) -->
        <div id="editStudentModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4 overflow-y-auto">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full shadow-2xl my-8">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800 dark:text-white">Edit Student Profile</h3>
                    <button type="button" onclick="document.getElementById('editStudentModal').classList.add('hidden')" class="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="editStudentForm" onsubmit="handleEditStudent(event)">
                    <input type="hidden" id="editStudentId">
                    <input type="hidden" id="editStudentYear">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Student Name</label>
                            <input type="text" id="editStudentName" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">College Roll Number</label>
                            <input type="text" id="editStudentRoll" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Council Roll Number</label>
                            <input type="text" id="editStudentCouncilRoll" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Optional">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Registration No.</label>
                            <input type="text" id="editStudentReg" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Optional">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Gender</label>
                            <select id="editStudentGender" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Optional Subject 1</label>
                            <select id="editStudentOptional1" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" onchange="validateOptionals('editStudent')">
                                <option value="">Select Optional Subject 1</option>
                                <option value="Odia Optional">Odia Optional</option>
                                <option value="Education">Education</option>
                                <option value="Economics">Economics</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Optional Subject 2</label>
                            <select id="editStudentOptional2" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" onchange="validateOptionals('editStudent')">
                                <option value="">Select Optional Subject 2</option>
                                <option value="Odia Optional">Odia Optional</option>
                                <option value="Education">Education</option>
                                <option value="Economics">Economics</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-2">Compulsory Subjects</label>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-2" id="editStudentCompulsory">
                                <label class="flex items-center space-x-2 p-2 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                    <input type="checkbox" value="MIL ODIA" class="edit-compulsory-checkbox rounded text-primary focus:ring-primary">
                                    <span class="text-sm">MIL ODIA</span>
                                </label>
                                <label class="flex items-center space-x-2 p-2 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                    <input type="checkbox" value="ENGLISH" class="edit-compulsory-checkbox rounded text-primary focus:ring-primary">
                                    <span class="text-sm">ENGLISH</span>
                                </label>
                                <label class="flex items-center space-x-2 p-2 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                    <input type="checkbox" value="POLITICAL SCIENCE" class="edit-compulsory-checkbox rounded text-primary focus:ring-primary">
                                    <span class="text-sm">POLITICAL SCIENCE</span>
                                </label>
                                <label class="flex items-center space-x-2 p-2 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                    <input type="checkbox" value="HISTORY" class="edit-compulsory-checkbox rounded text-primary focus:ring-primary">
                                    <span class="text-sm">HISTORY</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Mobile Number</label>
                            <input type="tel" id="editStudentMobile" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Optional">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email Address</label>
                            <input type="email" id="editStudentEmail" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Optional">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Father's Name</label>
                            <input type="text" id="editStudentFather" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Mother's Name</label>
                            <input type="text" id="editStudentMother" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1">Address</label>
                            <textarea id="editStudentAddress" rows="2" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3 border-t pt-4 border-gray-200 dark:border-gray-700">
                        <button type="button" onclick="document.getElementById('editStudentModal').classList.add('hidden')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 shadow">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}

function renderAdminDashboard() {
    window.currentAdminView = 'admin';
    const rawStudents = DB.getStudents();
    const uniqueStudents = [];
    const seen = new Set();
    rawStudents.forEach(s => {
        const key = (s.rollNo || '') + '_' + (s.year || '');
        if (!seen.has(key)) {
            seen.add(key);
            uniqueStudents.push(s);
        }
    });
    const students = uniqueStudents;

    const staff = DB.getStaff();
    const notices = DB.getNotices();
    const gallery = DB.getGallery();

    const teachingStaff = staff.filter(s => s && s.type === 'Teaching').length;
    const nonTeachingStaff = staff.filter(s => s && s.type === 'Non-Teaching').length;

    // Generate Gallery Grid HTML
    const generateGalleryGrid = () => {
        if (gallery.length === 0) return '<p class="text-gray-500 text-center py-4">No images in gallery. Upload one to show a welcome popup!</p>';
        return `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                ${gallery.map(img => `
                    <div class="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm aspect-video">
                        <img src="${img.url}" class="w-full h-full object-cover" alt="Gallery Image">
                        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onclick="handleDeleteGalleryImage('${img.id}', '${img.file_id}')" class="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    };

    return `
    <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Overview</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div class="glass-card p-6 flex items-center">
                <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl mr-4">
                    <i class="fas fa-users"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                    <p class="text-2xl font-bold text-gray-800 dark:text-white">${students.length}</p>
                </div>
            </div>
            
            <div class="glass-card p-6 flex items-center">
                <div class="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl mr-4">
                    <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Teaching Staff</p>
                    <p class="text-2xl font-bold text-gray-800 dark:text-white">${teachingStaff}</p>
                </div>
            </div>

            <div class="glass-card p-6 flex items-center">
                <div class="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl mr-4">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Non-Teaching Staff</p>
                    <p class="text-2xl font-bold text-gray-800 dark:text-white">${nonTeachingStaff}</p>
                </div>
            </div>

            <div class="glass-card p-6 flex items-center">
                <div class="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl mr-4">
                    <i class="fas fa-bell"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Active Notices</p>
                    <p class="text-2xl font-bold text-gray-800 dark:text-white">${notices.length}</p>
                </div>
            </div>
        </div>
        
        <div class="glass-card p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center"><i class="fas fa-images text-primary mr-2"></i>Welcome Gallery Management</h3>
                <div class="flex space-x-2">
                    <input type="file" id="galleryUploadInput" accept="image/*" class="hidden" onchange="handleGalleryUpload(event)">
                    <button onclick="document.getElementById('galleryUploadInput').click()" class="px-4 py-2 bg-primary text-white rounded shadow hover:bg-blue-800 transition text-sm">
                        <i class="fas fa-upload mr-2"></i>Upload Image
                    </button>
                </div>
            </div>
            <p class="text-gray-500 text-sm mb-4">Images uploaded here will automatically appear as a welcome popup for users visiting the home page.</p>
            ${generateGalleryGrid()}
        </div>
    </div>
    `;
}

function renderAdminStudents() {
    window.currentAdminView = 'students';
    const students = DB.getStudents();
    
    const uniqueStudents = [];
    const seen = new Set();
    students.forEach(s => {
        const key = (s.rollNo || '') + '_' + (s.year || '');
        if (!seen.has(key)) {
            seen.add(key);
            uniqueStudents.push(s);
        }
    });

    // Default legacy students to 1st year if missing
    const firstYearStudents = uniqueStudents.filter(s => !s.year || s.year === '+2 1st year');
    const secondYearStudents = uniqueStudents.filter(s => s.year === '+2 2nd year');

    const generateTableRows = (list) => {
        if(list.length === 0) return `<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">No students found in this batch.</td></tr>`;
        return list.map(s => {
            let pendingItems = [];
            if (!s.email) pendingItems.push('Email');
            if (!s.councilRollNo) pendingItems.push('Council Roll No');
            
            let missingOptCount = 0;
            if (!s.optionalSubject1) missingOptCount++;
            if (!s.optionalSubject2) missingOptCount++;
            
            if (missingOptCount > 0) {
                pendingItems.push(`${missingOptCount} optional paper(s) left`);
            }
            
            const isComplete = pendingItems.length === 0;
            const statusText = isComplete ? 'Complete' : 'Pending: ' + pendingItems.join(', ');
            const statusClass = isComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';

            return `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-6 py-4">
                    <a href="#" onclick="openEditStudentModal('${s._id || s.rollNo}', '${s.year || ''}')" class="text-primary hover:underline font-bold" title="Click to edit profile">${s.rollNo}</a>
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${s.name}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded text-xs ${statusClass}" title="${statusText}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <button onclick="toggleStudentLock('${s._id || s.rollNo}', '${s.year || ''}')" class="${s.profileLocked ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} mr-3" title="${s.profileLocked ? 'Unlock Profile' : 'Lock Profile'}"><i class="fas ${s.profileLocked ? 'fa-lock' : 'fa-lock-open'}"></i></button>
                    <button onclick="resetPassword('${s._id || s.rollNo}', '${s.year || ''}')" class="text-blue-500 hover:text-blue-700 mr-3" title="Reset Password"><i class="fas fa-key"></i></button>
                    <button onclick="deleteStudent('${s._id || s.rollNo}', '${s.year || ''}')" class="text-red-500 hover:text-red-700" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `}).join('');
    };

    return `
    <div>
        <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Student Management</h2>
            <div class="flex space-x-3">
                <button onclick="toggleAllStudentsLock(true)" class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition text-sm">
                    <i class="fas fa-lock mr-2"></i>Lock All
                </button>
                <button onclick="toggleAllStudentsLock(false)" class="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition text-sm">
                    <i class="fas fa-lock-open mr-2"></i>Unlock All
                </button>
                <button onclick="assignAllCompulsorySubjects()" class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-sm">
                    <i class="fas fa-check-double mr-2"></i>Assign Compulsory Subjects
                </button>
                <button onclick="document.getElementById('addStudentModal').classList.remove('hidden')" class="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-800 transition text-sm">
                    <i class="fas fa-plus mr-2"></i>Add Student
                </button>
            </div>
        </div>

        <div class="mb-8">
            <div class="flex justify-between items-end mb-4">
                <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300"><i class="fas fa-user-graduate mr-2 text-primary"></i>+2 1st Year Students</h3>
                ${firstYearStudents.length > 0 ? `<button onclick="promote1stYearStudents()" class="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center text-sm"><i class="fas fa-level-up-alt mr-2"></i>Promote to 2nd Year</button>` : ''}
            </div>
            <div class="glass-card overflow-hidden">
                <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th class="px-6 py-4 font-semibold">Roll No / ID</th>
                            <th class="px-6 py-4 font-semibold">Name</th>
                            <th class="px-6 py-4 font-semibold">Profile Status</th>
                            <th class="px-6 py-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        ${generateTableRows(firstYearStudents)}
                    </tbody>
                </table></div>
            </div>
        </div>

        <div>
            <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4"><i class="fas fa-user-check mr-2 text-primary"></i>+2 2nd Year Students</h3>
            <div class="glass-card overflow-hidden">
                <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th class="px-6 py-4 font-semibold">Roll No / ID</th>
                            <th class="px-6 py-4 font-semibold">Name</th>
                            <th class="px-6 py-4 font-semibold">Profile Status</th>
                            <th class="px-6 py-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        ${generateTableRows(secondYearStudents)}
                    </tbody>
                </table></div>
            </div>
        </div>

        <!-- Add Student Modal -->
        <div id="addStudentModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add New Student</h3>
                <form id="addStudentForm" onsubmit="handleAddStudent(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Academic Year</label>
                            <select id="newStudentYear" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="+2 1st year">+2 1st year</option>
                                <option value="+2 2nd year">+2 2nd year</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Student Name</label>
                            <input type="text" id="newStudentName" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">College Roll Number</label>
                            <input type="text" id="newStudentRoll" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Mobile Number</label>
                            <input type="text" id="newStudentMobile" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Optional">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email Address</label>
                            <input type="email" id="newStudentEmail" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Optional">
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="document.getElementById('addStudentModal').classList.add('hidden')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Generate Account</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}

function handleAddStudent(e) {
    e.preventDefault();
    const year = document.getElementById('newStudentYear').value;
    const name = document.getElementById('newStudentName').value.trim();
    const rollNo = document.getElementById('newStudentRoll').value.trim();
    const mobileNo = (document.getElementById('newStudentMobile') ? document.getElementById('newStudentMobile').value.trim() : '');
    const email = (document.getElementById('newStudentEmail') ? document.getElementById('newStudentEmail').value.trim() : '');
    const password = generateRandomPassword();
    const internalId = 'stu_' + Date.now() + Math.random().toString(36).substr(2, 5);

    // We no longer block duplicate roll numbers here. 
    // They can share the same Roll No (login ID), but their passwords will differentiate them,
    // and internalId will uniquely map their session to the correct student profile.

    DB.addUser({ _id: internalId, id: rollNo, password, role: 'student', name, year, email });
    DB.addStudent({
        _id: internalId, id: rollNo, rollNo, name, year, gender: "", address: "", fatherName: "", motherName: "", mobileNo: mobileNo, email: email,
        regNo: "", councilRollNo: "", attendance: 0, profileComplete: false
    });

    document.getElementById('addStudentModal').classList.add('hidden');
    
    // Refresh Student UI immediately
    navigate('admin_students');
    
    // Show credentials modal
    document.getElementById('credId').innerText = rollNo;
    document.getElementById('credPass').innerText = password;
    const credModal = document.getElementById('credModal');
    if (credModal) credModal.classList.remove('hidden');
}

window.openEditStudentModal = function(id, year = '') {
    const students = DB.getStudents();
    const student = students.find(s => {
        if (s._id) return String(s._id) === String(id);
        return String(s.rollNo) === String(id) && (s.year || '') === year;
    });
    if(!student) return;

    document.getElementById('editStudentId').value = student._id || student.rollNo;
    document.getElementById('editStudentYear').value = student.year || '';
    document.getElementById('editStudentName').value = student.name || '';
    document.getElementById('editStudentRoll').value = student.rollNo || '';
    document.getElementById('editStudentCouncilRoll').value = student.councilRollNo || '';
    document.getElementById('editStudentReg').value = student.regNo || '';
    document.getElementById('editStudentGender').value = student.gender || '';
    document.getElementById('editStudentOptional1').value = student.optionalSubject1 || '';
    document.getElementById('editStudentOptional2').value = student.optionalSubject2 || '';
    document.getElementById('editStudentAddress').value = student.address || '';
    document.getElementById('editStudentFather').value = student.fatherName || '';
    document.getElementById('editStudentMother').value = student.motherName || '';
    document.getElementById('editStudentMobile').value = student.mobileNo || '';
    document.getElementById('editStudentEmail').value = student.email || '';
    
    // Set compulsory subjects
    const compulsoryArr = student.compulsorySubjects || [];
    document.querySelectorAll('.edit-compulsory-checkbox').forEach(cb => {
        cb.checked = compulsoryArr.includes(cb.value);
    });

    document.getElementById('editStudentModal').classList.remove('hidden');
};

window.handleEditStudent = function(e) {
    e.preventDefault();
    const id = document.getElementById('editStudentId').value;
    const year = document.getElementById('editStudentYear').value;
    const name = document.getElementById('editStudentName').value.trim();
    const rollNo = document.getElementById('editStudentRoll').value.trim();
    const councilRollNo = document.getElementById('editStudentCouncilRoll').value.trim();
    const regNo = document.getElementById('editStudentReg').value.trim();
    const gender = document.getElementById('editStudentGender').value;
    const optionalSubject1 = document.getElementById('editStudentOptional1').value;
    const optionalSubject2 = document.getElementById('editStudentOptional2').value;
    const address = document.getElementById('editStudentAddress').value.trim();
    const fatherName = document.getElementById('editStudentFather').value.trim();
    const motherName = document.getElementById('editStudentMother').value.trim();
    const mobileNo = document.getElementById('editStudentMobile').value.trim();
    const email = document.getElementById('editStudentEmail').value.trim();

    if (optionalSubject1 && optionalSubject2 && optionalSubject1 === optionalSubject2) {
        showToast("Optional 1 and Optional 2 papers must be different.", "error");
        return;
    }

    if (!name || !rollNo) {
        showToast('Name and Roll Number are required', 'error');
        return;
    }

    let students = DB.getStudents();
    let student = students.find(s => {
        if (s._id) return String(s._id) === String(id);
        return String(s.rollNo) === String(id) && (s.year || '') === year;
    });
    
    if(student) {
        if(student.rollNo !== rollNo || student.email !== email || student.name !== name) {
            let users = DB.get('users') || [];
            let user = users.find(u => u._id === student._id || (u.id === student.rollNo && u.role === 'student' && (u.year || '') === (student.year || '')));
            if(user) {
                user.id = rollNo;
                user.name = name;
                user.email = email;
                DB.set('users', users);
            }
        }

        student.name = name;
        student.rollNo = rollNo;
        student.councilRollNo = councilRollNo;
        student.regNo = regNo;
        student.gender = gender;
        student.optionalSubject1 = optionalSubject1;
        student.optionalSubject2 = optionalSubject2;
        student.address = address;
        student.fatherName = fatherName;
        student.motherName = motherName;
        student.mobileNo = mobileNo;
        student.email = email;
        
        // Get compulsory subjects
        const compulsorySubjects = [];
        document.querySelectorAll('.edit-compulsory-checkbox:checked').forEach(cb => {
            compulsorySubjects.push(cb.value);
        });
        student.compulsorySubjects = compulsorySubjects;
        
        student.profileComplete = true;
        
        DB.updateStudent(student._id || student.rollNo, student, student.year);
        showToast('Student profile updated successfully!');
        
        document.getElementById('editStudentModal').classList.add('hidden');
        
        let target = window.currentAdminView || 'admin_students';
        if (target !== 'admin' && !target.startsWith('admin_')) {
            target = 'admin_' + target;
        }
        navigate(target);
    }
}

window.assignAllCompulsorySubjects = function() {
    if (!confirm('Are you sure you want to assign the 4 Compulsory Subjects (MIL ODIA, ENGLISH, POLITICAL SCIENCE, HISTORY) to ALL students?')) return;
    
    const students = DB.getStudents();
    const defaultCompulsory = ["MIL ODIA", "ENGLISH", "POLITICAL SCIENCE", "HISTORY"];
    let updatedCount = 0;
    
    students.forEach(student => {
        student.compulsorySubjects = defaultCompulsory;
        DB.updateStudent(student._id || student.rollNo, student, student.year);
        updatedCount++;
    });
    
    showToast(`Successfully assigned compulsory subjects to ${updatedCount} students!`);
    
    let target = window.currentAdminView || 'admin_students';
    if (target !== 'admin' && !target.startsWith('admin_')) {
        target = 'admin_' + target;
    }
    navigate(target);
}

function closeCredModalAndReload() {
    const credModal = document.getElementById('credModal');
    if (credModal) credModal.classList.add('hidden');
    
    let target = window.currentAdminView || 'admin';
    if (target !== 'admin' && !target.startsWith('admin_')) {
        target = 'admin_' + target;
    }
    navigate(target);
}

// --- Gallery Management ---
window.handleGalleryUpload = async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    showToast('Uploading image to database...', 'info');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            const imageObj = {
                id: 'gal_' + Date.now() + Math.random().toString(36).substr(2, 5),
                file_id: result.file_id,
                url: result.url,
                timestamp: Date.now()
            };
            
            DB.addGalleryImage(imageObj);
            showToast('Image successfully added to Gallery!');
            if(window.renderCurrentView) window.renderCurrentView();
        } else {
            showToast('Failed to upload image: ' + result.error, 'error');
        }
    } catch (e) {
        showToast('Error uploading image to server', 'error');
        console.error(e);
    }
    
    event.target.value = ''; // Reset input
};

window.handleDeleteGalleryImage = async function(id, file_id) {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    showToast('Deleting image...', 'info');
    
    try {
        const response = await fetch('/api/image/' + file_id, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
            DB.deleteGalleryImage(id);
            showToast('Image deleted successfully!');
            if(window.renderCurrentView) window.renderCurrentView();
        } else {
            showToast('Failed to delete from database: ' + result.error, 'error');
        }
    } catch (e) {
        showToast('Error deleting image', 'error');
        console.error(e);
    }
};

window.addAnotherUser = function() {
    const credModal = document.getElementById('credModal');
    if (credModal) credModal.classList.add('hidden');
    
    if (window.currentAdminView === 'students') {
        document.getElementById('newStudentName').value = '';
        document.getElementById('newStudentRoll').value = '';
        document.getElementById('addStudentModal').classList.remove('hidden');
    } else if (window.currentAdminView === 'staff') {
        document.getElementById('newStaffName').value = '';
        document.getElementById('newStaffId').value = '';
        document.getElementById('addStaffModal').classList.remove('hidden');
    }
}

function resetPassword(id, year) {
    if(confirm(`Are you sure you want to reset password?`)) {
        const newPass = generateRandomPassword();
        DB.updateUser(id, newPass, year);
        
        // Show cred modal
        const modal = document.getElementById('credModal');
        if(modal) {
            document.getElementById('credId').innerText = id;
            document.getElementById('credPass').innerText = newPass;
            modal.querySelector('h3').innerText = 'Password Reset Successful';
            modal.classList.remove('hidden');
        } else {
            showToast(`New password for ${id}: ${newPass}`);
        }
    }
}

window.toggleStudentLock = function(id, year) {
    let students = DB.getStudents();
    let student = students.find(s => {
        if (s._id) return String(s._id) === String(id);
        return String(s.rollNo) === String(id) && (s.year || '') === year;
    });
    
    if(student) {
        student.profileLocked = !student.profileLocked;
        DB.set('students', students);
        showToast(student.profileLocked ? 'Profile Locked' : 'Profile Unlocked', student.profileLocked ? 'error' : 'success');
        navigate('admin_students');
    }
};

window.toggleAllStudentsLock = function(lock) {
    if(confirm(lock ? 'Are you sure you want to lock ALL student profiles?' : 'Are you sure you want to unlock ALL student profiles?')) {
        let students = DB.getStudents();
        students.forEach(s => {
            s.profileLocked = lock;
        });
        DB.set('students', students);
        showToast(lock ? 'All Student Profiles Locked' : 'All Student Profiles Unlocked', lock ? 'error' : 'success');
        navigate('admin_students');
    }
};

window.deleteStudent = function(id, year) {
    if(confirm(`Are you sure you want to completely delete the student account? This action cannot be undone.`)) {
        let allUsers = DB.getUsers();
        let allStudents = DB.getStudents();
        
        const targetId = String(id);
        
        const studentToDelete = allStudents.find(s => {
            const matchId = s._id ? String(s._id) === targetId : false;
            const matchRollNo = String(s.rollNo) === targetId && (s.year || '') === (year || '');
            return matchId || matchRollNo;
        });

        if (!studentToDelete) {
            alert('Error: Student not found in local database!');
            return;
        }

        allStudents = allStudents.filter(s => s !== studentToDelete);
        
        allUsers = allUsers.filter(u => {
            // Delete the matching rollNo and year
            return !(String(u.id) === String(studentToDelete.rollNo) && (u.year || '') === (studentToDelete.year || ''));
        });
        
        DB.set('users', allUsers);
        DB.set('students', allStudents);
        
        showToast('Student deleted successfully');
        navigate('admin_students'); // Refresh UI
    }
}

window.promote1stYearStudents = function() {
    if(!confirm("⚠️ WARNING: This will PERMANENTLY DELETE all current '+2 2nd year' students (profiles and logins) and promote all '+2 1st year' students to 2nd year. This action cannot be undone! Are you absolutely sure?")) {
        return;
    }

    let allStudents = DB.getStudents();
    let allUsers = DB.getUsers();
    
    // Find all 2nd year students to delete
    const secondYearStudents = allStudents.filter(s => s.year === '+2 2nd year');
    
    // Delete them from users robustly
    allUsers = allUsers.filter(u => {
        if (u.role !== 'student') return true; // keep staff/admin
        
        if (u.year === '+2 2nd year') return false; // definitely delete
        
        // If year is missing, check if their ID matches a 2nd year student and NOT a 1st year student
        const is2ndYear = secondYearStudents.some(s => String(s.rollNo) === String(u.id));
        const is1stYear = allStudents.some(s => s.year !== '+2 2nd year' && String(s.rollNo) === String(u.id));
        
        if (is2ndYear && !is1stYear) return false;
        
        return true;
    });

    // Remove 2nd years from students array
    allStudents = allStudents.filter(s => s.year !== '+2 2nd year');
    
    // Promote 1st years
    allStudents.forEach(s => {
        if(!s.year || s.year === '+2 1st year') {
            s.year = '+2 2nd year';
            s.profileComplete = false;
            
            // Promote corresponding user record
            const userRec = allUsers.find(u => {
                if (u.role !== 'student') return false;
                if (s._id && u._id) return String(u._id) === String(s._id);
                return String(u.id) === String(s.rollNo) && (!u.year || u.year === '+2 1st year');
            });
            if (userRec) {
                userRec.year = '+2 2nd year';
            }
        }
    });

    // Save back to DB
    DB.set('users', allUsers);
    DB.set('students', allStudents);
    DB.set('attendance', []); // Reset attendance for the new academic year
    
    showToast("Successfully promoted 1st year students, cleared the old batch, and reset attendance.");
    navigate('admin_students'); // Refresh UI
};

// --- Staff Management ---
function renderAdminStaff() {
    window.currentAdminView = 'staff';
    const staff = DB.getStaff();
    
    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Staff Management</h2>
            <button onclick="document.getElementById('addStaffModal').classList.remove('hidden')" class="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-800 transition">
                <i class="fas fa-plus mr-2"></i>Add Staff
            </button>
        </div>

        <div class="glass-card overflow-hidden">
            <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <tr>
                        <th class="px-6 py-4 font-semibold">Staff ID</th>
                        <th class="px-6 py-4 font-semibold">Name</th>
                        <th class="px-6 py-4 font-semibold">Mobile</th>
                        <th class="px-6 py-4 font-semibold">Email</th>
                        <th class="px-6 py-4 font-semibold">Designation</th>
                        <th class="px-6 py-4 font-semibold">Category</th>
                        <th class="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    ${staff.map(s => `
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td class="px-6 py-4">${s.id}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${s.name}</td>
                            <td class="px-6 py-4">${s.mobile}</td>
                            <td class="px-6 py-4 text-gray-500">${s.email || '-'}</td>
                            <td class="px-6 py-4 text-gray-700 dark:text-gray-300">${s.designation || '-'}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 rounded text-xs ${s.type === 'Teaching' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}">
                                    ${s.type}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <button onclick="openEditStaffModal('${s.id}')" class="text-green-500 hover:text-green-700 mr-3" title="Edit Profile"><i class="fas fa-edit"></i></button>
                                <button onclick="resetPassword('${s.id}')" class="text-blue-500 hover:text-blue-700 mr-3" title="Reset Password"><i class="fas fa-key"></i></button>
                                <button onclick="deleteStaff('${s.id}')" class="text-red-500 hover:text-red-700" title="Delete"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                    ${staff.length === 0 ? `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No staff found. Add one to get started.</td></tr>` : ''}
                </tbody>
            </table></div>
        </div>

        <!-- Add Staff Modal -->
        <div id="addStaffModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add New Staff</h3>
                <form id="addStaffForm" onsubmit="handleAddStaff(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Staff Name</label>
                            <input type="text" id="newStaffName" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Mobile Number</label>
                            <input type="text" id="newStaffMobile" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email Address</label>
                            <input type="email" id="newStaffEmail" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Optional">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Designation / Post</label>
                            <input type="text" id="newStaffDesignation" placeholder="e.g. Principal, Lecturer in Odia" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Category</label>
                            <select id="newStaffType" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="Teaching">Teaching Staff</option>
                                <option value="Non-Teaching">Non-Teaching Staff</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Image URL</label>
                            <input type="url" id="newStaffImageUrl" placeholder="Optional" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Leadership & Vision Message</label>
                            <textarea id="newStaffMessage" rows="3" placeholder="Optional" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="document.getElementById('addStaffModal').classList.add('hidden')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Generate Account</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit Staff Modal -->
        <div id="editStaffModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Edit Staff Details</h3>
                <form id="editStaffForm" onsubmit="handleEditStaff(event)">
                    <input type="hidden" id="editStaffId">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Staff Name</label>
                            <input type="text" id="editStaffName" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Mobile Number</label>
                            <input type="text" id="editStaffMobile" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email Address</label>
                            <input type="email" id="editStaffEmail" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Optional">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Designation / Post</label>
                            <input type="text" id="editStaffDesignation" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Category</label>
                            <select id="editStaffType" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="Teaching">Teaching Staff</option>
                                <option value="Non-Teaching">Non-Teaching Staff</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Image URL</label>
                            <input type="text" id="editStaffImageUrl" placeholder="Optional" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Leadership & Vision Message</label>
                            <textarea id="editStaffMessage" rows="3" placeholder="Optional" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="closeEditStaffModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}

function handleAddStaff(e) {
    e.preventDefault();
    const name = document.getElementById('newStaffName').value.trim();
    const mobile = document.getElementById('newStaffMobile').value.trim();
    const email = document.getElementById('newStaffEmail').value.trim();
    const designation = document.getElementById('newStaffDesignation').value.trim();
    const type = document.getElementById('newStaffType').value;
    const imageUrl = document.getElementById('newStaffImageUrl').value.trim();
    const message = document.getElementById('newStaffMessage').value.trim();
    
    // Generate Staff ID (e.g. ANIL_KUMAR)
    const staffId = name.replace(/\s+/g, '_').toUpperCase() + '_' + Math.floor(Math.random() * 1000);
    const password = generateRandomPassword();

    DB.addUser({ id: staffId, password, role: 'staff', name, email, year: '' });
    DB.addStaff({ id: staffId, name, mobile, email, type, designation, imageUrl, message });

    document.getElementById('addStaffModal').classList.add('hidden');
    
    // Refresh Staff UI immediately
    navigate('admin_staff');
    
    // Show credentials modal
    document.getElementById('credId').innerText = staffId;
    document.getElementById('credPass').innerText = password;
    const credModal = document.getElementById('credModal');
    if (credModal) credModal.classList.remove('hidden');
}

async function deleteStaff(id) {
    if(confirm('Are you sure you want to delete this staff member?')) {
        let staffList = DB.getStaff();
        const staff = staffList.find(s => s.id === id);
        
        if (staff && staff.imageUrl && staff.imageUrl.includes('/api/image/')) {
            const parts = staff.imageUrl.split('/');
            const fileId = parts[parts.length - 1];
            if (fileId) {
                try {
                    await fetch(`/api/image/${fileId}`, { method: 'DELETE' });
                } catch (err) {
                    console.error('Failed to delete staff image from server', err);
                }
            }
        }
        
        staffList = staffList.filter(s => s.id !== id);
        DB.set('staff', staffList);
        
        let usersList = DB.getUsers();
        usersList = usersList.filter(u => u.id !== id);
        DB.set('users', usersList);
        
        showToast('Staff deleted');
        navigate('admin_staff');
    }
}

window.openEditStaffModal = (id) => {
    const staffList = DB.getStaff();
    const staff = staffList.find(s => s.id === id);
    if (!staff) return;
    
    document.getElementById('editStaffId').value = staff.id;
    document.getElementById('editStaffName').value = staff.name || '';
    document.getElementById('editStaffMobile').value = staff.mobile || '';
    document.getElementById('editStaffEmail').value = staff.email || '';
    document.getElementById('editStaffDesignation').value = staff.designation || '';
    document.getElementById('editStaffType').value = staff.type || 'Teaching';
    document.getElementById('editStaffImageUrl').value = staff.imageUrl || '';
    document.getElementById('editStaffMessage').value = staff.message || '';
    
    document.getElementById('editStaffModal').classList.remove('hidden');
};

window.closeEditStaffModal = () => {
    document.getElementById('editStaffModal').classList.add('hidden');
};

window.handleEditStaff = (e) => {
    e.preventDefault();
    const id = document.getElementById('editStaffId').value;
    const name = document.getElementById('editStaffName').value.trim();
    const mobile = document.getElementById('editStaffMobile').value.trim();
    const email = document.getElementById('editStaffEmail').value.trim();
    const designation = document.getElementById('editStaffDesignation').value.trim();
    const type = document.getElementById('editStaffType').value;
    const imageUrl = document.getElementById('editStaffImageUrl').value.trim();
    const message = document.getElementById('editStaffMessage').value.trim();
    
    let staffList = DB.getStaff();
    const staffIndex = staffList.findIndex(s => s.id === id);
    if (staffIndex !== -1) {
        staffList[staffIndex] = { ...staffList[staffIndex], name, mobile, email, designation, type, imageUrl, message };
        DB.set('staff', staffList);
        
        let usersList = DB.getUsers();
        const userIndex = usersList.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            usersList[userIndex].name = name;
            usersList[userIndex].email = email;
            DB.set('users', usersList);
        }
        
        showToast('Staff profile updated');
        closeEditStaffModal();
        navigate('admin_staff');
    }
};

// --- Notice Board Management ---
function renderAdminNotices() {
    window.currentAdminView = 'notices';
    const notices = DB.getNotices();
    
    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Notice Board Management</h2>
            <button onclick="document.getElementById('addNoticeModal').classList.remove('hidden')" class="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-800 transition">
                <i class="fas fa-plus mr-2"></i>New Notice
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${notices.map(n => `
                <div class="glass-card p-6 relative">
                    <div class="absolute top-4 right-4 flex space-x-2">
                        ${n.pinned ? '<i class="fas fa-thumbtack text-secondary mr-2 text-xl" title="Pinned"></i>' : ''}
                        <button onclick="printNotice('${n.id}')" class="text-blue-500 hover:text-blue-700" title="Print Notice"><i class="fas fa-print"></i></button>
                        <button onclick="handleDeleteNotice('${n.id}')" class="text-red-500 hover:text-red-700" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                    <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2 w-3/4">${n.title}</h3>
                    <p class="text-sm text-gray-500 mb-4">${n.date}</p>
                    <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">${n.content}</p>
                </div>
            `).join('')}
            ${notices.length === 0 ? `<div class="col-span-full p-8 text-center text-gray-500 glass-card">No notices published yet.</div>` : ''}
        </div>

        <!-- Add Notice Modal -->
        <div id="addNoticeModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full shadow-2xl">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Create Notice</h3>
                <form onsubmit="handleAddNotice(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Notice Title</label>
                            <input type="text" id="noticeTitle" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Content</label>
                            <textarea id="noticeContent" required rows="4" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="noticePinned" class="mr-2 text-primary">
                            <label class="text-sm font-medium">Pin this notice to top</label>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="document.getElementById('addNoticeModal').classList.add('hidden')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Publish Notice</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}

function handleAddNotice(e) {
    e.preventDefault();
    const title = document.getElementById('noticeTitle').value;
    const content = document.getElementById('noticeContent').value;
    const pinned = document.getElementById('noticePinned').checked;
    const date = new Date().toISOString().split('T')[0];

    DB.addNotice({ title, content, pinned, date, author: currentUser ? currentUser.name : 'Admin' });
    document.getElementById('addNoticeModal').classList.add('hidden');
    document.getElementById('noticeTitle').value = '';
    document.getElementById('noticeContent').value = '';
    document.getElementById('noticePinned').checked = false;
    
    showToast('Notice published successfully!');
    navigate('admin_notices');
}

window.printNotice = (id) => {
    const notice = DB.getNotices().find(n => n.id == id);
    if (!notice) return;
    
    let printContainer = document.getElementById('notice-print-container');
    if (!printContainer) {
        printContainer = document.createElement('div');
        printContainer.id = 'notice-print-container';
        document.body.appendChild(printContainer);
    }
    
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    printContainer.innerHTML = `
        <div style="padding: 40px; font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; color: #000; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px;">
                <h1 style="margin: 0; font-size: 28px; text-transform: uppercase; font-weight: bold;">Narayani Science Higher Secondary School</h1>
                <h2 style="margin: 8px 0 0; font-size: 20px; font-weight: bold; text-decoration: underline;">OFFICIAL NOTICE</h2>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 16px;">
                <div><strong>Ref No:</strong> NTC/${new Date().getFullYear()}/${id}</div>
                <div><strong>Date:</strong> ${notice.date}</div>
            </div>
            
            <h3 style="font-size: 22px; font-weight: bold; margin-bottom: 20px; text-align: center;">Subject: ${notice.title}</h3>
            
            <div style="font-size: 18px; white-space: pre-wrap; text-align: justify; margin-bottom: 50px;">${notice.content}</div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 80px;">
                <div style="text-align: center;">
                    <p style="margin-bottom: 40px;">___________________</p>
                    <p><strong>Clerk Signature</strong></p>
                </div>
                <div style="text-align: center;">
                    <p style="margin-bottom: 40px;">___________________</p>
                    <p><strong>Principal Signature</strong></p>
                </div>
            </div>
            <div style="margin-top: 30px; font-size: 12px; text-align: center; color: #666;">
                Printed on: ${currentDate} | Generated by Narayani Science Higher Secondary School
            </div>
        </div>
    `;
    
    document.body.classList.add('printing-notice');
    
    setTimeout(() => {
        window.print();
        setTimeout(() => {
            document.body.classList.remove('printing-notice');
        }, 1000);
    }, 100);
};

function handleDeleteNotice(id) {
    if(confirm('Delete this notice?')) {
        DB.deleteNotice(id);
        showToast('Notice deleted');
        navigate('admin_notices');
    }
}

// --- Holiday Management ---
function renderAdminHolidays() {
    window.currentAdminView = 'holidays';
    const holidays = DB.getHolidays();
    
    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Holiday Management</h2>
            <button onclick="document.getElementById('addHolidayModal').classList.remove('hidden')" class="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-800 transition">
                <i class="fas fa-plus mr-2"></i>Add Holiday
            </button>
        </div>

        <div class="glass-card overflow-hidden max-w-3xl mx-auto">
            <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <tr>
                        <th class="px-6 py-4 font-semibold w-1/4">Date</th>
                        <th class="px-6 py-4 font-semibold w-2/4">Occasion / Holiday Name</th>
                        <th class="px-6 py-4 font-semibold w-1/4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    ${holidays.map(h => `
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td class="px-6 py-4 font-medium">${h.date}</td>
                            <td class="px-6 py-4">${h.name}</td>
                            <td class="px-6 py-4 text-right">
                                <button onclick="handleDeleteHoliday(${h.id})" class="text-red-500 hover:text-red-700" title="Delete"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                    ${holidays.length === 0 ? `<tr><td colspan="3" class="px-6 py-8 text-center text-gray-500">No holidays declared.</td></tr>` : ''}
                </tbody>
            </table></div>
        </div>

        <!-- Add Holiday Modal -->
        <div id="addHolidayModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add Holiday</h3>
                <form onsubmit="handleAddHoliday(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Holiday Name</label>
                            <input type="text" id="holidayName" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Date</label>
                            <input type="date" id="holidayDate" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" onclick="document.getElementById('addHolidayModal').classList.add('hidden')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800">Add Holiday</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}

function handleAddHoliday(e) {
    e.preventDefault();
    const name = document.getElementById('holidayName').value;
    const date = document.getElementById('holidayDate').value;

    DB.addHoliday({ name, date });
    showToast('Holiday added successfully!');
    navigate('admin_holidays');
}

function handleDeleteHoliday(id) {
    if(confirm('Delete this holiday?')) {
        DB.deleteHoliday(id);
        showToast('Holiday deleted');
        navigate('admin_holidays');
    }
}

// --- Attendance Management (Admin View) ---
function renderAdminAttendance() {
    window.currentAdminView = 'attendance';
    const attendance = DB.getAttendance();
    const students = DB.getStudents();
    
    // Sort by date descending
    attendance.sort((a,b) => new Date(b.date) - new Date(a.date));
    
    return `
    <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Attendance Overview</h2>
        
        <div class="space-y-6">
            ${attendance.map(att => {
                let p = 0, a = 0, l = 0;
                Object.values(att.records).forEach(status => {
                    if(status === 'Present') p++;
                    if(status === 'Absent') a++;
                    if(status === 'Late') l++;
                });
                
                return `
                <div class="glass-card p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-lg text-gray-800 dark:text-white">Date: ${att.date} <span class="text-primary text-sm">(${att.targetYear || 'All'})</span></h3>
                        <div class="flex space-x-2">
                            <button onclick="exportAttendanceExcel('${att.date}', '${att.targetYear || ''}')" class="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-lg text-sm font-semibold transition flex items-center">
                                <i class="fas fa-file-excel mr-2"></i> Export
                            </button>
                            <button onclick="openAdminEditAtt('${att.date}', '${att.targetYear || ''}')" class="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg text-sm font-semibold transition flex items-center">
                                <i class="fas fa-edit mr-2"></i> Edit
                            </button>
                        </div>
                    </div>
                    <div class="flex space-x-4">
                        <span class="px-3 py-1 bg-green-100 text-green-700 rounded font-semibold text-sm">Present: ${p}</span>
                        <span class="px-3 py-1 bg-red-100 text-red-700 rounded font-semibold text-sm">Absent: ${a}</span>
                        <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded font-semibold text-sm">Late: ${l}</span>
                    </div>
                </div>
                `;
            }).join('')}
            ${attendance.length === 0 ? `<div class="glass-card p-8 text-center text-gray-500">No attendance records found. Teachers must mark attendance first.</div>` : ''}
        </div>

        <!-- Admin Edit Attendance Modal -->
        <div id="adminEditAttModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">Edit Attendance (<span id="adminEditAttDateStr"></span>)</h3>
                    <button onclick="document.getElementById('adminEditAttModal').classList.add('hidden')" class="text-gray-500 hover:text-red-500 transition">
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
                        <tbody id="adminEditAttTableBody" class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-300">
                        </tbody>
                    </table></div>
                </div>

                <div class="flex justify-end pt-4 border-t dark:border-gray-700">
                    <button onclick="saveAdminAttendance()" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition">Update Attendance</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

window.exportAttendanceExcel = (date, targetYear) => {
    const att = DB.getAttendance().find(a => a.date === date && (a.targetYear || '') === (targetYear || ''));
    if (!att) return;
    const students = DB.getStudents();
    
    // Add UTF-8 BOM for perfect Excel compatibility
    let csv = "\uFEFF";
    csv += "Narayani Science Higher Secondary School\r\n";
    csv += `Attendance Report - Date: ${date} - Batch: ${targetYear || 'All'}\r\n\r\n`;
    csv += "Roll No,Student Name,Batch,Status\r\n";
    
    Object.keys(att.records).forEach(rollNo => {
        const stu = students.find(s => s.rollNo === rollNo && (!att.targetYear || s.year === att.targetYear));
        const status = att.records[rollNo];
        const name = stu ? stu.name.replace(/"/g, '""') : 'Unknown';
        const batch = stu ? stu.year : 'Unknown';
        csv += `"${rollNo}","${name}","${batch}","${status}"\r\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_${date}_${targetYear || 'All'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.openAdminEditAtt = (date, targetYear) => {
    window.currentEditAttDate = date;
    window.currentEditAttYear = targetYear;
    const att = DB.getAttendance().find(a => a.date === date && (a.targetYear || '') === (targetYear || ''));
    const students = DB.getStudents().filter(s => {
        if (targetYear) return s.year === targetYear;
        return true;
    });
    
    document.getElementById('adminEditAttDateStr').innerText = date + (targetYear ? ' (' + targetYear + ')' : '');
    const tbody = document.getElementById('adminEditAttTableBody');
    
    tbody.innerHTML = students.map(s => {
        let status = 'Present';
        if (att && att.records && att.records[s.rollNo]) {
            status = att.records[s.rollNo];
        }
        return `
            <tr>
                <td class="px-4 py-3">${s.rollNo}</td>
                <td class="px-4 py-3">${s.name}</td>
                <td class="px-4 py-3">
                    <div class="flex space-x-2">
                        <label class="flex items-center cursor-pointer"><input type="radio" name="admin_att_${s.rollNo}" value="Present" ${status === 'Present' ? 'checked' : ''} class="mr-1 text-green-500"> P</label>
                        <label class="flex items-center cursor-pointer ml-3"><input type="radio" name="admin_att_${s.rollNo}" value="Absent" ${status === 'Absent' ? 'checked' : ''} class="mr-1 text-red-500"> A</label>
                        <label class="flex items-center cursor-pointer ml-3"><input type="radio" name="admin_att_${s.rollNo}" value="Late" ${status === 'Late' ? 'checked' : ''} class="mr-1 text-yellow-500"> L</label>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('adminEditAttModal').classList.remove('hidden');
};

window.saveAdminAttendance = () => {
    const date = window.currentEditAttDate;
    const targetYear = window.currentEditAttYear;
    const students = DB.getStudents().filter(s => {
        if (targetYear) return s.year === targetYear;
        return true;
    });
    const records = {};
    
    students.forEach(s => {
        const selected = document.querySelector(`input[name="admin_att_${s.rollNo}"]:checked`);
        if(selected) {
            records[s.rollNo] = selected.value;
        }
    });

    DB.saveAttendance(date, targetYear, records);
    showToast(`Attendance updated for ${date}`);
    document.getElementById('adminEditAttModal').classList.add('hidden');
    navigate('admin_attendance');
};

// --- College Info / Settings ---
function renderAdminCollegeInfo() {
    window.currentAdminView = 'college';
    const info = DB.getCollegeInfo();
    
    return `
    <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">College Settings</h2>
        
        <div class="glass-card p-8 max-w-4xl">
            <form onsubmit="handleSaveCollegeInfo(event)">
                <h3 class="text-lg font-bold mb-4 text-primary border-b pb-2">General Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-sm font-medium mb-1">College Name</label>
                        <input type="text" id="ci_name" value="${info.name}" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Principal Name</label>
                        <input type="text" id="ci_principal" value="${info.principal}" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Contact Number</label>
                        <input type="text" id="ci_contact" value="${info.contactNumber}" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Email Address</label>
                        <input type="email" id="ci_email" value="${info.email}" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Official Website</label>
                        <input type="text" id="ci_website" value="${info.website}" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Google Maps Embed URL</label>
                        <input type="url" id="ci_mapsurl" value="${info.mapsUrl || ''}" placeholder="Paste Google Maps Embed URL or <iframe> snippet..." class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <p class="text-xs text-gray-500 mt-1">Go to Google Maps > Share > Embed a map > Copy HTML and paste it here to show a live map on the front page.</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">College Logo</label>
                        ${info.logoUrl ? `<div class="mb-2 relative inline-block"><img src="${info.logoUrl}" class="h-20 object-contain rounded border border-gray-300 dark:border-gray-600"><button type="button" onclick="handleDeleteSettingImage('logoUrl', '${info.logoUrl}')" class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg" title="Delete Image"><i class="fas fa-times text-xs"></i></button></div>` : ''}
                        <input type="file" id="ci_logo" accept="image/*" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-800">
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Principal's Signature (For Mark Sheets)</label>
                        ${info.signatureImageUrl ? `<div class="mb-2 relative inline-block"><img src="${info.signatureImageUrl}" class="h-12 object-contain rounded border border-gray-300 dark:border-gray-600 bg-white"><button type="button" onclick="handleDeleteSettingImage('signatureImageUrl', '${info.signatureImageUrl}')" class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg" title="Delete Signature"><i class="fas fa-times text-xs"></i></button></div>` : ''}
                        <input type="file" id="ci_signature_img" accept="image/*" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-800">
                        <p class="text-xs text-gray-500 mt-1">Upload a transparent PNG signature for student result sheets.</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Timetable Image (For Students)</label>
                        ${info.timetableImageUrl ? `<div class="mb-2 relative inline-block"><img src="${info.timetableImageUrl}" class="h-20 object-contain rounded border border-gray-300 dark:border-gray-600"><button type="button" onclick="handleDeleteSettingImage('timetableImageUrl', '${info.timetableImageUrl}')" class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg" title="Delete Image"><i class="fas fa-times text-xs"></i></button></div>` : ''}
                        <input type="file" id="ci_timetable_img" accept="image/*" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-800">
                        <p class="text-xs text-gray-500 mt-1">Upload a new image to replace the current timetable.</p>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-1">Address</label>
                        <textarea id="ci_address" rows="2" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">${info.address}</textarea>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-1">Contact Admin Message (Optional)</label>
                        <textarea id="ci_contact_admin" rows="2" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Custom message when clicking Contact Admin. Leave blank to show default address/phone.">${info.contactAdminMessage || ''}</textarea>
                    </div>
                </div>

                <h3 class="text-lg font-bold mb-4 text-primary border-b pb-2">Fee Structure</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <!-- +2 1st Year Admission Fee -->
                    <div class="glass-card p-4">
                        <h4 class="font-bold text-gray-800 dark:text-white mb-3">+2 1st Yr Admission Fee</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label class="block text-xs font-medium mb-1">General (Boys)</label><input type="number" id="fee_ad_gb" value="${info.feeStructure?.admission_1st_yr?.general_boys || ''}" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></div>
                            <div><label class="block text-xs font-medium mb-1">General (Girls)</label><input type="number" id="fee_ad_gg" value="${info.feeStructure?.admission_1st_yr?.general_girls || ''}" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></div>
                            <div><label class="block text-xs font-medium mb-1">SC/ST (Boys)</label><input type="number" id="fee_ad_sb" value="${info.feeStructure?.admission_1st_yr?.scst_boys || ''}" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></div>
                            <div><label class="block text-xs font-medium mb-1">SC/ST (Girls)</label><input type="number" id="fee_ad_sg" value="${info.feeStructure?.admission_1st_yr?.scst_girls || ''}" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></div>
                        </div>
                    </div>
                    <!-- +2 2nd Year Readmission Fee -->
                    <div class="glass-card p-4">
                        <h4 class="font-bold text-gray-800 dark:text-white mb-3">+2 2nd Yr Readmission Fee</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label class="block text-xs font-medium mb-1">General (Boys)</label><input type="number" id="fee_re_gb" value="${info.feeStructure?.readmission_2nd_yr?.general_boys || ''}" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></div>
                            <div><label class="block text-xs font-medium mb-1">General (Girls)</label><input type="number" id="fee_re_gg" value="${info.feeStructure?.readmission_2nd_yr?.general_girls || ''}" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></div>
                            <div><label class="block text-xs font-medium mb-1">SC/ST (Boys)</label><input type="number" id="fee_re_sb" value="${info.feeStructure?.readmission_2nd_yr?.scst_boys || ''}" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></div>
                            <div><label class="block text-xs font-medium mb-1">SC/ST (Girls)</label><input type="number" id="fee_re_sg" value="${info.feeStructure?.readmission_2nd_yr?.scst_girls || ''}" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"></div>
                        </div>
                    </div>
                </div>

                <h3 class="text-lg font-bold mb-4 text-primary border-b pb-2">Statistics (Displayed on Home)</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label class="block text-sm font-medium mb-1">+2 First Year</label>
                        <input type="number" id="ci_fy" value="${info.stats.firstYear}" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">+2 Second Year</label>
                        <input type="number" id="ci_sy" value="${info.stats.secondYear}" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Total Students</label>
                        <input type="number" id="ci_total" value="${info.stats.totalStudents}" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                </div>

                <div class="mt-8 border-t dark:border-gray-700 pt-6">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="font-bold text-gray-800 dark:text-white">Staff Leadership Details</h4>
                    </div>
                    <p class="text-xs text-gray-500 mb-4">Attach an image and a "Leadership & Vision" message for any of your registered staff members. This will instantly appear on the Home page.</p>
                    
                    <div id="leadershipContainer">
                        ${DB.getStaff().map((p, index) => `
                            <div class="leadership-row border dark:border-gray-700 p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-900/30" data-staff-id="${p.id}">
                                <div class="flex justify-between items-center mb-3">
                                    <h5 class="font-bold text-gray-700 dark:text-gray-300">${p.name} <span class="text-xs text-primary font-medium ml-2">(${p.designation || p.type})</span></h5>
                                </div>
                                <div class="grid grid-cols-1 gap-4">
                                    <div><label class="block text-xs font-medium mb-1">Message</label><textarea class="lp-message w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="2" placeholder="Optional vision message...">${p.message || ''}</textarea></div>
                                    <div>
                                        <label class="block text-xs font-medium mb-1">Photo (Leave empty to keep current)</label>
                                        ${p.imageUrl ? `<div class="mb-2 relative inline-block"><img src="${p.imageUrl}" class="h-16 w-16 object-cover rounded border border-gray-300 dark:border-gray-600 shadow-sm"><button type="button" onclick="handleDeleteStaffImage('${p.id}', '${p.imageUrl}')" class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg" title="Delete Photo"><i class="fas fa-times text-xs"></i></button></div>` : ''}
                                        <input type="file" accept="image/*" class="lp-image w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <input type="hidden" class="lp-existing-img" value="${p.imageUrl || ''}">
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="mt-8 flex justify-end">
                    <button type="submit" class="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-800 transition flex items-center">
                        <i class="fas fa-save mr-2"></i> Save Settings
                    </button>
                </div>
            </form>
        </div>
    </div>
    `;
}

window.handleDeleteSettingImage = async (field, url) => {
    if(!confirm('Are you sure you want to delete this image?')) return;
    
    // Extract file_id from url if it exists
    const parts = url.split('/');
    const fileId = parts[parts.length - 1];
    
    if (fileId && url.includes('/api/image/')) {
        try {
            await fetch(`/api/image/${fileId}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Failed to delete image from server', err);
        }
    }
    
    const info = DB.getCollegeInfo();
    info[field] = null;
    DB.set('collegeInfo', info);
    
    showToast('Image deleted successfully');
    renderUI(); // Re-render to show updated settings
};

window.handleDeleteStaffImage = async (staffId, url) => {
    if(!confirm('Are you sure you want to delete this photo?')) return;
    
    const parts = url.split('/');
    const fileId = parts[parts.length - 1];
    
    if (fileId && url.includes('/api/image/')) {
        try {
            await fetch(`/api/image/${fileId}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Failed to delete image from server', err);
        }
    }
    
    let staffList = DB.getStaff();
    const s = staffList.find(x => x.id === staffId);
    if(s) {
        s.imageUrl = '';
        DB.set('staff', staffList);
    }
    
    showToast('Photo deleted successfully');
    renderAdminCollege(); // Refresh UI to remove thumbnail
};

async function handleSaveCollegeInfo(e) {
    e.preventDefault();
    const currentInfo = DB.getCollegeInfo();
    
    // Extract file_id from an existing URL to pass as old_file_id
    const extractFileId = (url) => {
        if (!url) return null;
        const parts = url.split('/');
        return parts[parts.length - 1];
    };
    
    async function uploadFile(file, oldUrl) {
        if (!file) return null;
        const formData = new FormData();
        formData.append('file', file);
        const oldFileId = extractFileId(oldUrl);
        if (oldFileId) {
            formData.append('old_file_id', oldFileId);
        }
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                return data.url;
            }
            console.error('Upload failed:', data.error);
            return null;
        } catch (err) {
            console.error('Upload request failed:', err);
            return null;
        }
    }
    
    let parsedMapsUrl = document.getElementById('ci_mapsurl').value.trim();
    if (parsedMapsUrl.startsWith('<iframe')) {
        const match = parsedMapsUrl.match(/src="([^"]+)"/);
        if (match) parsedMapsUrl = match[1];
    }
    
    const info = {
        name: document.getElementById('ci_name').value,
        contactNumber: document.getElementById('ci_contact').value,
        email: document.getElementById('ci_email').value,
        website: document.getElementById('ci_website').value,
        mapsUrl: parsedMapsUrl,
        principal: document.getElementById('ci_principal').value,
        address: document.getElementById('ci_address').value,
        contactAdminMessage: document.getElementById('ci_contact_admin').value,
        logoUrl: currentInfo.logoUrl || null,
        signatureImageUrl: currentInfo.signatureImageUrl || null,
        timetableImageUrl: currentInfo.timetableImageUrl || null,
        stats: {
            firstYear: document.getElementById('ci_fy').value,
            secondYear: document.getElementById('ci_sy').value,
            totalStudents: document.getElementById('ci_total').value
        },
        feeStructure: {
            admission_1st_yr: {
                general_boys: document.getElementById('fee_ad_gb').value,
                general_girls: document.getElementById('fee_ad_gg').value,
                scst_boys: document.getElementById('fee_ad_sb').value,
                scst_girls: document.getElementById('fee_ad_sg').value
            },
            readmission_2nd_yr: {
                general_boys: document.getElementById('fee_re_gb').value,
                general_girls: document.getElementById('fee_re_gg').value,
                scst_boys: document.getElementById('fee_re_sb').value,
                scst_girls: document.getElementById('fee_re_sg').value
            }
        }
    };
    
    // Show saving toast
    showToast('Uploading images, please wait...');
    
    const logoFile = document.getElementById('ci_logo').files[0];

    const signatureImgFile = document.getElementById('ci_signature_img').files[0];
    const timetableImgFile = document.getElementById('ci_timetable_img').files[0];
    
    if (logoFile) {
        const url = await uploadFile(logoFile, currentInfo.logoUrl);
        if (url) info.logoUrl = url;
    }
    if (signatureImgFile) {
        const url = await uploadFile(signatureImgFile, info.signatureImageUrl);
        if (url) info.signatureImageUrl = url;
    }
    if (timetableImgFile) {
        const url = await uploadFile(timetableImgFile, currentInfo.timetableImageUrl);
        if (url) info.timetableImageUrl = url;
    }
    
    // Parse Staff Leadership Details
    const leadershipRows = Array.from(document.querySelectorAll('.leadership-row'));
    let staffList = DB.getStaff();
    
    for (let i = 0; i < leadershipRows.length; i++) {
        const row = leadershipRows[i];
        const staffId = row.getAttribute('data-staff-id');
        const staffMember = staffList.find(s => s.id === staffId);
        if(!staffMember) continue;

        const existingImg = row.querySelector('.lp-existing-img').value;
        const message = row.querySelector('.lp-message').value.trim();
        let finalImageUrl = existingImg;
        
        const fileInput = row.querySelector('.lp-image');
        if (fileInput.files.length > 0) {
            const url = await uploadFile(fileInput.files[0], existingImg);
            if (url) finalImageUrl = url;
        }
        
        staffMember.message = message;
        staffMember.imageUrl = finalImageUrl;
    }
    DB.set('staff', staffList);

    DB.updateCollegeInfo(info);
    updateCollegeHeader();
    showToast('College information updated successfully!');
    navigate('admin_college');
}

// --- Credentials Management ---
function renderAdminCredentials() {
    window.currentAdminView = 'credentials';
    const users = DB.getUsers().filter(u => u.role !== 'admin');
    
    const staff = users.filter(u => u.role === 'staff');
    const firstYear = users.filter(u => u.role === 'student' && u.year === '+2 1st year');
    const secondYear = users.filter(u => u.role === 'student' && u.year === '+2 2nd year');
    const otherStudents = users.filter(u => u.role === 'student' && u.year !== '+2 1st year' && u.year !== '+2 2nd year');

    const renderTable = (title, list) => `
        <h3 class="text-lg font-bold mb-4 mt-8 text-gray-800 dark:text-white">${title}</h3>
        <div class="glass-card overflow-hidden">
            <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <tr>
                        <th class="px-6 py-4 font-semibold">ID / Roll No</th>
                        <th class="px-6 py-4 font-semibold">Name</th>
                        <th class="px-6 py-4 font-semibold">Password</th>
                        <th class="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    ${list.map(u => `
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td class="px-6 py-4 font-mono">${u.id}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${u.name}</td>
                            <td class="px-6 py-4 font-mono text-gray-900 dark:text-white">${u.password}</td>
                            <td class="px-6 py-4 text-right whitespace-nowrap">
                                <button onclick="resetPassword('${u._id || u.id}', '${u.year || ''}')" class="text-blue-500 hover:text-blue-700 mr-2" title="Reset Password">
                                    <i class="fas fa-redo-alt"></i> Reset
                                </button>
                                <button onclick="deleteSystemCredential('${u._id || u.id}', '${u.year || ''}')" class="text-red-500 hover:text-red-700" title="Delete Credential">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                    ${list.length === 0 ? '<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">No generated accounts found.</td></tr>' : ''}
                </tbody>
            </table></div>
        </div>
    `;

    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">System Credentials</h2>
        </div>

        ${renderTable('Staff Credentials', staff)}
        ${renderTable('+2 1st Year Student Credentials', firstYear)}
        ${renderTable('+2 2nd Year Student Credentials', secondYear)}
        ${otherStudents.length > 0 ? renderTable('Other Student Credentials', otherStudents) : ''}
    </div>
    `;
}

window.handleAdminPasswordChange = (e) => {
    e.preventDefault();
    const newPass = document.getElementById('adminNewPassword').value.trim();
    if(newPass.length < 4) {
        showToast("Password must be at least 4 characters.", "error");
        return;
    }
    DB.updateUser('admin', newPass);
    showToast("Admin password updated successfully! Please log in again.", "success");
    document.getElementById('adminNewPassword').value = '';
    
    // Log the user out immediately so their old session ends
    setTimeout(() => {
        if (window.logout) window.logout();
    }, 1500);
};

window.deleteSystemCredential = function(id, year) {
    if(confirm(`Are you sure you want to delete these login credentials?`)) {
        let allUsers = DB.getUsers();
        
        const userToDelete = allUsers.find(u => {
            if (u._id) return String(u._id) === String(id);
            return String(u.id) === String(id) && (u.year || '') === (year || '');
        });
        
        if (userToDelete) {
            allUsers = allUsers.filter(u => u !== userToDelete);
            DB.set('users', allUsers);
        }
        
        showToast(`Credentials deleted.`);
        navigate('admin_credentials');
    }
}

// --- Scholarships Management ---
function renderAdminScholarships() {
    window.currentAdminView = 'scholarships';
    const scholarships = DB.getScholarships();

    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Scholarships Management</h2>
            <button onclick="document.getElementById('addScholarshipModal').classList.remove('hidden')" class="btn-primary">
                <i class="fas fa-plus mr-2"></i> Add Scholarship
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${scholarships.length > 0 ? scholarships.map(s => `
                <div class="glass-card p-6 border-t-4 border-primary flex flex-col">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${s.title}</h3>
                    <p class="text-sm text-gray-500 mb-4 flex-grow line-clamp-3">${s.process}</p>
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <i class="fas fa-calendar-alt mr-2"></i> Deadline: ${s.deadline || 'Not set'}
                    </div>
                    <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <a href="${s.siteUrl}" target="_blank" class="text-primary hover:underline text-sm font-semibold">
                            <i class="fas fa-external-link-alt mr-1"></i> Visit Site
                        </a>
                        <button onclick="deleteScholarship('${s.id}')" class="text-red-500 hover:text-red-700 p-2 transition">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('') : `
                <div class="col-span-full glass-card p-12 text-center text-gray-500">
                    <i class="fas fa-award text-4xl mb-4 text-gray-300"></i>
                    <p>No scholarships have been added yet.</p>
                </div>
            `}
        </div>

        <!-- Add Scholarship Modal -->
        <div id="addScholarshipModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl transform transition-all relative">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">Add Scholarship</h3>
                    <button onclick="document.getElementById('addScholarshipModal').classList.add('hidden')" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form onsubmit="handleAddScholarship(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scholarship Title</label>
                        <input type="text" id="s_title" required class="input-field" placeholder="e.g. State Merit Scholarship">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Application URL</label>
                        <input type="url" id="s_url" required class="input-field" placeholder="https://...">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                        <input type="date" id="s_deadline" class="input-field">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Application Process</label>
                        <textarea id="s_process" required rows="4" class="input-field" placeholder="Describe the steps to apply..."></textarea>
                    </div>
                    <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                        <button type="button" onclick="document.getElementById('addScholarshipModal').classList.add('hidden')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium">Cancel</button>
                        <button type="submit" class="btn-primary px-6">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}

window.handleAddScholarship = (e) => {
    e.preventDefault();
    const scholarship = {
        title: document.getElementById('s_title').value,
        siteUrl: document.getElementById('s_url').value,
        deadline: document.getElementById('s_deadline').value,
        process: document.getElementById('s_process').value
    };
    
    DB.addScholarship(scholarship);
    
    // Automatically post to Notice Board
    const noticeContent = `A new scholarship has been added to the portal.\n\nScholarship Name: ${scholarship.title}\nDeadline: ${scholarship.deadline}\n\nApplication Process:\n${scholarship.process}\n\nMore Info / Apply Here: ${scholarship.siteUrl}`;
    
    DB.addNotice({
        title: `🏆 New Scholarship: ${scholarship.title}`,
        date: new Date().toLocaleDateString('en-GB'),
        content: noticeContent,
        pinned: true
    });
    
    showToast('Scholarship and Notice added successfully!');
    document.getElementById('addScholarshipModal').classList.add('hidden');
    navigate('admin_scholarships');
};

window.deleteScholarship = (id) => {
    if(confirm('Are you sure you want to delete this scholarship?')) {
        DB.deleteScholarship(id);
        showToast('Scholarship deleted!');
        navigate('admin_scholarships');
    }
};

