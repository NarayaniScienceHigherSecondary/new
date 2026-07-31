window.renderAdminEmailCenter = () => {
    window.currentAdminView = 'email';
    
    // Fetch data for recipients
    const students = DB.getStudents() || [];
    const staff = DB.getStaff() || [];
    const notices = DB.getNotices() || [];

    return `
    <div class="animate-fade-in">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                <i class="fas fa-paper-plane text-primary mr-2"></i> Email Notification Center
            </h2>
            <div class="mt-4 md:mt-0 flex space-x-3">
                <button onclick="navigate('admin_emailTemplates')" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    <i class="fas fa-file-alt mr-2"></i> Templates
                </button>
                <button onclick="navigate('admin_emailHistory')" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                    <i class="fas fa-history mr-2"></i> History & Analytics
                </button>
            </div>
        </div>

        <div class="glass-card p-6 lg:p-8 max-w-4xl mx-auto rounded-xl">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-3">Compose New Email</h3>
            
            <form id="emailForm" onsubmit="handleSendEmail(event)">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-sm font-medium mb-1">Target Audience</label>
                        <select id="emailAudience" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary transition" onchange="toggleEmailSpecifics()">
                            <option value="all">All Registered Users</option>
                            <option value="students">All Students</option>
                            <option value="plus2_1st">+2 1st Year Students</option>
                            <option value="plus2_2nd">+2 2nd Year Students</option>
                            <option value="staff">All Staff & Faculty</option>
                            <option value="specific">Specific Individuals</option>
                        </select>
                    </div>
                    
                    <div id="specificEmailsContainer" class="hidden">
                        <label class="block text-sm font-medium mb-1">Recipient Email(s)</label>
                        <input type="text" id="emailSpecific" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary transition" placeholder="Comma separated emails">
                        <p class="text-xs text-gray-500 mt-1">E.g. student1@example.com, student2@example.com</p>
                    </div>
                    
                    <div id="noticeSelectContainer" class="md:col-span-2">
                        <label class="block text-sm font-medium mb-1">Select Notice, Template, or Custom Message</label>
                        <select id="emailNoticeSelect" required onchange="loadNoticeToEmail()" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary transition">
                            <option value="">-- Choose Message Type --</option>
                            <option value="custom" class="font-bold text-primary">-- ✍️ Type Custom Email --</option>
                            <option value="credentials" class="font-bold text-green-600">-- 🔐 Send Login Credentials --</option>
                            <optgroup label="Published Notices">
                                ${notices.map(n => `<option value="${n.id}">${n.title} (${n.date})</option>`).join('')}
                            </optgroup>
                            <optgroup label="Image Templates">
                                ${(DB.get('emailTemplates') || []).map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                            </optgroup>
                        </select>
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium mb-1">Subject</label>
                    <input type="text" id="emailSubject" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg font-semibold focus:ring-primary transition" placeholder="Email Subject">
                </div>

                <div id="customMessageContainer" class="mb-6 hidden animate-fade-in">
                    <label class="block text-sm font-medium mb-1">Message Body</label>
                    <textarea id="emailCustomMessage" rows="6" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary transition" placeholder="Type your message here..."></textarea>
                </div>

                <div class="flex items-center space-x-4">
                    <button type="submit" id="sendEmailBtn" class="px-8 py-3 bg-gradient-to-r from-blue-600 to-primary text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition transform hover:-translate-y-1">
                        <i class="fas fa-paper-plane mr-2"></i> Send Emails
                    </button>
                    <span id="emailQueueStatus" class="text-sm text-gray-500 italic hidden">
                        <i class="fas fa-spinner fa-spin mr-1"></i> Queuing emails...
                    </span>
                </div>
            </form>
        </div>
    </div>
    `;
};

window.toggleEmailSpecifics = () => {
    const val = document.getElementById('emailAudience').value;
    if (val === 'specific') {
        document.getElementById('specificEmailsContainer').classList.remove('hidden');
    } else {
        document.getElementById('specificEmailsContainer').classList.add('hidden');
    }
};

