// WebSocket State Management
window._state = {
    collegeInfo: null,
    users: [],
    students: [],
    staff: [],
    notices: [],
    holidays: [],
    attendance: [],
    exams: [],
    classTests: [],
    dcrSettings: [],
    dcrRecords: [],
    cashBookSettings: { openingBalance: 0 },
    cashBookTransactions: [],
    gallery: [],
    pendingResets: { dcr: null, cashbook: null }
};

// Connect to Socket.IO server on the same host/port
const socket = io();
window.socket = socket;

socket.on('connect', () => {
    console.log('Connected to backend Server. Requesting full state...');
    socket.emit('get_full_state');
});

const DEFAULT_DATA = {
    collegeInfo: {
        name: "Narayani Science Higher Secondary School",
        tagline: "Empowering Minds, Shaping Futures",
        contactNumber: "+1 (555) 123-4567",
        email: "contact@narayani.edu.np",
        website: "www.narayani.edu.np",
        principal: "Dr. Robert Smith",
        address: "123 Education Lane, Knowledge City, ST 12345",
        aboutUs: "Welcome to our esteemed institution. We are dedicated to providing excellent education and fostering an environment of growth and innovation.",
        stats: { firstYear: 250, secondYear: 230, totalStudents: 480 },
        feeStructure: {
            admission_1st_yr: { general_boys: "", general_girls: "", scst_boys: "", scst_girls: "" },
            readmission_2nd_yr: { general_boys: "", general_girls: "", scst_boys: "", scst_girls: "" }
        }
    },
    users: [
        { id: "admin", password: "admin", role: "admin", name: "System Administrator" }
    ],
    dcrSettings: [
        { id: 'dcr_admissionFee', name: 'Admission Fee', amount: 0 },
        { id: 'dcr_libraryFee', name: 'Library Fee', amount: 0 },
        { id: 'dcr_sportsFee', name: 'Sports Fee', amount: 0 },
        { id: 'dcr_examFee', name: 'Examination Fee', amount: 0 },
        { id: 'dcr_nssFee', name: 'NSS Fees', amount: 0 },
        { id: 'dcr_yrcFee', name: 'Youth Red Cross (YRC) Fees', amount: 0 }
    ],
    cashBookSettings: { openingBalance: 0 }
};

socket.on('full_state_response', (state) => {
    console.log('Received full state from backend.');
    
    // Auto-seed empty database
    let seeded = false;
    if (!state.collegeInfo || Object.keys(state.collegeInfo).length === 0) {
        state.collegeInfo = DEFAULT_DATA.collegeInfo;
        socket.emit('update_state', { key: 'collegeInfo', data: DEFAULT_DATA.collegeInfo });
        seeded = true;
    }
    if (!state.users || state.users.length === 0) {
        state.users = DEFAULT_DATA.users;
        socket.emit('update_state', { key: 'users', data: DEFAULT_DATA.users });
        seeded = true;
    }
    if (!state.dcrSettings || state.dcrSettings.length === 0) {
        state.dcrSettings = DEFAULT_DATA.dcrSettings;
        socket.emit('update_state', { key: 'dcrSettings', data: DEFAULT_DATA.dcrSettings });
        seeded = true;
    }
    
    window._state = state;
    
    // Trigger the initial app load if not already loaded
    if (window.initApp && !window.appInitialized) {
        window.initApp();
    } else if (window.appInitialized) {
        // Just re-render current view if we reconnected
        if (window.renderCurrentView) window.renderCurrentView();
    }
});

socket.on('state_updated', (payload) => {
    if (payload.key && payload.data !== undefined) {
        window._state[payload.key] = payload.data;
        
        // Security Sync: If the user database changes, verify user exists
        if (payload.key === 'users' && window.currentUser) {
            const dbUser = payload.data.find(u => String(u.id) === String(window.currentUser.id));
            if (!dbUser) {
                // Account deleted on another device. Force logout instantly!
                if (window.logout) window.logout();
                return;
            }
        }
        
        // Re-render UI to reflect real-time changes
        if (window.renderCurrentView) window.renderCurrentView();
    }
});

socket.on('force_logout_user', (userId) => {
    if (window.currentUser && String(window.currentUser.id) === String(userId)) {
        if (window.logout) window.logout();
    }
});

