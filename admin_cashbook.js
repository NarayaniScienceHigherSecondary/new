// Admin Cash Book Module

const CASHBOOK_HEADS = [
    "Admission Fee", "Tuition Fee", "Examination Fee", "Library Fee", "Sports Fee", 
    "Laboratory Fee", "Hostel Fee", "Transport Fee", "Certificate Fee", "Donations", 
    "Government Grants", "Staff Salary", "Office Expenses", "Library Purchases", 
    "Sports Equipment", "Laboratory Expenses", "Utility Bills", "Building Maintenance", 
    "Scholarships", "Refunds", "Miscellaneous"
];

const PAYMENT_MODES = ["Cash", "Bank", "UPI", "Cheque"];

function renderAdminCashbook() {
    window.currentAdminView = 'cashbook';
    const settings = DB.getCashBookSettings();
    const allTransactions = DB.getCashBookTransactions().sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate running balances for all
    let runningBalance = settings.openingBalance;
    const transactionsWithBalance = allTransactions.map(t => {
        if (t.type === 'Receipt') {
            runningBalance += t.amount;
        } else {
            runningBalance -= t.amount;
        }
        return { ...t, runningBalance };
    });
    
    // Compute dynamic heads
    const dynamicHeads = [...new Set([...CASHBOOK_HEADS, ...allTransactions.map(t => t.head).filter(Boolean)])];

    // Calculate current month's totals
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    
    const monthReceipts = allTransactions
        .filter(t => t.type === 'Receipt' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
        .reduce((sum, t) => sum + t.amount, 0);
        
    const monthPayments = allTransactions
        .filter(t => t.type === 'Payment' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
        .reduce((sum, t) => sum + t.amount, 0);
        
    const pendingResets = DB.getPendingResets();
    const isResettingCashbook = pendingResets.cashbook && pendingResets.cashbook > Date.now();

    let resetButtonHTML = '';
    if (isResettingCashbook) {
        resetButtonHTML = `
            <div class="flex items-center space-x-2 bg-red-100 border border-red-300 rounded-lg px-3 py-1">
                <span class="text-red-700 font-bold text-sm flex items-center">
                    <i class="fas fa-spinner fa-spin mr-2"></i> Reset in: 
                    <span id="cashbook_reset_timer" data-target="${pendingResets.cashbook}" class="ml-1 w-12 inline-block">--:--</span>
                </span>
                <button onclick="handleCancelResetCashbook()" class="text-xs bg-white text-gray-700 hover:bg-gray-200 px-2 py-1 rounded border shadow-sm font-semibold transition">Cancel</button>
            </div>
        `;
    } else {
        resetButtonHTML = `
            <button onclick="handleResetCashbook()" class="px-3 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition font-semibold border border-red-200" title="Reset All Data">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
    }

    setTimeout(() => {
        if (window.currentAdminView === 'cashbook') {
            if (document.getElementById('cb_filter_month')) filterCashbook();
            
            const timerEl = document.getElementById('cashbook_reset_timer');
            if (timerEl) {
                if (window.cashbookTimerInterval) clearInterval(window.cashbookTimerInterval);
                const target = parseInt(timerEl.getAttribute('data-target'));
                const updateTimer = () => {
                    if(!document.getElementById('cashbook_reset_timer')) {
                        clearInterval(window.cashbookTimerInterval);
                        return;
                    }
                    const diff = Math.floor((target - Date.now()) / 1000);
                    if (diff <= 0) {
                        timerEl.innerText = "00:00";
                        clearInterval(window.cashbookTimerInterval);
                    } else {
                        const m = Math.floor(diff / 60).toString().padStart(2, '0');
                        const s = (diff % 60).toString().padStart(2, '0');
                        timerEl.innerText = `${m}:${s}`;
                    }
                };
                updateTimer();
                window.cashbookTimerInterval = setInterval(updateTimer, 1000);
            }
        }
    }, 50);

    return `
    <div class="animate-fade-in">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white"><i class="fas fa-book-open mr-2 text-primary"></i>Cash Book</h2>
            <div class="flex space-x-2">
                ${resetButtonHTML}
                <button onclick="showCashbookSettingsModal()" class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition" title="Settings">
                    <i class="fas fa-cog"></i>
                </button>
                <button onclick="exportCashbookToExcel()" class="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition font-semibold border border-green-200 flex items-center">
                    <i class="fas fa-file-excel mr-2"></i> Export Excel
                </button>
                <button onclick="showAddTransactionModal()" class="px-4 py-2 bg-primary text-white rounded-lg shadow font-semibold flex items-center hover:bg-blue-800 transition">
                    <i class="fas fa-plus mr-2"></i> Add Transaction
                </button>
            </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="glass-card p-5 border-l-4 border-blue-500">
                <p class="text-sm text-gray-500 font-semibold mb-1">Current Balance</p>
                <h3 class="text-3xl font-bold text-blue-600">₹${runningBalance.toLocaleString()}</h3>
            </div>
            <div class="glass-card p-5 border-l-4 border-green-500">
                <p class="text-sm text-gray-500 font-semibold mb-1" id="metric_receipts_label">Total Receipts (This Month)</p>
                <h3 id="metric_monthReceipts" class="text-2xl font-bold text-green-600">₹${monthReceipts.toLocaleString()}</h3>
            </div>
            <div class="glass-card p-5 border-l-4 border-red-500">
                <p class="text-sm text-gray-500 font-semibold mb-1" id="metric_payments_label">Total Payments (This Month)</p>
                <h3 id="metric_monthPayments" class="text-2xl font-bold text-red-600">₹${monthPayments.toLocaleString()}</h3>
            </div>
        </div>

        <!-- Ledger Table -->
        <div class="glass-card p-6 overflow-hidden">
            <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-3 md:space-y-0">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">Transaction Ledger</h3>
                <!-- Filters -->
                <div class="flex flex-wrap space-x-2">
                    <select id="cb_filter_type" onchange="filterCashbook()" class="px-3 py-1 rounded border dark:bg-gray-700 dark:border-gray-600 text-sm">
                        <option value="All">All Types</option>
                        <option value="Receipt">Receipts</option>
                        <option value="Payment">Payments</option>
                    </select>
                    <select id="cb_filter_head" onchange="filterCashbook()" class="px-3 py-1 rounded border dark:bg-gray-700 dark:border-gray-600 text-sm max-w-[150px]">
                        <option value="All">All Heads</option>
                        ${dynamicHeads.map(h => `<option value="${h}">${h}</option>`).join('')}
                    </select>
                    <input type="month" id="cb_filter_month" onchange="filterCashbook()" class="px-3 py-1 rounded border dark:bg-gray-700 dark:border-gray-600 text-sm" value="${currentMonthString}">
                </div>
            </div>
            
            <div class="overflow-x-auto">
                <div class="overflow-x-auto w-full custom-scrollbar"><table class="w-full text-left text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap" id="cashbookTable">
                    <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold">Date</th>
                            <th class="px-4 py-3 font-semibold">Voucher No</th>
                            <th class="px-4 py-3 font-semibold">Type</th>
                            <th class="px-4 py-3 font-semibold">Head</th>
                            <th class="px-4 py-3 font-semibold">Description / Party</th>
                            <th class="px-4 py-3 font-semibold text-green-600">Receipt (₹)</th>
                            <th class="px-4 py-3 font-semibold text-red-500">Payment (₹)</th>
                            <th class="px-4 py-3 font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/10">Balance (₹)</th>
                            <th class="px-4 py-3 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr class="bg-gray-50 dark:bg-gray-800/30 font-medium" id="cb_opening_row">
                            <td class="px-4 py-3" colspan="7">Opening Balance <span id="cb_opening_label_suffix"></span></td>
                            <td class="px-4 py-3 text-blue-600 bg-blue-50 dark:bg-blue-900/10 font-bold" id="cb_opening_balance_val" data-base="${settings.openingBalance}">₹${settings.openingBalance.toLocaleString()}</td>
                            <td></td>
                        </tr>
                        ${transactionsWithBalance.length ? transactionsWithBalance.map(t => `
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cb-row" data-type="${t.type}" data-head="${t.head}" data-date="${t.date.substring(0, 7)}" data-amount="${t.amount}">
                                <td class="px-4 py-3">${new Date(t.date).toLocaleDateString()}</td>
                                <td class="px-4 py-3 font-medium">${t.voucherNo}</td>
                                <td class="px-4 py-3">
                                    <span class="px-2 py-1 rounded text-xs font-bold ${t.type === 'Receipt' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                        ${t.type}
                                    </span>
                                </td>
                                <td class="px-4 py-3">${t.head}</td>
                                <td class="px-4 py-3">
                                    <div class="truncate max-w-[200px]" title="${t.description}">${t.description}</div>
                                    ${t.partyDetails ? `<div class="text-xs text-gray-400 truncate max-w-[200px]" title="${t.partyDetails}">${t.partyDetails}</div>` : ''}
                                </td>
                                <td class="px-4 py-3 font-bold text-green-600">${t.type === 'Receipt' ? '₹' + t.amount.toLocaleString() : '-'}</td>
                                <td class="px-4 py-3 font-bold text-red-500">${t.type === 'Payment' ? '₹' + t.amount.toLocaleString() : '-'}</td>
                                <td class="px-4 py-3 font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/10">₹${t.runningBalance.toLocaleString()}</td>
                                <td class="px-4 py-3 text-center">
                                    <button onclick="printVoucher('${t.id}')" class="text-blue-500 hover:bg-blue-50 p-1 rounded transition" title="Print Voucher">
                                        <i class="fas fa-print"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr><td colspan="9" class="px-4 py-8 text-center text-gray-500">No transactions recorded yet.</td></tr>
                        `}
                    </tbody>
                </table></div>
            </div>
        </div>

        <!-- Add Transaction Modal -->
        <div id="cbAddModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">Add New Transaction</h3>
                    <button onclick="document.getElementById('cbAddModal').classList.add('hidden')" class="text-gray-500 hover:text-red-500">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form id="cbAddForm" onsubmit="handleSaveCashbookTransaction(event)">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Transaction Type</label>
                            <select id="cb_add_type" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold" onchange="updateCbAddFormUI()">
                                <option value="Receipt">Receipt (+)</option>
                                <option value="Payment">Payment (-)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Date</label>
                            <input type="date" id="cb_add_date" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-1">Accounting Head</label>
                            <select id="cb_add_head" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" onchange="document.getElementById('cb_add_custom_head').classList.toggle('hidden', this.value !== 'Other'); if(this.value==='Other') document.getElementById('cb_add_custom_head').focus();">
                                <option value="">Select Head...</option>
                                ${dynamicHeads.map(h => `<option value="${h}">${h}</option>`).join('')}
                                <option value="Other">Other (Type Custom)</option>
                            </select>
                            <input type="text" id="cb_add_custom_head" placeholder="Enter Custom Head" class="w-full px-3 py-2 mt-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white hidden">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Amount (₹)</label>
                            <input type="number" id="cb_add_amount" required min="1" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg font-bold">
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1">Description / Particulars</label>
                            <input type="text" id="cb_add_desc" required placeholder="Brief description of the transaction" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Payment Mode</label>
                            <select id="cb_add_mode" required class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                ${PAYMENT_MODES.map(m => `<option value="${m}">${m}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Reference / Cheque No (Optional)</label>
                            <input type="text" id="cb_add_ref" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                    </div>
                    
                    <p id="cb_add_error" class="text-red-500 text-sm font-bold mb-4 hidden"></p>

                    <div class="flex justify-end pt-4 border-t dark:border-gray-700">
                        <button type="button" onclick="document.getElementById('cbAddModal').classList.add('hidden')" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg mr-2 transition">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-800 transition">Save Transaction</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Settings Modal -->
        <div id="cbSettingsModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
                <div class="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">Cash Book Settings</h3>
                    <button onclick="document.getElementById('cbSettingsModal').classList.add('hidden')" class="text-gray-500 hover:text-red-500">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form onsubmit="handleSaveCashbookSettings(event)">
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-1">Opening Cash Balance (₹)</label>
                        <input type="number" id="cb_settings_opening" value="${settings.openingBalance}" required min="0" class="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold text-lg">
                        <p class="text-xs text-gray-500 mt-1">This forms the initial baseline for all running calculations.</p>
                    </div>
                    
                    <button type="submit" class="w-full px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-800 transition">Save Settings</button>
                </form>
            </div>
        </div>
    </div>
    `;
}

// Logic Functions

window.showCashbookSettingsModal = () => {
    document.getElementById('cbSettingsModal').classList.remove('hidden');
};

window.handleResetCashbook = () => {
    if (confirm("Are you sure you want to completely clear the entire Cash Book ledger? A 30-minute countdown will begin.")) {
        DB.requestReset('cashbook');
        showToast("Cash Book Reset Scheduled in 30 minutes.", true);
        navigate('admin_cashbook');
    }
};

window.handleCancelResetCashbook = () => {
    DB.cancelReset('cashbook');
    showToast("Cash Book Reset Cancelled.");
    if (window.cashbookTimerInterval) clearInterval(window.cashbookTimerInterval);
    navigate('admin_cashbook');
};

window.handleSaveCashbookSettings = (e) => {
    e.preventDefault();
    const opening = parseInt(document.getElementById('cb_settings_opening').value) || 0;
    DB.updateCashBookSettings({ openingBalance: opening });
    showToast("Opening Balance Updated Successfully");
    document.getElementById('cbSettingsModal').classList.add('hidden');
    navigate('admin_cashbook');
};

window.showAddTransactionModal = () => {
    document.getElementById('cbAddForm').reset();
    document.getElementById('cb_add_date').value = new Date().toISOString().split('T')[0];
    document.getElementById('cb_add_error').classList.add('hidden');
    updateCbAddFormUI();
    document.getElementById('cbAddModal').classList.remove('hidden');
};

window.updateCbAddFormUI = () => {
    const type = document.getElementById('cb_add_type').value;
    const typeSelect = document.getElementById('cb_add_type');
    if (type === 'Receipt') {
        typeSelect.className = "w-full px-3 py-2 rounded-lg border border-green-500 bg-green-50 text-green-700 font-bold dark:bg-green-900/30";
    } else {
        typeSelect.className = "w-full px-3 py-2 rounded-lg border border-red-500 bg-red-50 text-red-700 font-bold dark:bg-red-900/30";
    }
};

window.handleSaveCashbookTransaction = (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('cb_add_error');
    errorEl.classList.add('hidden');

    let head = document.getElementById('cb_add_head').value;
    if (head === 'Other') {
        head = document.getElementById('cb_add_custom_head').value.trim();
        if (!head) {
            errorEl.innerText = "Please enter a valid Custom Accounting Head.";
            errorEl.classList.remove('hidden');
            return;
        }
    }

    const type = document.getElementById('cb_add_type').value;
    const amount = parseFloat(document.getElementById('cb_add_amount').value);
    
    if (amount <= 0 || isNaN(amount)) {
        errorEl.innerText = "Amount must be a positive number.";
        errorEl.classList.remove('hidden');
        return;
    }

    // Check negative balance
    if (type === 'Payment') {
        const settings = DB.getCashBookSettings();
        const allT = DB.getCashBookTransactions().sort((a, b) => new Date(a.date) - new Date(b.date));
        let runningBalance = settings.openingBalance + allT.reduce((s, t) => t.type === 'Receipt' ? s + t.amount : s - t.amount, 0);
        
        if (runningBalance - amount < 0) {
            errorEl.textContent = `Error: Insufficient Funds. Current balance is ₹${runningBalance.toLocaleString()}, cannot process a payment of ₹${amount.toLocaleString()}.`;
            errorEl.classList.remove('hidden');
            return;
        }
    }

    const prefix = type === 'Receipt' ? 'CR' : 'CP';
    const voucherCounter = DB.getCashBookTransactions().filter(t => t.type === type).length + 1;
    
    const transaction = {
        id: 'CB_' + Date.now(),
        voucherNo: `${prefix}-${voucherCounter.toString().padStart(4, '0')}`,
        type: type,
        date: document.getElementById('cb_add_date').value,
        head: head,
        amount: amount,
        description: document.getElementById('cb_add_desc').value,
        partyDetails: '',
        paymentMode: document.getElementById('cb_add_mode').value,
        referenceNo: document.getElementById('cb_add_ref').value,
        enteredBy: 'Admin',
        approvedBy: 'Admin',
        timestamp: new Date().toISOString()
    };

    DB.addCashBookTransaction(transaction);
    showToast("Transaction Recorded Successfully");
    document.getElementById('cbAddModal').classList.add('hidden');
    navigate('admin_cashbook');
};

window.filterCashbook = () => {
    const typeF = document.getElementById('cb_filter_type').value;
    const headF = document.getElementById('cb_filter_head').value;
    const monthF = document.getElementById('cb_filter_month').value; // YYYY-MM
    
    let totalReceipts = 0;
    let totalPayments = 0;
    
    const baseOpening = parseFloat(document.getElementById('cb_opening_balance_val').getAttribute('data-base')) || 0;
    let actualOpeningBalance = baseOpening;
    
    const rows = document.querySelectorAll('.cb-row');
    rows.forEach(row => {
        const tType = row.getAttribute('data-type');
        const tHead = row.getAttribute('data-head');
        const tDate = row.getAttribute('data-date'); // YYYY-MM
        const tAmount = parseFloat(row.getAttribute('data-amount')) || 0;
        
        // Calculate dynamic opening balance for the filtered month
        if (monthF && tDate < monthF) {
            if (tType === 'Receipt') actualOpeningBalance += tAmount;
            if (tType === 'Payment') actualOpeningBalance -= tAmount;
        }
        
        let show = true;
        if (typeF !== 'All' && tType !== typeF) show = false;
        if (headF !== 'All' && tHead !== headF) show = false;
        if (monthF && tDate !== monthF) show = false;
        
        row.style.display = show ? '' : 'none';
        
        if (show) {
            if (tType === 'Receipt') totalReceipts += tAmount;
            if (tType === 'Payment') totalPayments += tAmount;
        }
    });
    
    // Update Opening Balance Row
    if (monthF) {
        const monthStr = new Date(monthF + '-01').toLocaleString('default', { month: 'short', year: 'numeric' });
        document.getElementById('cb_opening_label_suffix').innerText = '(as of ' + monthStr + ')';
    } else {
        document.getElementById('cb_opening_label_suffix').innerText = '';
    }
    document.getElementById('cb_opening_balance_val').innerText = '₹' + actualOpeningBalance.toLocaleString();
    
    // Hide Opening Balance row if type or head filters are applied (since it breaks the sequential logic visually)
    if (typeF !== 'All' || headF !== 'All') {
        document.getElementById('cb_opening_row').style.display = 'none';
    } else {
        document.getElementById('cb_opening_row').style.display = '';
    }
    
    // Update metric cards
    const monthStrCards = monthF ? new Date(monthF + '-01').toLocaleString('default', { month: 'short', year: 'numeric' }) : 'This Month';
    document.getElementById('metric_receipts_label').innerText = 'Total Receipts (' + monthStrCards + ')';
    document.getElementById('metric_payments_label').innerText = 'Total Payments (' + monthStrCards + ')';
    
    document.getElementById('metric_monthReceipts').innerText = '₹' + totalReceipts.toLocaleString();
    document.getElementById('metric_monthPayments').innerText = '₹' + totalPayments.toLocaleString();
};

window.exportCashbookToExcel = () => {
    const transactions = DB.getCashBookTransactions().sort((a, b) => new Date(a.date) - new Date(b.date));
    const settings = DB.getCashBookSettings();
    if (!transactions.length) {
        showToast("No transactions to export", true);
        return;
    }
    
    let runningBalance = settings.openingBalance;
    
    const headers = ['Date', 'Voucher No', 'Type', 'Head', 'Description', 'Party', 'Mode', 'Ref No', 'Receipt', 'Payment', 'Running Balance'];
    const rows = [];
    
    // Add opening balance row
    rows.push(['-', '-', '-', 'Opening Balance', '-', '-', '-', '-', '-', '-', runningBalance]);
    
    transactions.forEach(t => {
        if (t.type === 'Receipt') runningBalance += t.amount;
        else runningBalance -= t.amount;
        
        rows.push([
            new Date(t.date).toLocaleDateString(),
            t.voucherNo,
            t.type,
            t.head,
            `"${t.description.replace(/"/g, '""')}"`, // escape commas
            `"${(t.partyDetails || '').replace(/"/g, '""')}"`,
            t.paymentMode,
            t.referenceNo || '-',
            t.type === 'Receipt' ? t.amount : '-',
            t.type === 'Payment' ? t.amount : '-',
            runningBalance
        ]);
    });
    
    const csvContent = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "CashBook_Ledger_" + Date.now() + ".csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Cash Book Exported Successfully");
};

window.printVoucher = (id) => {
    const transactions = DB.getCashBookTransactions();
    const t = transactions.find(x => x.id === id);
    if(!t) return;
    
    const college = DB.getCollegeInfo();
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Voucher - ${t.voucherNo}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                .subtitle { font-size: 14px; color: #666; }
                .voucher-box { border: 1px solid #ccc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                .row { display: flex; justify-content: space-between; margin-bottom: 15px; }
                .label { font-weight: bold; width: 150px; }
                .value { flex-grow: 1; border-bottom: 1px dashed #ccc; padding-bottom: 5px; }
                .amount-box { font-size: 20px; font-weight: bold; text-align: center; border: 2px solid #333; padding: 10px; width: 200px; margin: 20px auto; }
                .signatures { display: flex; justify-content: space-between; margin-top: 80px; }
                .sig-line { border-top: 1px solid #333; width: 200px; text-align: center; padding-top: 10px; }
                .tag { display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; margin-bottom: 20px;}
                .tag.receipt { background: #d1fae5; color: #065f46; }
                .tag.payment { background: #fee2e2; color: #991b1b; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">${college.name || 'College Name'}</div>
                <div class="subtitle">Cash Book ${t.type} Voucher</div>
            </div>
            
            <div style="text-align: right;">
                <span class="tag ${t.type.toLowerCase()}">${t.type.toUpperCase()} VOUCHER</span>
            </div>
            
            <div class="voucher-box">
                <div class="row">
                    <span class="label">Voucher No:</span>
                    <span class="value font-bold">${t.voucherNo}</span>
                    <span class="label" style="margin-left: 20px;">Date:</span>
                    <span class="value">${new Date(t.date).toLocaleDateString()}</span>
                </div>
                <div class="row">
                    <span class="label">Accounting Head:</span>
                    <span class="value">${t.head}</span>
                </div>
                <div class="row">
                    <span class="label">${t.type === 'Receipt' ? 'Received From:' : 'Paid To:'}</span>
                    <span class="value">${t.partyDetails || '-'}</span>
                </div>
                <div class="row">
                    <span class="label">Particulars:</span>
                    <span class="value">${t.description}</span>
                </div>
                <div class="row">
                    <span class="label">Payment Mode:</span>
                    <span class="value">${t.paymentMode} ${t.referenceNo ? '(Ref: ' + t.referenceNo + ')' : ''}</span>
                </div>
            </div>
            
            <div class="amount-box">
                Amount: ₹${t.amount.toLocaleString()}
            </div>
            
            <div class="signatures">
                <div class="sig-line">Prepared By<br><small>(${t.enteredBy})</small></div>
                <div class="sig-line">Approved By<br><small>(${t.approvedBy})</small></div>
                <div class="sig-line">Receiver's Signature</div>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
};