window.loadNoticeToEmail = () => {
    const noticeId = document.getElementById('emailNoticeSelect').value;
    const customContainer = document.getElementById('customMessageContainer');
    
    if (noticeId === 'custom') {
        customContainer.classList.remove('hidden');
        document.getElementById('emailSubject').value = '';
        return;
    } else if (noticeId === 'credentials') {
        customContainer.classList.add('hidden');
        document.getElementById('emailSubject').value = 'Your College Portal Login Credentials';
        return;
    } else {
        customContainer.classList.add('hidden');
    }
    
    if (!noticeId) return;
    
    if (noticeId.startsWith('TPL_')) {
        const templates = DB.get('emailTemplates') || [];
        const tpl = templates.find(t => t.id === noticeId);
        if (tpl) {
            document.getElementById('emailSubject').value = tpl.subject || '';
        }
        return;
    }
    
    const notices = DB.getNotices() || [];
    const notice = notices.find(n => String(n.id) === String(noticeId));
    if (notice) {
        document.getElementById('emailSubject').value = notice.title || '';
    }
};

window.handleSendEmail = (e) => {
    e.preventDefault();
    
    const audience = document.getElementById('emailAudience').value;
    const specificEmails = document.getElementById('emailSpecific').value.split(',').map(e => e.trim()).filter(e => e);
    const subject = document.getElementById('emailSubject').value;
    const noticeId = document.getElementById('emailNoticeSelect').value;
    let message = '';
    
    if (noticeId === 'credentials') {
        // message gets generated per-user below
    } else if (noticeId === 'custom') {
        const customText = document.getElementById('emailCustomMessage').value;
        if (!customText.trim()) {
            showToast('Please enter a message', 'error');
            return;
        }
        message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0; font-size: 24px;">${subject}</h2>
                    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
                </div>
                <div style="padding: 20px; color: #374151; line-height: 1.6;">
                    <p>Dear {name},</p>
                    <div style="margin-top: 20px;">
                        ${customText.replace(/\n/g, '<br>')}
                    </div>
                </div>
                <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
                    This is an automated notification from ${DB.getCollegeInfo().name || 'Narayani Science Higher Secondary School'}.
                </div>
            </div>
        `;
    } else if (noticeId.startsWith('TPL_')) {
        const templates = DB.get('emailTemplates') || [];
        const tpl = templates.find(t => t.id === noticeId);
        
        if (!tpl) {
            showToast('Please select a valid template', 'error');
            return;
        }
        
        message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #f9fafb;">
                <div style="padding: 20px; text-align: center;">
                    ${tpl.body}
                </div>
                <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
                    This is an automated notification from ${DB.getCollegeInfo().name || 'Narayani Science Higher Secondary School'}.
                </div>
            </div>
        `;
    } else {
        const notices = DB.getNotices() || [];
        const notice = notices.find(n => String(n.id) === String(noticeId));
        
        if (!notice) {
            showToast('Please select a notice, template, or custom message', 'error');
            return;
        }
        
        message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0; font-size: 24px;">${notice.title}</h2>
                    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Published: ${notice.date}</p>
                </div>
                <div style="padding: 20px; color: #374151; line-height: 1.6;">
                    <p>Dear {name},</p>
                    <div style="margin-top: 20px;">
                        ${(notice.content || '').replace(/\n/g, '<br>')}
                    </div>
                </div>
                <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
                    This is an automated notification from ${DB.getCollegeInfo().name || 'Narayani Science Higher Secondary School'}.
                </div>
            </div>
        `;
    }
    
    const btn = document.getElementById('sendEmailBtn');
    const status = document.getElementById('emailQueueStatus');
    
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    status.classList.remove('hidden');
    
    let recipients = [];
    const students = DB.getStudents() || [];
    const staff = DB.getStaff() || [];
    
    if (audience === 'all' || audience === 'students') {
        students.forEach(s => {
            if (s.email) recipients.push({ email: s.email, name: s.name, id: s.id, year: s.year, role: 'student' });
        });
    }
    if (audience === 'plus2_1st') {
        students.filter(s => (s.year || '').trim() === '+2 1st year').forEach(s => {
            if (s.email) recipients.push({ email: s.email, name: s.name, id: s.id, year: s.year, role: 'student' });
        });
    }
    if (audience === 'plus2_2nd') {
        students.filter(s => (s.year || '').trim() === '+2 2nd year').forEach(s => {
            if (s.email) recipients.push({ email: s.email, name: s.name, id: s.id, year: s.year, role: 'student' });
        });
    }
    if (audience === 'all' || audience === 'staff') {
        staff.forEach(s => {
            if (s.email) recipients.push({ email: s.email, name: s.name, id: s.id, role: 'staff' });
        });
    }
    if (audience === 'specific') {
        specificEmails.forEach(e => {
            const eLower = e.trim().toLowerCase();
            let matchedStaff = staff.find(s => (s.email || '').toLowerCase() === eLower);
            let matchedStudent = students.find(s => (s.email || '').toLowerCase() === eLower);
            
            if (matchedStaff) {
                // Fallow for staff: first check mail id, get staff id
                recipients.push({ email: e.trim(), name: matchedStaff.name, id: matchedStaff.id, role: 'staff' });
            } else if (matchedStudent) {
                recipients.push({ email: e.trim(), name: matchedStudent.name, id: matchedStudent.id, year: matchedStudent.year, role: 'student' });
            } else {
                recipients.push({ email: e.trim(), name: 'User', id: null });
            }
        });
    }
    
    // Deduplicate
    const uniqueRecipients = [];
    const seenEmails = new Set();
    for (let r of recipients) {
        if (!seenEmails.has(r.email)) {
            seenEmails.add(r.email);
            uniqueRecipients.push(r);
        }
    }
    
    if (uniqueRecipients.length === 0) {
        showToast('No valid email recipients found for the selected audience.', 'error');
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        status.classList.add('hidden');
        return;
    }
    
    // Build payload
    const users = DB.getUsers() || [];
    
    const payload = uniqueRecipients.map(r => {
        let personalizedMsg = '';
        
        if (noticeId === 'credentials') {
            // First try looking up by ID and Year, fallback to email if it was a specific typed email
            let userAccount = null;
            if (r.id) {
                // Check staff id (or student id) to get the password
                userAccount = users.find(u => {
                    if (String(u.id) !== String(r.id)) return false;
                    if (r.role && u.role !== r.role) return false;
                    if (r.year) {
                        return (u.year || '') === (r.year || '');
                    }
                    return true;
                });
            }
            if (!userAccount) {
                // If it couldn't be matched via ID, fallback to strictly looking for staff first, then others
                userAccount = users.find(u => u.role === 'staff' && (u.email || '').toLowerCase() === r.email.toLowerCase()) || 
                              users.find(u => (u.email || '').toLowerCase() === r.email.toLowerCase());
            }
            
            if (userAccount) {
                personalizedMsg = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
                            <h2 style="margin: 0; font-size: 24px;">Your Login Credentials</h2>
                        </div>
                        <div style="padding: 20px; color: #374151; line-height: 1.6;">
                            <p>Dear ${r.name},</p>
                            <p>Your account is ready for the College Portal. Please keep these credentials safe.</p>
                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; font-family: monospace;">
                                <strong>Login ID:</strong> ${userAccount.id}<br>
                                <strong>Password:</strong> ${userAccount.password}
                            </div>
                        </div>
                        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
                            This is an automated notification from ${DB.getCollegeInfo().name || 'Narayani Science Higher Secondary School'}.
                        </div>
                    </div>
                `;
            } else {
                personalizedMsg = `<p>Error: Could not locate login credentials for this email address.</p>`;
            }
        } else {
            personalizedMsg = message.replace(/{name}/g, r.name);
        }
        
        return {
            id: 'MSG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            recipient: r.email,
            recipientName: r.name,
            subject: subject,
            message: personalizedMsg,
            status: 'pending',
            timestamp: new Date().toISOString(),
            retry_count: 0
        };
    });
    
    if (window.socket && window.socket.connected) {
        window.socket.emit('enqueue_emails', payload);
        showToast(`${payload.length} emails queued for delivery!`, 'success');
        document.getElementById('emailForm').reset();
    } else {
        showToast('System is disconnected from server. Cannot send emails.', 'error');
    }
    
    setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        status.classList.add('hidden');
    }, 1000);
};

