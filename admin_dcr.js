function renderAdminDcr() {
    window.currentAdminView = 'dcr';
    const settings = DB.getDcrSettings();
    const records = DB.getDcrRecords();
    
    const fixedTotal = settings.reduce((sum, fee) => sum + parseInt(fee.amount || 0), 0);

    // --- History Tab Calculations ---
    window.currentDcrDateFilter = window.currentDcrDateFilter !== undefined ? window.currentDcrDateFilter : (function(){
        const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    })();
    const dateFilter = window.currentDcrDateFilter;
    
    const getLocalDate = (ts) => {
        const d = new Date(ts);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    };
    
    const filteredRecords = dateFilter ? records.filter(r => getLocalDate(r.timestamp) === dateFilter) : records;
    const feeTotals = {};
    settings.forEach(fee => feeTotals[fee.id] = 0);
    let devFeeTotal = 0;
    let grandTotal = 0;

    filteredRecords.forEach(r => {
        grandTotal += r.totalAmount;
        devFeeTotal += r.breakdown.developmentFee || 0;
        settings.forEach(fee => {
            let amount = 0;
            if (r.breakdown.fees) {
                const found = r.breakdown.fees.find(f => f.id === fee.id || f.name === fee.name);
                if (found) amount = found.amount;
            } else {
                const oldMap = { "Admission Fee": "admissionFee", "Library Fee": "libraryFee", "Sports Fee": "sportsFee", "Examination Fee": "examFee", "NSS Fees": "nssFee", "Youth Red Cross (YRC) Fees": "yrcFee" };
                if (oldMap[fee.name] && r.breakdown[oldMap[fee.name]]) {
                    amount = r.breakdown[oldMap[fee.name]];
                }
            }
            feeTotals[fee.id] += amount;
        });
    });
    // --------------------------------

    const pendingResets = DB.getPendingResets();
    const isResettingDcr = pendingResets.dcr && pendingResets.dcr > Date.now();

    let dcrResetButtonHTML = '';
    if (isResettingDcr) {
        dcrResetButtonHTML = `
            <div class="flex items-center space-x-2 bg-red-100 border border-red-300 rounded-lg px-2 py-1">
                <span class="text-red-700 font-bold text-sm flex items-center">
                    <i class="fas fa-spinner fa-spin mr-2"></i> Reset in: 
                    <span id="dcr_reset_timer" data-target="${pendingResets.dcr}" class="ml-1 w-10 inline-block">--:--</span>
                </span>
                <button onclick="handleCancelResetDcr()" class="text-xs bg-white text-gray-700 hover:bg-gray-200 px-2 py-1 rounded border shadow-sm font-semibold transition">Cancel</button>
            </div>
        `;
    } else {
        dcrResetButtonHTML = `
            <button onclick="document.getElementById('dcr_reset_modal').classList.remove('hidden')" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition text-sm font-semibold border border-red-200">
                <i class="fas fa-trash-alt mr-1"></i> Reset Data
            </button>
        `;
    }

    setTimeout(() => {
        if (window.currentAdminView === 'dcr') {
            const timerEl = document.getElementById('dcr_reset_timer');
            if (timerEl) {
                if (window.dcrTimerInterval) clearInterval(window.dcrTimerInterval);
                const target = parseInt(timerEl.getAttribute('data-target'));
                const updateTimer = () => {
                    if(!document.getElementById('dcr_reset_timer')) {
                        clearInterval(window.dcrTimerInterval);
                        return;
                    }
                    const diff = Math.floor((target - Date.now()) / 1000);
                    if (diff <= 0) {
                        timerEl.innerText = "00:00";
                        clearInterval(window.dcrTimerInterval);
                    } else {
                        const m = Math.floor(diff / 60).toString().padStart(2, '0');
                        const s = (diff % 60).toString().padStart(2, '0');
                        timerEl.innerText = `${m}:${s}`;
                    }
                };
                updateTimer();
                window.dcrTimerInterval = setInterval(updateTimer, 1000);
            }
        }
    }, 50);

    return `
    <div class="animate-fade-in relative">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Daily Collection Register (DCR)</h2>
            <div class="flex space-x-2">
                <button onclick="switchDcrTab('entry')" class="dcr-tab-btn px-4 py-2 bg-primary text-white rounded-lg shadow font-semibold" data-tab="entry">New Collection</button>
                <button onclick="switchDcrTab('history')" class="dcr-tab-btn px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition" data-tab="history">Collection History</button>
                <button onclick="switchDcrTab('settings')" class="dcr-tab-btn px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition" data-tab="settings">
                    <i class="fas fa-cog"></i> Settings
                </button>
            </div>
        </div>

        <!-- Settings Tab -->
        <div id="dcr_tab_settings" class="dcr-tab hidden">
            <div class="glass-card p-6">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">DCR Fixed Fees Configuration</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">Set the standard fixed amounts for each fee head. Add or remove custom fee heads as needed. When a student pays a total fee, these fixed amounts will be deducted first, and the remainder will be allocated to the Development Fee.</p>
                
                <form onsubmit="handleSaveDcrSettings(event)" class="max-w-3xl">
                    <div id="dcr_dynamic_fees_container" class="space-y-4 mb-6">
                        ${settings.map((fee, idx) => `
                            <div class="flex items-end space-x-4 dcr-fee-row" data-id="${fee.id}">
                                <div class="flex-grow">
                                    <label class="block text-sm font-medium mb-1">Fee Name</label>
                                    <input type="text" value="${fee.name}" required class="dcr-fee-name w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. Admission Fee">
                                </div>
                                <div class="w-1/3">
                                    <label class="block text-sm font-medium mb-1">Amount (₹)</label>
                                    <input type="number" value="${fee.amount}" required min="0" class="dcr-fee-amount w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" oninput="updateDcrSettingsTotal()">
                                </div>
                                <button type="button" onclick="removeDcrFeeHead(this)" class="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition border border-red-200 mb-0.5" title="Remove Fee">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button type="button" onclick="addDcrFeeHead()" class="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-semibold mb-6 flex items-center">
                        <i class="fas fa-plus mr-2"></i> Add Custom Fee Head
                    </button>
                    
                    <div class="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-6 border border-blue-100 dark:border-blue-800 flex justify-between items-center">
                        <span class="font-bold text-blue-800 dark:text-blue-300">Total Fixed Deductions:</span>
                        <span class="text-xl font-bold text-blue-800 dark:text-blue-300">₹<span id="dcr_s_total">${fixedTotal}</span></span>
                    </div>

                    <button type="submit" class="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-800 transition">Save Configuration</button>
                </form>
            </div>
        </div>

        <!-- Entry Tab -->
        <div id="dcr_tab_entry" class="dcr-tab block">
            <div class="glass-card p-6">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">New Fee Collection</h3>
                
                <form onsubmit="handleDcrCollection(event)" class="max-w-3xl">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium mb-1">Year / Batch</label>
                            <select id="dcr_e_year" required onchange="dcrFetchStudentName()" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="+2 1st year">+2 1st year</option>
                                <option value="+2 2nd year">+2 2nd year</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Roll Number</label>
                            <input type="text" id="dcr_e_roll" required oninput="dcrFetchStudentName()" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter roll number">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Student Name</label>
                            <input type="text" id="dcr_e_name" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter full name">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1">Total Fee Collected (₹)</label>
                            <input type="number" id="dcr_e_total" required min="1" class="w-full px-4 py-3 text-lg font-bold rounded-lg border-2 border-primary dark:bg-gray-700 dark:border-primary dark:text-white" placeholder="e.g. 5000" oninput="calculateDcrPreview()">
                        </div>
                    </div>
                    
                    <div id="dcr_preview_container" class="hidden bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-5 mb-6">
                        <h4 class="font-bold mb-3 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Fee Allocation Preview</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                            ${settings.map(fee => `
                                <div><span class="text-gray-500 block truncate" title="${fee.name}">${fee.name}:</span> <span class="font-semibold text-green-600">₹${fee.amount}</span></div>
                            `).join('')}
                        </div>
                        
                        <div class="p-4 bg-primary/10 border border-primary/20 rounded-lg flex justify-between items-center mt-4">
                            <span class="font-bold text-gray-700 dark:text-gray-300">Remaining (Development Fee):</span>
                            <span id="dcr_preview_dev_fee" class="text-2xl font-bold text-primary">₹0</span>
                        </div>
                        <p id="dcr_error_msg" class="text-red-500 text-sm mt-2 hidden font-semibold"></p>
                    </div>

                    <button type="submit" id="dcr_submit_btn" class="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition">
                        <i class="fas fa-check-circle mr-2"></i> Save Collection
                    </button>
                </form>
            </div>
        </div>

        <!-- History Tab -->
        <div id="dcr_tab_history" class="dcr-tab hidden">
            <div class="glass-card p-6 overflow-hidden">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">Collection History</h3>
                    <div class="flex items-center space-x-3 flex-wrap gap-y-2">
                        <div class="flex items-center bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-1">
                            <i class="fas fa-filter text-gray-400 mr-2"></i>
                            <input type="date" id="dcr_date_filter" class="bg-transparent border-none focus:ring-0 text-sm dark:text-white" onchange="window.currentDcrDateFilter=this.value; window.renderCurrentView()" value="${window.currentDcrDateFilter || ''}">
                            <button onclick="window.currentDcrDateFilter=''; window.renderCurrentView()" class="ml-2 text-gray-500 hover:text-red-500 text-xs" title="Clear Filter"><i class="fas fa-times"></i></button>
                        </div>
                        <button onclick="exportDcrToExcel()" class="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition text-sm font-semibold border border-green-200">
                            <i class="fas fa-file-excel mr-1"></i> Export Excel
                        </button>
                        ${dcrResetButtonHTML}
                        <div class="font-bold text-primary bg-primary/10 px-4 py-2 rounded-lg">
                            Total Collected: ₹<span id="dcr_history_total">${grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    ${(() => {
                        return `
                        <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full text-left text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                                <tr>
                                    <th class="px-4 py-3 font-semibold">Date</th>
                                    <th class="px-4 py-3 font-semibold">Roll No</th>
                                    <th class="px-4 py-3 font-semibold">Student Name</th>
                                    <th class="px-4 py-3 font-semibold">Year</th>
                                    ${settings.map(fee => `<th class="px-4 py-3 font-semibold">${fee.name}</th>`).join('')}
                                    <th class="px-4 py-3 font-semibold text-primary bg-primary/5">Dev Fee</th>
                                    <th class="px-4 py-3 font-bold text-green-600">Total (₹)</th>
                                    <th class="px-4 py-3 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                ${filteredRecords.length ? filteredRecords.slice().sort((a, b) => {
                                    if (!a.isFormFillUp && b.isFormFillUp) return -1;
                                    if (a.isFormFillUp && !b.isFormFillUp) return 1;
                                    return parseInt(a.rollNo) - parseInt(b.rollNo);
                                }).map(r => {
                                    return `
                                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td class="px-4 py-3">${new Date(r.timestamp).toLocaleDateString()}</td>
                                        <td class="px-4 py-3 font-medium">${r.rollNo}</td>
                                        <td class="px-4 py-3">${r.name}</td>
                                        <td class="px-4 py-3">${r.year || 'N/A'}</td>
                                        ${r.isFormFillUp ? `
                                            <td colspan="${settings.length + 1}" class="px-4 py-3 text-center text-sm font-semibold text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 border-x dark:border-gray-700">
                                                Form Fill Up Fee: <span class="text-green-600 dark:text-green-400">₹${(r.totalAmount || 0).toLocaleString()}</span>
                                            </td>
                                        ` : `
                                            ${settings.map(fee => {
                                                let amount = 0;
                                                if (r.breakdown.fees) {
                                                    const found = r.breakdown.fees.find(f => f.id === fee.id || f.name === fee.name);
                                                    if (found) amount = found.amount;
                                                } else {
                                                    const oldMap = { "Admission Fee": "admissionFee", "Library Fee": "libraryFee", "Sports Fee": "sportsFee", "Examination Fee": "examFee", "NSS Fees": "nssFee", "Youth Red Cross (YRC) Fees": "yrcFee" };
                                                    if (oldMap[fee.name] && r.breakdown[oldMap[fee.name]]) {
                                                        amount = r.breakdown[oldMap[fee.name]];
                                                    }
                                                }
                                                return `<td class="px-4 py-3">₹${amount}</td>`;
                                            }).join('')}
                                            <td class="px-4 py-3 font-bold text-primary bg-primary/5">₹${r.breakdown.developmentFee || 0}</td>
                                        `}
                                        <td class="px-4 py-3 font-bold text-green-600 bg-green-50 dark:bg-green-900/10">₹${r.totalAmount.toLocaleString()}</td>
                                        <td class="px-4 py-3 text-center">
                                            <button onclick="showDcrBreakdown('${r.id}')" class="text-blue-500 hover:text-blue-700 text-xs font-semibold px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded transition border border-blue-200">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                    `;
                                }).join('') : `
                                    <tr>
                                        <td colspan="${settings.length + 5}" class="px-4 py-8 text-center text-gray-500">No collection records found for this date.</td>
                                    </tr>
                                `}
                            </tbody>
                            <tfoot class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold">
                                <tr>
                                    <td colspan="4" class="px-4 py-3 text-right">Grand Total:</td>
                                    ${settings.map(fee => `<td class="px-4 py-3 text-green-600">₹${feeTotals[fee.id].toLocaleString()}</td>`).join('')}
                                    <td class="px-4 py-3 text-primary">₹${devFeeTotal.toLocaleString()}</td>
                                    <td class="px-4 py-3 text-green-600">₹${grandTotal.toLocaleString()}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table></div>
                        `;
                    })()}
                </div>
            </div>
        </div>

        <!-- Breakdown Modal -->
        <div id="dcr_breakdown_modal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
                <div class="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">Fee Breakdown</h3>
                    <button onclick="document.getElementById('dcr_breakdown_modal').classList.add('hidden')" class="text-gray-500 hover:text-red-500">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div id="dcr_breakdown_content" class="space-y-2">
                    <!-- Injected via JS -->
                </div>
            </div>
        </div>

        <!-- Reset Warning Modal -->
        <div id="dcr_reset_modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-fade-in">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-2xl relative border-2 border-red-500/20">
                <div class="text-center mb-6 mt-4">
                    <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-3xl"></i>
                    </div>
                    <h3 class="text-2xl font-black text-gray-800 dark:text-white mb-2">Warning: Data Reset!</h3>
                    <p class="text-gray-600 dark:text-gray-300">You are about to completely erase all DCR Collection History from the database. This action is <strong>permanent</strong> and cannot be undone.</p>
                </div>
                <div class="bg-blue-50 dark:bg-gray-900/50 p-4 rounded-lg mb-6 border border-blue-100 dark:border-gray-700 text-center">
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-3 font-semibold">It is highly recommended to export all data before erasing.</p>
                    <button onclick="window.exportDcrToExcel(true)" class="w-full px-4 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-bold flex items-center justify-center">
                        <i class="fas fa-file-excel mr-2"></i> Export All Data to Excel (Day Wise)
                    </button>
                </div>
                <div class="flex justify-end space-x-3 border-t dark:border-gray-700 pt-4">
                    <button onclick="document.getElementById('dcr_reset_modal').classList.add('hidden')" class="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">Cancel</button>
                    <button onclick="handleResetDcrRecordsConfirm()" class="px-5 py-2 bg-red-600 text-white rounded-lg font-bold shadow hover:bg-red-700 transition flex items-center">
                        <i class="fas fa-trash-alt mr-2"></i> Yes, Erase Everything
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
}

window.switchDcrTab = (tabId) => {
    document.querySelectorAll('.dcr-tab').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.dcr-tab').forEach(t => t.classList.remove('block'));
    document.getElementById('dcr_tab_' + tabId).classList.remove('hidden');
    document.getElementById('dcr_tab_' + tabId).classList.add('block');
    
    document.querySelectorAll('.dcr-tab-btn').forEach(b => {
        b.className = "dcr-tab-btn px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition";
    });
    
    const activeBtn = document.querySelector(`.dcr-tab-btn[data-tab="${tabId}"]`);
    if(activeBtn) {
        activeBtn.className = "dcr-tab-btn px-4 py-2 bg-primary text-white rounded-lg shadow font-semibold";
    }
};

window.dcrFetchStudentName = () => {
    const rollOrId = document.getElementById('dcr_e_roll')?.value?.trim().toLowerCase();
    const yearSelect = document.getElementById('dcr_e_year');
    const year = yearSelect?.value;
    
    if (rollOrId) {
        // First try to find globally by ID
        let student = DB.getStudents().find(s => s._id && String(s._id).trim().toLowerCase() === rollOrId);
        
        if (student && student.year && yearSelect) {
            yearSelect.value = student.year;
        }
        
        // If not found by ID, try finding by Roll + Year
        if (!student && year) {
            student = DB.getStudents().find(s => {
                const matchesRoll = s.rollNo != null && String(s.rollNo).trim().toLowerCase() === rollOrId;
                const matchesYear = (s.year || '+2 1st year').trim() === year.trim();
                return matchesRoll && matchesYear;
            });
        }
        
        if (student) {
            document.getElementById('dcr_e_name').value = student.name;
        } else {
            // Optional: clear it if not found so they don't submit mismatched data
            document.getElementById('dcr_e_name').value = '';
        }
    }
};

window.addDcrFeeHead = () => {
    const container = document.getElementById('dcr_dynamic_fees_container');
    const newId = 'dcr_custom_' + Date.now();
    const div = document.createElement('div');
    div.className = "flex items-end space-x-4 dcr-fee-row";
    div.dataset.id = newId;
    div.innerHTML = `
        <div class="flex-grow">
            <label class="block text-sm font-medium mb-1">Fee Name</label>
            <input type="text" required class="dcr-fee-name w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. Hostel Fee">
        </div>
        <div class="w-1/3">
            <label class="block text-sm font-medium mb-1">Amount (₹)</label>
            <input type="number" value="0" required min="0" class="dcr-fee-amount w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" oninput="updateDcrSettingsTotal()">
        </div>
        <button type="button" onclick="removeDcrFeeHead(this)" class="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition border border-red-200 mb-0.5" title="Remove Fee">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    container.appendChild(div);
};