// Helper functions for DB access
const DB = {
    get: (key) => window._state[key],
    set: (key, data) => {
        window._state[key] = data; // Update local cache instantly
        
        const payload = { key, data };
        
        // Attach JWT token for authenticated operations
        const token = sessionStorage.getItem('cms_token');
        if (token) {
            payload.token = token;
        }
        
        socket.emit('update_state', payload); // Send to backend
    },
    
    // Specific operations
    getUsers: () => DB.get('users') || [],
    getStudents: () => DB.get('students') || [],
    getStaff: () => DB.get('staff') || [],
    getNotices: () => DB.get('notices') || [],
    getHolidays: () => DB.get('holidays') || [],
    getCollegeInfo: () => DB.get('collegeInfo') || {},
    getAttendance: () => DB.get('attendance') || [],
    getExams: () => DB.get('exams') || [],
    getClassTests: () => DB.get('classTests') || [],
    getDcrSettings: () => DB.get('dcrSettings') || DEFAULT_DATA.dcrSettings,
    getDcrRecords: () => DB.get('dcrRecords') || [],
    getCashBookSettings: () => DB.get('cashBookSettings') || DEFAULT_DATA.cashBookSettings,
    getCashBookTransactions: () => DB.get('cashBookTransactions') || [],
    getScholarships: () => DB.get('scholarships') || [],
    getSeatingArrangements: () => DB.get('seatingArrangements') || [],
    getPendingResets: () => {
        if (window._state.pendingResets && Object.keys(window._state.pendingResets).length > 0) {
            return window._state.pendingResets;
        }
        try {
            const local = localStorage.getItem('pendingResets');
            if (local) return JSON.parse(local);
        } catch(e) {}
        return { dcr: null, cashbook: null };
    },

    // Reset logic
    requestReset: (type) => {
        const resets = DB.getPendingResets();
        resets[type] = Date.now() + 30 * 60 * 1000;
        DB.set('pendingResets', resets);
        localStorage.setItem('pendingResets', JSON.stringify(resets));
        socket.emit('update_state', {
            key: 'pendingResets',
            data: resets
        });
    },
    cancelReset: (type) => {
        const resets = DB.getPendingResets();
        resets[type] = null;
        DB.set('pendingResets', resets);
        localStorage.setItem('pendingResets', JSON.stringify(resets));
        socket.emit('update_state', {
            key: 'pendingResets',
            data: resets
        });
    },
    checkPendingResets: () => {
        const pending = DB.getPendingResets();
        const now = Date.now();
        let updated = false;

        if (pending.dcr && pending.dcr <= now) {
            DB.set('dcrRecords', []);
            pending.dcr = null;
            updated = true;
        }
        if (pending.cashbook && pending.cashbook <= now) {
            DB.set('cashBookTransactions', []);
            pending.cashbook = null;
            updated = true;
        }
        
        if (updated) {
            DB.set('pendingResets', pending);
            localStorage.setItem('pendingResets', JSON.stringify(pending));
        }
    },

    // Scholarships Setters
    addScholarship: (scholarship) => {
        const scholarships = DB.getScholarships();
        scholarships.unshift({ ...scholarship, id: 'S' + Date.now() });
        DB.set('scholarships', scholarships);
    },
    updateScholarship: (id, updatedData) => {
        let scholarships = DB.getScholarships();
        scholarships = scholarships.map(s => s.id === id ? { ...s, ...updatedData } : s);
        DB.set('scholarships', scholarships);
    },
    deleteScholarship: (id) => {
        const scholarships = DB.getScholarships().filter(s => s.id !== id);
        DB.set('scholarships', scholarships);
    },

    addUser: (user) => {
        const users = DB.getUsers();
        users.push(user);
        DB.set('users', users);
    },
    updateUser: (id, newPassword, year = '') => {
        const users = DB.getUsers();
        const index = users.findIndex(u => {
            const matchId = u._id ? String(u._id) === String(id) : false;
            const matchRollNo = String(u.id) === String(id) && (u.year || '') === (year || '');
            return matchId || matchRollNo;
        });
        if(index !== -1) {
            users[index].password = newPassword;
            DB.set('users', users);
        } else {
            console.error("updateUser: User not found!", {id, year});
            alert("Error: Could not find user to update password.");
        }
    },
    addStudent: (student) => {
        const students = DB.getStudents();
        students.push(student);
        DB.set('students', students);
    },
    updateStudent: (id, data, year = '') => {
        const students = DB.getStudents();
        const index = students.findIndex(s => {
            if (s._id) return String(s._id) === String(id);
            return String(s.rollNo) === String(id) && (s.year || '') === (year || '');
        });
        if(index !== -1) {
            students[index] = { ...students[index], ...data };
            DB.set('students', students);
        }
    },
    addStaff: (staff) => {
        const staffList = DB.getStaff();
        staffList.push(staff);
        DB.set('staff', staffList);
    },
    updateStaff: (id, data) => {
        const staffList = DB.getStaff();
        const index = staffList.findIndex(s => s.id === id);
        if(index !== -1) {
            staffList[index] = { ...staffList[index], ...data };
            DB.set('staff', staffList);
        }
    },
    addNotice: (notice) => {
        const notices = DB.getNotices();
        notice.id = Date.now();
        notice.createdAt = new Date().toISOString();
        notices.unshift(notice);
        DB.set('notices', notices);
    },
    deleteNotice: (id) => {
        DB.set('notices', DB.getNotices().filter(n => String(n.id) !== String(id)));
    },
    addHoliday: (holiday) => {
        const holidays = DB.getHolidays();
        holiday.id = Date.now();
        holiday.createdAt = new Date().toISOString();
        holidays.push(holiday);
        holidays.sort((a,b) => new Date(a.date) - new Date(b.date));
        DB.set('holidays', holidays);
    },
    deleteHoliday: (id) => {
        DB.set('holidays', DB.getHolidays().filter(h => h.id !== id));
    },
    saveClassTest: (test) => {
        const classTests = DB.getClassTests();
        const index = classTests.findIndex(t => t.id === test.id);
        if (index !== -1) {
            classTests[index] = test;
        } else {
            classTests.push(test);
        }
        DB.set('classTests', classTests);
    },
    deleteClassTest: (id) => {
        DB.set('classTests', DB.getClassTests().filter(t => t.id !== id));
    },
    updateCollegeInfo: (info) => {
        DB.set('collegeInfo', info);
    },
    saveAttendance: (date, targetYear, records) => {
        const attendanceList = DB.getAttendance();
        const index = attendanceList.findIndex(a => a.date === date && a.targetYear === targetYear);
        if(index !== -1) {
            attendanceList[index].records = records;
        } else {
            attendanceList.push({ date, targetYear, records });
        }
        DB.set('attendance', attendanceList);
    },
    
    // --- Exams & Results ---
    addExam: (exam) => {
        let exams = DB.getExams();
        exams.push(exam);
        DB.set('exams', exams);
    },
    updateExam: (id, data) => {
        let exams = DB.getExams();
        let index = exams.findIndex(e => e.id === id);
        if (index > -1) {
            exams[index] = { ...exams[index], ...data };
            DB.set('exams', exams);
        }
    },
    deleteExam: (id) => {
        let exams = DB.getExams();
        exams = exams.filter(e => e.id !== id);
        DB.set('exams', exams);
    },
    saveExamResult: (examId, rollNo, marks, attendancePct) => {
        let exams = DB.getExams();
        let index = exams.findIndex(e => e.id === examId);
        if (index > -1) {
            if (!exams[index].results) exams[index].results = {};
            exams[index].results[rollNo] = { marks, attendancePct };
            DB.set('exams', exams);
        }
    },
    updateDcrSettings: (settings) => {
        DB.set('dcrSettings', settings);
    },
    addDcrRecord: (record) => {
        let records = DB.getDcrRecords();
        records.push(record);
        DB.set('dcrRecords', records);
    },
    resetDcrRecords: () => {
        DB.set('dcrRecords', []);
    },
    removeFormFillUpDcrRecord: (rollNo) => {
        let records = DB.getDcrRecords();
        records = records.filter(r => !(r.isFormFillUp && String(r.rollNo) === String(rollNo) && r.year === '+2 2nd year'));
        DB.set('dcrRecords', records);
    },
    updateCashBookSettings: (settings) => {
        DB.set('cashBookSettings', settings);
    },
    addCashBookTransaction: (transaction) => {
        let transactions = DB.getCashBookTransactions();
        transactions.push(transaction);
        DB.set('cashBookTransactions', transactions);
    },
    updateCashBookTransaction: (updatedTransaction) => {
        let transactions = DB.getCashBookTransactions();
        const index = transactions.findIndex(t => t.id === updatedTransaction.id);
        if (index > -1) {
            transactions[index] = updatedTransaction;
            DB.set('cashBookTransactions', transactions);
        }
    },
    deleteCashBookTransaction: (id) => {
        const tr = DB.getCashBookTransactions();
        DB.set('cashBookTransactions', tr.filter(t => t.id !== id));
    },

    // --- Gallery ---
    getGallery: () => DB.get('gallery') || [],
    addGalleryImage: (imageObj) => {
        const gallery = DB.getGallery();
        gallery.push(imageObj);
        DB.set('gallery', gallery);
    },
    deleteGalleryImage: (id) => {
        const gallery = DB.getGallery();
        DB.set('gallery', gallery.filter(img => img.id !== id));
    },
    resetCashBookTransactions: () => {
        DB.set('cashBookTransactions', []);
        DB.set('cashBookSettings', { openingBalance: 0 });
    }
};