window.resendEmail = (id) => {
    // Basic resend logic
    const history = DB.get('emailHistory') || [];
    const email = history.find(h => h.id === String(id) || h.id === id);
    if (!email) return showToast('Email record not found', 'error');
    
    // reset status and generate new ID
    const newEmail = {...email, status: 'pending', id: 'msg_' + Date.now(), timestamp: new Date().toISOString()};
    
    socket.emit('update_state', {
        key: 'emailHistory',
        data: [newEmail, ...history]
    });
    showToast('Email requeued for sending');
    navigate('admin_emailHistory');
};

window.clearEmailHistory = () => {
    if(confirm('Are you sure you want to permanently delete all email history and analytics? This cannot be undone.')) {
        DB.set('emailHistory', []);
        socket.emit('update_state', {
            key: 'emailHistory',
            data: []
        });
        showToast('All email history has been deleted.');
        navigate('admin_emailHistory');
    }
};

window.renderAdminEmailHistory = () => {
    window.currentAdminView = 'emailHistory';
    const history = DB.get('emailHistory') || [];
    
    const pendingCount = history.filter(h => h.status === 'pending').length;
    const sentCount = history.filter(h => h.status === 'sent' || h.status === 'opened').length;
    const failedCount = history.filter(h => h.status === 'failed').length;
    const openedCount = history.filter(h => h.status === 'opened').length;
    
    // Sort descending by timestamp
    const sortedHistory = [...history].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return `
    <div class="animate-fade-in">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                <i class="fas fa-history text-gray-600 mr-2"></i> Email History & Analytics
            </h2>
            <div class="space-x-3">
                <button onclick="clearEmailHistory()" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow">
                    <i class="fas fa-trash-alt mr-2"></i> Delete All History
                </button>
                <button onclick="navigate('admin_email')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                    <i class="fas fa-arrow-left mr-2"></i> Back to Compose
                </button>
            </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="glass-card p-4 rounded-xl text-center border-l-4 border-blue-500">
                <p class="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Total Queued</p>
                <p class="text-3xl font-bold text-blue-600">${pendingCount}</p>
            </div>
            <div class="glass-card p-4 rounded-xl text-center border-l-4 border-green-500">
                <p class="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Total Delivered</p>
                <p class="text-3xl font-bold text-green-600">${sentCount}</p>
            </div>
            <div class="glass-card p-4 rounded-xl text-center border-l-4 border-red-500">
                <p class="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Failed</p>
                <p class="text-3xl font-bold text-red-600">${failedCount}</p>
            </div>
            <div class="glass-card p-4 rounded-xl text-center border-l-4 border-purple-500">
                <p class="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Opened</p>
                <p class="text-3xl font-bold text-purple-600">${openedCount}</p>
            </div>
        </div>

        <div class="glass-card p-6 rounded-xl">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold rounded-tl-lg">Date / Time</th>
                            <th class="px-4 py-3 font-semibold">Recipient</th>
                            <th class="px-4 py-3 font-semibold">Subject</th>
                            <th class="px-4 py-3 font-semibold text-center">Status</th>
                            <th class="px-4 py-3 font-semibold text-right rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        ${sortedHistory.length ? sortedHistory.slice(0, 100).map(h => `
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <td class="px-4 py-3 font-medium text-xs whitespace-nowrap">
                                    ${new Date(h.timestamp).toLocaleString()}
                                </td>
                                <td class="px-4 py-3">
                                    ${h.recipientName} <br>
                                    <span class="text-xs text-gray-400">${h.recipient}</span>
                                </td>
                                <td class="px-4 py-3 font-medium truncate max-w-xs" title="${h.subject}">
                                    ${h.subject}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span class="px-2 py-1 rounded text-xs font-bold 
                                        ${h.status === 'pending' ? 'bg-blue-100 text-blue-700' : 
                                          h.status === 'sent' ? 'bg-green-100 text-green-700' :
                                          h.status === 'opened' ? 'bg-purple-100 text-purple-700' :
                                          'bg-red-100 text-red-700'}">
                                        ${h.status.toUpperCase()}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <button onclick="deleteEmailHistory('${h.id}')" class="text-red-500 hover:text-red-700 transition" title="Delete record">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('') : '<tr><td colspan="5" class="text-center py-8 text-gray-500">No emails in history.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `;
};