window.removeDcrFeeHead = (btn) => {
    btn.closest('.dcr-fee-row').remove();
    updateDcrSettingsTotal();
};

window.updateDcrSettingsTotal = () => {
    const amountInputs = document.querySelectorAll('.dcr-fee-amount');
    let total = 0;
    amountInputs.forEach(input => {
        total += parseInt(input.value) || 0;
    });
    const totalEl = document.getElementById('dcr_s_total');
    if(totalEl) totalEl.textContent = total;
};

window.handleSaveDcrSettings = (e) => {
    e.preventDefault();
    const rows = document.querySelectorAll('.dcr-fee-row');
    const newSettings = [];
    rows.forEach(row => {
        newSettings.push({
            id: row.dataset.id || ('dcr_' + Date.now() + Math.random()),
            name: row.querySelector('.dcr-fee-name').value,
            amount: parseInt(row.querySelector('.dcr-fee-amount').value) || 0
        });
    });
    
    DB.set('dcrSettings', newSettings);
    showToast("DCR Settings Updated Successfully");
    navigate('admin_dcr'); // refresh view
};

window.calculateDcrPreview = () => {
    const totalInput = document.getElementById('dcr_e_total').value;
    const container = document.getElementById('dcr_preview_container');
    const devFeeEl = document.getElementById('dcr_preview_dev_fee');
    const errorEl = document.getElementById('dcr_error_msg');
    const submitBtn = document.getElementById('dcr_submit_btn');
    
    if(!totalInput) {
        container.classList.add('hidden');
        submitBtn.disabled = true;
        return;
    }
    
    container.classList.remove('hidden');
    
    const totalAmount = parseInt(totalInput) || 0;
    const settings = DB.getDcrSettings();
    const fixedTotal = settings.reduce((sum, fee) => sum + parseInt(fee.amount || 0), 0);
                      
    const devFee = totalAmount - fixedTotal;
    
    if(devFee < 0) {
        errorEl.textContent = `Total amount must be at least ₹${fixedTotal} to cover fixed head charges.`;
        errorEl.classList.remove('hidden');
        devFeeEl.textContent = `₹0`;
        devFeeEl.className = "text-2xl font-bold text-red-500";
        submitBtn.disabled = true;
        submitBtn.classList.replace('bg-green-600', 'bg-gray-400');
    } else {
        errorEl.classList.add('hidden');
        devFeeEl.textContent = `₹${devFee}`;
        devFeeEl.className = "text-2xl font-bold text-primary";
        submitBtn.disabled = false;
        submitBtn.classList.replace('bg-gray-400', 'bg-green-600');
    }
};

window.handleDcrCollection = (e) => {
    e.preventDefault();
    
    const totalInput = parseInt(document.getElementById('dcr_e_total').value);
    const settings = DB.getDcrSettings();
    const fixedTotal = settings.reduce((sum, fee) => sum + parseInt(fee.amount || 0), 0);
    
    if (totalInput < fixedTotal) {
        showToast("Error: Amount too low to cover fixed fees.", true);
        return;
    }
    
    const record = {
        id: 'DCR_' + Date.now(),
        timestamp: new Date().toISOString(),
        name: document.getElementById('dcr_e_name').value,
        rollNo: document.getElementById('dcr_e_roll').value,
        year: document.getElementById('dcr_e_year').value,
        totalAmount: totalInput,
        breakdown: {
            fees: settings.map(f => ({...f})),
            developmentFee: totalInput - fixedTotal
        }
    };
    
    DB.addDcrRecord(record);
    showToast("Fee Collection Recorded Successfully!");
    navigate('admin_dcr'); // Refresh view
    
    // Switch to history tab after save
    setTimeout(() => { switchDcrTab('history'); }, 100);
};

window.showDcrBreakdown = (recordId) => {
    const record = DB.getDcrRecords().find(r => r.id === recordId);
    if(!record) return;
    
    const content = document.getElementById('dcr_breakdown_content');
    
    let breakdownHtml = '<div class="divide-y dark:divide-gray-700">';
    
    if(record.breakdown.fees) {
        record.breakdown.fees.forEach(fee => {
            breakdownHtml += `
                <div class="flex justify-between py-2">
                    <span class="text-gray-600 dark:text-gray-300">${fee.name}</span>
                    <span class="font-semibold">₹${fee.amount}</span>
                </div>
            `;
        });
    } else {
        // Fallback for older records
        const oldMap = {
            admissionFee: "Admission Fee", libraryFee: "Library Fee", sportsFee: "Sports Fee",
            examFee: "Examination Fee", nssFee: "NSS Fees", yrcFee: "YRC Fees"
        };
        for(const [key, label] of Object.entries(oldMap)) {
            if(record.breakdown[key] !== undefined) {
                breakdownHtml += `
                    <div class="flex justify-between py-2">
                        <span class="text-gray-600 dark:text-gray-300">${label}</span>
                        <span class="font-semibold">₹${record.breakdown[key]}</span>
                    </div>
                `;
            }
        }
    }
    
    breakdownHtml += `
        <div class="flex justify-between py-3 font-bold text-primary">
            <span>Development Fee</span>
            <span>₹${record.breakdown.developmentFee}</span>
        </div>
        <div class="flex justify-between py-2 font-bold text-lg bg-green-50 dark:bg-green-900/20 px-2 rounded mt-2">
            <span>Total Collected</span>
            <span class="text-green-600">₹${record.totalAmount}</span>
        </div>
    </div>`;
    
    content.innerHTML = breakdownHtml;
    document.getElementById('dcr_breakdown_modal').classList.remove('hidden');
};