window.deleteEmailHistory = (id) => {
    if (confirm('Are you sure you want to delete this email history record?')) {
        let history = DB.get('emailHistory') || [];
        history = history.filter(h => String(h.id) !== String(id));
        DB.set('emailHistory', history);
        if (window.renderCurrentView) window.renderCurrentView();
        showToast('Email history record deleted', 'success');
    }
};

window.renderAdminEmailTemplates = () => {
    window.currentAdminView = 'emailTemplates';
    const templates = DB.get('emailTemplates') || [];

    return `
    <div class="animate-fade-in">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                <i class="fas fa-file-alt text-purple-600 mr-2"></i> Email Templates
            </h2>
            <div class="flex space-x-3">
                <button onclick="navigate('admin_email')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                    <i class="fas fa-arrow-left mr-2"></i> Back
                </button>
                <button onclick="document.getElementById('addTemplateModal').classList.remove('hidden')" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    <i class="fas fa-plus mr-2"></i> New Template
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${templates.map(t => `
                <div class="glass-card p-5 rounded-xl border border-gray-100 dark:border-gray-700 relative hover:shadow-lg transition">
                    <div class="absolute top-4 right-4 flex space-x-2">
                        <button onclick="deleteEmailTemplate('${t.id}')" class="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                    <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2 pr-10">${t.name}</h3>
                    <p class="text-sm font-medium text-gray-500 mb-4 line-clamp-1 border-b pb-2">Subject: ${t.subject}</p>
                    <div class="mt-3 bg-gray-50 dark:bg-gray-800 rounded h-32 overflow-hidden flex items-center justify-center relative shadow-inner">
                        ${t.body}
                    </div>
                </div>
            `).join('')}
            ${templates.length === 0 ? '<div class="col-span-full text-center py-10 text-gray-500 italic glass-card rounded-xl">No templates found. Click "New Template" to create one.</div>' : ''}
        </div>
        
        <!-- Add Template Modal -->
        <div id="addTemplateModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4 overflow-y-auto">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full shadow-2xl">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white border-b pb-2">Create New Template</h3>
                <form onsubmit="handleSaveEmailTemplate(event)">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Template Name</label>
                        <input type="text" id="tpl_name" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. Admission Confirmation">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Default Subject</label>
                        <input type="text" id="tpl_subject" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Welcome to Narayani Science College!">
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-1">Template Image (JPEG/PNG)</label>
                        <input type="file" id="tpl_image" accept="image/*" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="document.getElementById('addTemplateModal').classList.add('hidden')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Template</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
};

window.handleSaveEmailTemplate = (e) => {
    e.preventDefault();
    const name = document.getElementById('tpl_name').value.trim();
    const subject = document.getElementById('tpl_subject').value.trim();
    const fileInput = document.getElementById('tpl_image');
    
    if (fileInput.files.length === 0) return;
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const body = `<img src="${e.target.result}" style="max-width: 100%; height: auto; border-radius: 8px;">`;
        let templates = DB.get('emailTemplates') || [];
        templates.push({
            id: 'TPL_' + Date.now(),
            name,
            subject,
            body
        });
        
        DB.set('emailTemplates', templates);
        document.getElementById('addTemplateModal').classList.add('hidden');
        showToast('Template saved successfully', 'success');
        navigate('admin_emailTemplates');
    };
    reader.readAsDataURL(file);
};

window.deleteEmailTemplate = (id) => {
    if(confirm('Delete this template?')) {
        let templates = DB.get('emailTemplates') || [];
        templates = templates.filter(t => t.id !== id);
        DB.set('emailTemplates', templates);
        navigate('admin_emailTemplates');
    }
};