window.handleResetDcrRecordsConfirm = () => {
    DB.requestReset('dcr');
    document.getElementById('dcr_reset_modal').classList.add('hidden');
    showToast("DCR Reset Scheduled in 30 minutes.", true);
    window.sendResetNotificationEmail('Daily Collection Register (DCR)');
    navigate('admin_dcr');
};

window.handleCancelResetDcr = () => {
    DB.cancelReset('dcr');
    showToast("DCR Reset Cancelled.");
    if (window.dcrTimerInterval) clearInterval(window.dcrTimerInterval);
    navigate('admin_dcr');
};

window.exportDcrToExcel = (exportAll = false) => {
    const records = DB.getDcrRecords();
    const settings = DB.getDcrSettings();
    if (!records.length) {
        showToast("No records to export", true);
        return;
    }
    
    // Create CSV content dynamically based on current settings
    const fixedHeaders = settings.map(fee => fee.name);
    const headers = ['Date', 'Roll No', 'Student Name', 'Year', ...fixedHeaders, 'Development Fee', 'Form Fill Up Fee', 'Total Amount (₹)'];
    
    // Apply current date filter if active
    const dateFilter = exportAll ? null : window.currentDcrDateFilter;
    const getLocalDate = (ts) => {
        const d = new Date(ts);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    };
    
    const filteredRecords = dateFilter ? records.filter(r => getLocalDate(r.timestamp) === dateFilter) : records;

    const sortedRecords = [...filteredRecords].sort((a, b) => {
        if (!a.isFormFillUp && b.isFormFillUp) return -1;
        if (a.isFormFillUp && !b.isFormFillUp) return 1;
        return parseInt(a.rollNo) - parseInt(b.rollNo);
    });
    const rows = sortedRecords.map(r => {
        const row = [
            new Date(r.timestamp).toLocaleDateString(),
            r.rollNo,
            `"${(r.name || '').replace(/"/g, '""')}"`,
            `"${(r.year || 'N/A').replace(/"/g, '""')}"`
        ];
        
        if (r.isFormFillUp) {
            settings.forEach(fee => { row.push(""); });
            row.push(""); // Dev Fee empty
            row.push(r.totalAmount); // Form Fill Up Fee
        } else {
            settings.forEach(fee => {
                let amount = 0;
                if (r.breakdown.fees) {
                    const found = r.breakdown.fees.find(f => f.id === fee.id || f.name === fee.name);
                    if (found) amount = found.amount;
                } else {
                    const oldMap = { "Admission Fee": "admissionFee", "Library Fee": "libraryFee", "Sports Fee": "sportsFee", "Examination Fee": "examFee", "NSS Fees": "nssFee", "Youth Red Cross (YRC) Fees": "yrcFee" };
                    if (oldMap[fee.name] && r.breakdown[oldMap[fee.name]]) {
                        amount = r.breakdown[oldMap[fee.name]];
                    }
                }
                row.push(amount);
            });
            row.push(r.breakdown.developmentFee || 0);
            row.push(""); // Form Fill Up Fee empty
        }
        
        row.push(r.totalAmount);
        return row;
    });
    const totalsRow = ["", "", `"Grand Total:"`, ""];
    let devFeeTotal = 0;
    let formFillUpTotal = 0;
    let overallTotal = 0;
    
    settings.forEach(fee => {
        let feeTotal = 0;
        filteredRecords.forEach(r => {
            if (!r.isFormFillUp) {
                if (r.breakdown.fees) {
                    const found = r.breakdown.fees.find(f => f.id === fee.id || f.name === fee.name);
                    if (found) feeTotal += found.amount;
                } else {
                    const oldMap = { "Admission Fee": "admissionFee", "Library Fee": "libraryFee", "Sports Fee": "sportsFee", "Examination Fee": "examFee", "NSS Fees": "nssFee", "Youth Red Cross (YRC) Fees": "yrcFee" };
                    if (oldMap[fee.name] && r.breakdown[oldMap[fee.name]]) {
                        feeTotal += r.breakdown[oldMap[fee.name]];
                    }
                }
            }
        });
        totalsRow.push(feeTotal);
    });

    filteredRecords.forEach(r => {
        if (!r.isFormFillUp) {
            devFeeTotal += r.breakdown.developmentFee || 0;
        } else {
            formFillUpTotal += r.totalAmount || 0;
        }
        overallTotal += r.totalAmount || 0;
    });

    totalsRow.push(devFeeTotal);
    totalsRow.push(formFillUpTotal);
    totalsRow.push(overallTotal);
    
    rows.push(totalsRow);
    
    let csvContent = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        
    // Trigger download using Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "DCR_Report_" + Date.now() + ".csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Excel Export Started");
};
