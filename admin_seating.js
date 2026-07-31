// admin_seating.js

function renderAdminSeating() {
    window.currentAdminView = 'seating';
    const staffList = DB.getStaff();
    const staffOptions = staffList.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    
    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Exam Seating Arrangement</h2>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white border-b pb-2">Generate New Arrangement</h3>
            <form id="seatingSetupForm" onsubmit="handleSeatingSetupSubmit(event)">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label class="block text-sm font-medium mb-1">Exam Type</label>
                        <select id="seat_examType" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                            <option value="">Select Exam Type</option>
                            <option value="Annual">Annual Exam</option>
                            <option value="Internal">Internal Exam</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Target Year / Batch</label>
                        <select id="seat_targetYear" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                            <option value="">Select Year</option>
                            <option value="+2 1st year">+2 1st year</option>
                            <option value="+2 2nd year">+2 2nd year</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Total Exam Halls</label>
                        <input type="number" id="seat_totalHalls" min="1" max="20" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" required placeholder="e.g. 2" oninput="generateHallInputs()">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Total Days of Exam</label>
                        <input type="number" id="seat_totalDays" min="1" max="30" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" required placeholder="e.g. 3" oninput="generateDayInputs()">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-sm font-medium mb-1">Centre Superintendent</label>
                        <select id="seat_superintendent" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" onchange="generateDayInputs()">
                            <option value="">Select Staff</option>
                            ${staffOptions}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Deputy Superintendent</label>
                        <select id="seat_deputySuperintendent" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" onchange="generateDayInputs()">
                            <option value="">Select Staff</option>
                            ${staffOptions}
                        </select>
                    </div>
                </div>



                <div id="hallsContainer" class="space-y-6 mb-6">
                    <!-- Dynamic Hall Inputs will appear here -->
                </div>
                
                <div id="daysContainer" class="space-y-6 mb-6">
                    <!-- Dynamic Day Inputs will appear here -->
                </div>

                <div id="seatingStyleContainer" class="hidden mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border dark:border-gray-600">
                    <div class="mt-2 flex justify-end">
                        <button type="submit" class="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow hover:bg-blue-800 transition">
                            <i class="fas fa-magic mr-2"></i> Generate Sitting Chart
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <div id="seatingResultsContainer" class="hidden">
            <div class="flex justify-between items-center mb-4 print-btn-container">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">Generated Arrangement</h3>
                <div class="flex space-x-2 flex-wrap justify-end gap-y-2">
                    <button onclick="printSeatingChart('teacher')" class="px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm">
                        <i class="fas fa-print mr-2"></i> Print Desk Chart
                    </button>
                    <button onclick="printSeatingChart('student')" class="px-3 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition text-sm">
                        <i class="fas fa-print mr-2"></i> Print Notice Board
                    </button>
                    <button onclick="printDutyChart()" class="px-3 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition text-sm">
                        <i class="fas fa-clipboard-list mr-2"></i> Print Duty Chart
                    </button>
                </div>
            </div>
            
            <div id="missingRollNumbersWarning" class="hidden mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg shadow">
                <p class="font-bold"><i class="fas fa-exclamation-triangle mr-2"></i>Warning: Students Missing Roll Numbers</p>
                <p class="text-sm mt-1" id="missingRollNumbersText"></p>
            </div>
            
            <div id="seatingDutyChart" class="space-y-8 mb-12 hidden">
                <!-- Duty Chart will render here -->
            </div>
            
            <div id="seatingCharts" class="space-y-8">
                <!-- Teacher Charts will render here -->
            </div>
            
            <div id="seatingChartsStudent" class="space-y-8 mt-12">
                <!-- Student Notice Board Charts will render here -->
            </div>
        </div>
    </div>
    `;
}

window.generateHallInputs = () => {
    const totalHalls = parseInt(document.getElementById('seat_totalHalls').value) || 0;
    const container = document.getElementById('hallsContainer');
    const styleContainer = document.getElementById('seatingStyleContainer');
    
    // Save existing data
    const existingHalls = [];
    const currentHallsNodes = document.querySelectorAll('[id^="hall_name_"]');
    for (let i = 1; i <= currentHallsNodes.length; i++) {
        existingHalls.push({
            name: document.getElementById(`hall_name_${i}`)?.value || `Room ${i}`,
            benches: document.getElementById(`hall_benches_${i}`)?.value || '',
            perBench: document.getElementById(`hall_studentsPerBench_${i}`)?.value || '',
            capacity: document.getElementById(`hall_capacity_${i}`)?.value || '0'
        });
    }
    
    container.innerHTML = '';

    if (totalHalls > 0) {
        styleContainer.classList.remove('hidden');
        
        for (let i = 1; i <= totalHalls; i++) {
            const hallData = existingHalls[i - 1] || { name: `Room ${i}`, benches: '', perBench: '', capacity: '0' };
            container.innerHTML += `
                <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 class="font-bold text-gray-700 dark:text-gray-300 mb-3">Room / Hall ${i}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label class="block text-xs font-medium mb-1">Room Name</label>
                            <input type="text" id="hall_name_${i}" required class="w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600" value="${hallData.name}">
                        </div>
                        <div>
                            <label class="block text-xs font-medium mb-1">Total Rows</label>
                            <input type="number" id="hall_benches_${i}" min="1" required class="w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. 20" value="${hallData.benches}" oninput="calculateHallCapacity(${i})">
                        </div>
                        <div>
                            <label class="block text-xs font-medium mb-1">Total Columns</label>
                            <input type="number" id="hall_studentsPerBench_${i}" min="1" required class="w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. 2" value="${hallData.perBench}" oninput="calculateHallCapacity(${i})">
                        </div>
                        <div>
                            <label class="block text-xs font-medium mb-1">Total Capacity</label>
                            <input type="number" id="hall_capacity_${i}" readonly class="w-full px-3 py-1.5 rounded border bg-gray-200 text-gray-700 dark:bg-gray-800 font-bold" value="${hallData.capacity}">
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Auto-refresh day inputs if halls change
        setTimeout(() => window.generateDayInputs(), 100);
    } else {
        styleContainer.classList.add('hidden');
    }
};

window.generateDayInputs = () => {
    const totalDays = parseInt(document.getElementById('seat_totalDays').value) || 0;
    const totalHalls = parseInt(document.getElementById('seat_totalHalls').value) || 0;
    const container = document.getElementById('daysContainer');
    const styleContainer = document.getElementById('seatingStyleContainer');
    
    // Save existing data
    const existingDays = [];
    const currentDaysNodes = document.querySelectorAll('[id^="day_date_"]');
    for (let i = 1; i <= currentDaysNodes.length; i++) {
        const dayStaff = {};
        for (let h = 1; h <= totalHalls; h++) {
            const cbs = document.querySelectorAll(`input[name="staff_check_d${i}_h${h}"]:checked`);
            if (cbs.length > 0) {
                dayStaff[h] = Array.from(cbs).map(c => c.value);
            }
        }
        
        existingDays.push({
            date: document.getElementById(`day_date_${i}`)?.value || '',
            subject: document.getElementById(`day_subject_${i}`)?.value || '',
            time: document.getElementById(`day_time_${i}`)?.value || '',
            style: document.getElementById(`day_style_${i}`)?.value || 'horizontal',
            staff: dayStaff
        });
    }

    container.innerHTML = '';
    
    const staffList = DB.getStaff();
    const superintendent = document.getElementById('seat_superintendent')?.value || '';
    const deputySuperintendent = document.getElementById('seat_deputySuperintendent')?.value || '';
    const availableStaffList = staffList.filter(s => s.name !== superintendent && s.name !== deputySuperintendent);
    
    if (totalDays > 0) {
        styleContainer.classList.remove('hidden');
        
        for (let i = 1; i <= totalDays; i++) {
            const dayData = existingDays[i - 1] || { date: '', subject: '', time: '', style: 'horizontal', staff: {} };
            let hallsHtml = '';
            for (let hIndex = 0; hIndex < totalHalls; hIndex++) {
                const hId = hIndex + 1;
                const shiftOffset = i; // Shift the starting staff by the day number
                const autoAssignedStaffName = availableStaffList.length > 0 ? availableStaffList[(hIndex + shiftOffset) % availableStaffList.length].name : null;
                
                const staffCheckboxesHtml = staffList.map((s) => {
                    // Check if there is saved manual data for this hall, otherwise use auto-assignment
                    const wasManuallySaved = existingDays[i - 1] !== undefined;
                    let isChecked = '';
                    if (wasManuallySaved) {
                        isChecked = (dayData.staff[hId] || []).includes(s.name) ? 'checked' : '';
                    } else {
                        isChecked = s.name === autoAssignedStaffName ? 'checked' : '';
                    }
                    
                    return `
                        <label class="flex items-center space-x-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <input type="checkbox" name="staff_check_d${i}_h${hId}" value="${s.name}" ${isChecked} onchange="validateStaffAssignment(this, ${i}, '${s.name}')" class="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700">
                            <span class="text-sm text-gray-700 dark:text-gray-300">${s.name}</span>
                        </label>
                    `;
                }).join('');

                hallsHtml += `
                <div>
                    <label class="block text-xs font-medium mb-1 text-gray-500">Hall ${hId}</label>
                    <div class="w-full px-2 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600 h-24 overflow-y-auto bg-white dark:bg-gray-800">
                        ${staffCheckboxesHtml}
                    </div>
                </div>
                `;
            }

            container.innerHTML += `
                <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 class="font-bold text-gray-700 dark:text-gray-300 mb-3 text-lg border-b pb-2">Exam Day ${i}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-xs font-medium mb-1">Date</label>
                            <input type="date" id="day_date_${i}" required class="w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600" value="${dayData.date}">
                        </div>
                        <div class="flex flex-col">
                            <label class="block text-xs font-medium mb-1">Subject</label>
                            <select id="day_subject_${i}" required class="w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600 mb-2" onchange="document.getElementById('day_subject_custom_${i}').classList.toggle('hidden', this.value !== 'Custom'); if(this.value === 'Custom') document.getElementById('day_subject_custom_${i}').focus();">
                                <option value="">Select Subject</option>
                                <optgroup label="Compulsory Subjects">
                                    <option value="MIL ODIA" ${dayData.subject === 'MIL ODIA' ? 'selected' : ''}>MIL ODIA</option>
                                    <option value="ENGLISH" ${dayData.subject === 'ENGLISH' ? 'selected' : ''}>ENGLISH</option>
                                    <option value="POLITICAL SCIENCE" ${dayData.subject === 'POLITICAL SCIENCE' ? 'selected' : ''}>POLITICAL SCIENCE</option>
                                    <option value="HISTORY" ${dayData.subject === 'HISTORY' ? 'selected' : ''}>HISTORY</option>
                                </optgroup>
                                <optgroup label="Optional Subjects">
                                    <option value="Odia Optional" ${dayData.subject === 'Odia Optional' ? 'selected' : ''}>Odia Optional</option>
                                    <option value="Education" ${dayData.subject === 'Education' ? 'selected' : ''}>Education</option>
                                    <option value="Economics" ${dayData.subject === 'Economics' ? 'selected' : ''}>Economics</option>
                                </optgroup>
                                <option value="Custom" ${!['', 'MIL ODIA', 'ENGLISH', 'POLITICAL SCIENCE', 'HISTORY', 'Odia Optional', 'Education', 'Economics'].includes(dayData.subject) && dayData.subject ? 'selected' : ''}>Custom (Type Below)</option>
                            </select>
                            <input type="text" id="day_subject_custom_${i}" class="${!['', 'MIL ODIA', 'ENGLISH', 'POLITICAL SCIENCE', 'HISTORY', 'Odia Optional', 'Education', 'Economics'].includes(dayData.subject) && dayData.subject ? '' : 'hidden'} w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Type custom subject" value="${!['', 'MIL ODIA', 'ENGLISH', 'POLITICAL SCIENCE', 'HISTORY', 'Odia Optional', 'Education', 'Economics'].includes(dayData.subject) && dayData.subject ? dayData.subject : ''}">
                        </div>
                        <div>
                            <label class="block text-xs font-medium mb-1">Time</label>
                            <input type="text" id="day_time_${i}" required class="w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. 10AM - 1PM" value="${dayData.time}">
                        </div>
                        <div>
                            <label class="block text-xs font-medium mb-1">Seating Pattern</label>
                            <select id="day_style_${i}" required class="w-full px-3 py-1.5 rounded border dark:bg-gray-700 dark:border-gray-600">
                                <option value="horizontal" ${dayData.style === 'horizontal' ? 'selected' : ''}>Horizontal (Row by Row)</option>
                                <option value="vertical" ${dayData.style === 'vertical' ? 'selected' : ''}>Vertical (Column by Column)</option>
                                <option value="zigzag" ${dayData.style === 'zigzag' ? 'selected' : ''}>Zigzag Pattern</option>
                                <option value="backtofront" ${dayData.style === 'backtofront' ? 'selected' : ''}>Back-to-Front Pattern</option>
                                <option value="edgetocenter" ${dayData.style === 'edgetocenter' ? 'selected' : ''}>Edge-to-Center Pattern</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-4 border-t dark:border-gray-700">
                        <h5 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Assign Staff (Per Hall)</h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${hallsHtml}
                        </div>
                    </div>
                </div>
            `;
        }
        
    } else {
        styleContainer.classList.add('hidden');
    }
};

window.validateStaffAssignment = (checkbox, day, staffName) => {
    if (!checkbox.checked) return;
    
    const allCheckboxesForDay = document.querySelectorAll(`input[name^="staff_check_d${day}_h"]`);
    let assignedCount = 0;
    
    allCheckboxesForDay.forEach(cb => {
        if (cb.value === staffName && cb.checked) {
            assignedCount++;
        }
    });
    
    if (assignedCount > 1) {
        showToast(`Warning: ${staffName} is already assigned to another hall on Exam Day ${day}!`, true);
        checkbox.checked = false;
    }
};

window.calculateHallCapacity = (index) => {
    const benches = parseInt(document.getElementById(`hall_benches_${index}`).value) || 0;
    const perBench = parseInt(document.getElementById(`hall_studentsPerBench_${index}`).value) || 0;
    document.getElementById(`hall_capacity_${index}`).value = benches * perBench;
};

let currentSeatingData = null;

window.handleSeatingSetupSubmit = (e) => {
    e.preventDefault();
    
    const examType = document.getElementById('seat_examType').value;
    const targetYear = document.getElementById('seat_targetYear').value;
    const totalHalls = parseInt(document.getElementById('seat_totalHalls').value);
    const totalDays = parseInt(document.getElementById('seat_totalDays').value);
    
    const halls = [];
    let totalGlobalCapacity = 0;
    
    for (let i = 1; i <= totalHalls; i++) {
        const name = document.getElementById(`hall_name_${i}`).value;
        const benches = parseInt(document.getElementById(`hall_benches_${i}`).value);
        const perBench = parseInt(document.getElementById(`hall_studentsPerBench_${i}`).value);
        const capacity = benches * perBench;
        
        totalGlobalCapacity += capacity;
        halls.push({ id: i, name, benches, perBench, capacity });
    }
    
    const allStudents = DB.getStudents().filter(s => s.year === targetYear);

    
    const validStudents = [];
    const missingRollStudents = [];
    
    allStudents.forEach(s => {
        const rollToUse = targetYear === '+2 2nd year' ? s.councilRollNo : s.rollNo;
        if (rollToUse && String(rollToUse).trim() !== '') {
            validStudents.push({ ...s, sortRoll: String(rollToUse) });
        } else {
            missingRollStudents.push(s);
        }
    });
    
    validStudents.sort((a, b) => {
        return a.sortRoll.localeCompare(b.sortRoll, undefined, { numeric: true, sensitivity: 'base' });
    });
    
    if (missingRollStudents.length > 0) {
        const missingWarning = document.getElementById('missingRollNumbersWarning');
        const missingText = document.getElementById('missingRollNumbersText');
        if (missingWarning) missingWarning.classList.remove('hidden');
        if (missingText) missingText.textContent = `${missingRollStudents.length} student(s) skipped due to missing Roll Numbers: ${missingRollStudents.map(s => s.name).join(', ')}`;
    } else {
        const missingWarning = document.getElementById('missingRollNumbersWarning');
        if (missingWarning) missingWarning.classList.add('hidden');
    }
    
    const examDays = [];
    const multiDayData = [];
    
    for (let day = 1; day <= totalDays; day++) {
        const date = document.getElementById(`day_date_${day}`).value;
        let subject = document.getElementById(`day_subject_${day}`).value.trim();
        if (subject === 'Custom') {
            subject = document.getElementById(`day_subject_custom_${day}`).value.trim();
        }
        const time = document.getElementById(`day_time_${day}`).value;
        const style = document.getElementById(`day_style_${day}`).value;
        
        const lowerSubject = subject.toLowerCase();
        const optionalSubjectsList = ["odia optional", "education", "economics"];
        let currentDayStudents = [...validStudents];
        
        if (optionalSubjectsList.includes(lowerSubject)) {
            currentDayStudents = validStudents.filter(s => 
                (s.optionalSubject1 && s.optionalSubject1.toLowerCase() === lowerSubject) ||
                (s.optionalSubject2 && s.optionalSubject2.toLowerCase() === lowerSubject)
            );
        }
        
        if (totalGlobalCapacity < currentDayStudents.length) {
            showToast(`Error on Day ${day}: Capacity (${totalGlobalCapacity}) is less than Students (${currentDayStudents.length}) for subject ${subject}`, true);
            return;
        }
        
        const dayStaff = {};
        for (let h = 1; h <= totalHalls; h++) {
            const staffCheckboxes = document.querySelectorAll(`input[name="staff_check_d${day}_h${h}"]:checked`);
            const selectedStaff = Array.from(staffCheckboxes).map(cb => cb.value);
            dayStaff[h] = selectedStaff.length > 0 ? selectedStaff.join(', ') : "Not Assigned";
        }
        
        examDays.push({ date, subject, time, staff: dayStaff });
        
        if (day > 1 && halls.length > 0 && !optionalSubjectsList.includes(lowerSubject)) {
            const shiftAmount = halls[0].capacity;
            const shiftedPart = currentDayStudents.splice(0, shiftAmount);
            currentDayStudents = currentDayStudents.concat(shiftedPart);
        }
        
        multiDayData.push({ dayNumber: day, date, subject, style, layout: generateLayout(currentDayStudents, halls, style) });
    }
    
    const superintendent = document.getElementById('seat_superintendent')?.value || '';
    const deputySuperintendent = document.getElementById('seat_deputySuperintendent')?.value || '';
    
    currentSeatingData = { examType, targetYear, halls, days: multiDayData, superintendent, deputySuperintendent };
    
    generateDutyChart(examType, targetYear, examDays, halls, superintendent, deputySuperintendent);
    renderSeatingChartUI();
};

function generateLayout(students, halls, style) {
    let studentIndex = 0;
    const layout = []; // Array of rooms
    
    for (let h = 0; h < halls.length; h++) {
        const hall = halls[h];
        const roomLayout = []; // Array of benches
        
        for (let b = 0; b < hall.benches; b++) {
            roomLayout.push(new Array(hall.perBench).fill(null));
        }
        
        if (style === 'horizontal') {
            // Fill bench by bench
            for (let b = 0; b < hall.benches; b++) {
                for (let s = 0; s < hall.perBench; s++) {
                    if (studentIndex < students.length) {
                        roomLayout[b][s] = students[studentIndex++];
                    }
                }
            }
        } else if (style === 'vertical') {
            // Fill column by column (1st seat of every bench, then 2nd seat of every bench)
            for (let col = 0; col < hall.perBench; col++) {
                for (let bench = 0; bench < hall.benches; bench++) {
                    if (studentIndex < students.length) {
                        roomLayout[bench][col] = students[studentIndex++];
                    }
                }
            }
        } else if (style === 'zigzag') {
            // Zigzag Pattern: Fill bench by bench, but alternate directions
            for (let b = 0; b < hall.benches; b++) {
                if (b % 2 === 0) {
                    // Even row (0, 2, 4): Left to Right
                    for (let s = 0; s < hall.perBench; s++) {
                        if (studentIndex < students.length) {
                            roomLayout[b][s] = students[studentIndex++];
                        }
                    }
                } else {
                    // Odd row (1, 3, 5): Right to Left
                    for (let s = hall.perBench - 1; s >= 0; s--) {
                        if (studentIndex < students.length) {
                            roomLayout[b][s] = students[studentIndex++];
                        }
                    }
                }
            }
        } else if (style === 'backtofront') {
            // Back-to-Front Pattern: Fill from the last bench to the first bench
            for (let b = hall.benches - 1; b >= 0; b--) {
                for (let s = 0; s < hall.perBench; s++) {
                    if (studentIndex < students.length) {
                        roomLayout[b][s] = students[studentIndex++];
                    }
                }
            }
        } else if (style === 'edgetocenter') {
            // Edge-to-Center Pattern: Outer benches first, then towards the center
            let rowIndices = [];
            let front = 0;
            let back = hall.benches - 1;
            while (front <= back) {
                rowIndices.push(front);
                if (front !== back) {
                    rowIndices.push(back);
                }
                front++;
                back--;
            }
            
            for (let i = 0; i < rowIndices.length; i++) {
                let b = rowIndices[i];
                for (let s = 0; s < hall.perBench; s++) {
                    if (studentIndex < students.length) {
                        roomLayout[b][s] = students[studentIndex++];
                    }
                }
            }
        }
        
        layout.push({
            hallName: hall.name,
            benches: roomLayout
        });
        
        if (studentIndex >= students.length) break;
    }
    
    return layout;
}

function renderSeatingChartUI() {
    const container = document.getElementById('seatingCharts');
    const studentContainer = document.getElementById('seatingChartsStudent');
    const resultsWrapper = document.getElementById('seatingResultsContainer');
    
    if (!currentSeatingData) return;
    
    let html = '';
    let studentHtml = '';
    
    currentSeatingData.days.forEach(dayInfo => {
        dayInfo.layout.forEach(room => {
            html += `
                <div class="seating-print-page bg-white p-8 rounded-xl shadow border dark:border-gray-700 text-black mb-8 overflow-x-auto custom-scrollbar">
                    <div class="text-center mb-6 border-b-2 border-gray-800 pb-4">
                        <h2 class="text-3xl font-bold uppercase text-black">${currentSeatingData.examType} Exam - Day ${dayInfo.dayNumber}</h2>
                        <h3 class="text-xl font-bold mt-1 text-black">Subject: ${dayInfo.subject} | Date: ${dayInfo.date ? new Date(dayInfo.date).toLocaleDateString() : 'N/A'}</h3>
                        <p class="text-lg font-semibold mt-2 text-black">Target Batch: ${currentSeatingData.targetYear} | Room: ${room.hallName}</p>
                        <div class="flex justify-center space-x-8 mt-2 text-sm font-bold text-gray-700">
                            <span>Centre Supdt: ${currentSeatingData.superintendent || 'N/A'}</span>
                            <span>Deputy Supdt: ${currentSeatingData.deputySuperintendent || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div class="w-full flex justify-center mb-6 min-w-[600px]">
                        <div class="px-16 py-2 bg-gray-200 border-2 border-gray-400 font-bold tracking-widest uppercase text-black">Teachers Desk / Board</div>
                    </div>
                    
                    <div class="grid gap-6 justify-center min-w-[600px]" style="grid-template-columns: repeat(${room.benches.length > 0 && room.benches[0].length > 5 ? Math.min(room.benches[0].length, 8) : (room.benches.length > 0 ? room.benches[0].length : 1)}, minmax(0, 1fr));">
            `;
            
            const totalCols = room.benches.length > 0 ? room.benches[0].length : 0;
            // Render by columns (A, B, C, etc.)
            for (let colIndex = 0; colIndex < totalCols; colIndex++) {
                const colLetter = String.fromCharCode(65 + colIndex); // 65 is 'A'
                
                html += `
                    <div class="border-2 border-gray-800 rounded p-2 bg-white flex flex-col items-center shadow-sm min-w-[120px]">
                        <div class="text-sm font-bold text-gray-800 mb-2 border-b-2 border-gray-400 w-full text-center pb-1 bg-gray-100">Column ${colLetter}</div>
                        <div class="flex flex-col gap-2 w-full items-center">
                `;
                
                for (let benchIndex = 0; benchIndex < room.benches.length; benchIndex++) {
                    const student = room.benches[benchIndex][colIndex];
                    const rollToPrint = student ? (currentSeatingData.targetYear === '+2 2nd year' ? student.councilRollNo : student.rollNo) : null;
                    
                    if (student) {
                        html += `
                            <div class="text-center border-2 border-gray-300 p-2 bg-blue-50 w-full rounded shadow-sm">
                                <div class="font-bold text-lg text-black">${rollToPrint || 'N/A'}</div>
                                <div class="text-[11px] text-gray-700 truncate w-full mt-1 font-medium" title="${student.name}">${student.name.split(' ')[0]}</div>
                            </div>
                        `;
                    } else {
                        html += `
                            <div class="text-center border-2 border-dashed border-gray-300 p-2 bg-gray-50 w-full rounded text-gray-400">
                                <div class="font-bold text-lg text-gray-400">---</div>
                                <div class="text-[11px]">Empty</div>
                            </div>
                        `;
                    }
                }
                
                html += `
                        </div>
                    </div>
                `;
            }
            
            html += `
                    </div>
                </div>
            `;
            
            // --- STUDENT NOTICE BOARD CHART ---
            studentHtml += `
                <div class="seating-print-page bg-white p-8 rounded-xl shadow border dark:border-gray-700 text-black mb-8 overflow-x-auto custom-scrollbar">
                    <div class="text-center mb-6 border-b-2 border-gray-800 pb-4">
                        <h2 class="text-3xl font-bold uppercase text-black">Notice Board - ${currentSeatingData.examType} - Day ${dayInfo.dayNumber}</h2>
                        <h3 class="text-xl font-bold mt-1 text-black">Subject: ${dayInfo.subject} | Date: ${dayInfo.date ? new Date(dayInfo.date).toLocaleDateString() : 'N/A'}</h3>
                        <p class="text-lg font-semibold mt-2 text-black">Target Batch: ${currentSeatingData.targetYear} | Room: ${room.hallName}</p>
                    </div>
                    
                    <div class="grid gap-6 justify-center min-w-[600px]" style="grid-template-columns: repeat(${totalCols > 5 ? Math.min(totalCols, 8) : totalCols}, minmax(0, 1fr));">
            `;
            
            // Render the student notice board as a visual column grid showing ONLY Roll Numbers
            for (let colIndex = 0; colIndex < totalCols; colIndex++) {
                const colLetter = String.fromCharCode(65 + colIndex);
                
                studentHtml += `
                    <div class="border-2 border-gray-800 rounded p-2 bg-white flex flex-col items-center shadow-sm min-w-[120px]">
                        <div class="text-sm font-bold text-gray-800 mb-2 border-b-2 border-gray-400 w-full text-center pb-1 bg-gray-100">Column ${colLetter}</div>
                        <div class="flex flex-col gap-2 w-full items-center">
                `;
                
                for (let benchIndex = 0; benchIndex < room.benches.length; benchIndex++) {
                    const student = room.benches[benchIndex][colIndex];
                    const rollToPrint = student ? (currentSeatingData.targetYear === '+2 2nd year' ? student.councilRollNo : student.rollNo) : null;
                    
                    if (student) {
                        studentHtml += `
                            <div class="text-center border-2 border-gray-400 p-2 bg-blue-50 w-full rounded shadow-sm min-h-[40px] flex items-center justify-center">
                                <div class="font-bold text-xl text-black">${rollToPrint || 'N/A'}</div>
                            </div>
                        `;
                    } else {
                        studentHtml += `
                            <div class="text-center border-2 border-dashed border-gray-300 p-2 bg-gray-50 w-full rounded min-h-[40px] flex items-center justify-center">
                                <div class="font-bold text-lg text-gray-400">---</div>
                            </div>
                        `;
                    }
                }
                
                studentHtml += `
                        </div>
                    </div>
                `;
            }
            
            studentHtml += `
                    </div>
                </div>
            `;
        });
    });
    
    container.innerHTML = html;
    studentContainer.innerHTML = studentHtml;
    resultsWrapper.classList.remove('hidden');
}

window.printSeatingChart = (mode = 'teacher') => {
    // We add a global class to body based on print mode
    document.body.classList.add('printing-mode', mode === 'teacher' ? 'print-teacher' : 'print-student');

    // Create persistent style if not exists
    if (!document.getElementById('seating-print-style')) {
        const style = document.createElement('style');
        style.id = 'seating-print-style';
        style.innerHTML = `
            @media print {
                @page { size: landscape; margin: 10mm; }
                body.printing-mode { background: white !important; color: black !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 0 !important; margin: 0 !important; }
                
                /* Hide everything by default in print mode */
                body.printing-mode * { visibility: hidden; }
                
                /* Show the print area based on mode */
                body.print-teacher #seatingCharts, body.print-teacher #seatingCharts * { visibility: visible; }
                body.print-student #seatingChartsStudent, body.print-student #seatingChartsStudent * { visibility: visible; }
                
                body.print-teacher #seatingCharts { position: absolute; left: 0; top: 0; width: 100%; }
                body.print-student #seatingChartsStudent { position: absolute; left: 0; top: 0; width: 100%; }
                
                .seating-print-page { box-shadow: none !important; border: none !important; page-break-after: always; padding: 0 !important; margin-bottom: 0 !important; }
                .seating-print-page:last-child { page-break-after: auto; }
                
                /* Hide UI elements inside charts that we don't want printed if any */
                .print-btn-container { display: none !important; }
            }
        `;
        document.head.appendChild(style);
    }
    
    window.print();
    
    // Clean up classes after print dialog (or immediately, which works in modern browsers for CSS visibility based printing)
    setTimeout(() => {
        document.body.classList.remove('printing-mode', 'print-teacher', 'print-student', 'print-duty-chart');
    }, 1000);
};

window.printDutyChart = () => {
    document.body.classList.add('printing-mode', 'print-duty-chart');
    
    if (!document.getElementById('duty-chart-print-style')) {
        const style = document.createElement('style');
        style.id = 'duty-chart-print-style';
        style.innerHTML = `
            @media print {
                @page { size: portrait; margin: 15mm; }
                body.printing-mode { background: white !important; color: black !important; }
                body.printing-mode * { visibility: hidden; }
                
                body.print-duty-chart #seatingDutyChart, body.print-duty-chart #seatingDutyChart * { visibility: visible; }
                body.print-duty-chart #seatingDutyChart { position: absolute; left: 0; top: 0; width: 100%; }
                
                .print-btn-container { display: none !important; }
            }
        `;
        document.head.appendChild(style);
    }
    
    window.print();
    
    setTimeout(() => {
        document.body.classList.remove('printing-mode', 'print-duty-chart');
    }, 1000);
};

function generateDutyChart(examType, targetYear, examDays, halls, superintendent, deputySuperintendent) {
    const container = document.getElementById('seatingDutyChart');
    if (!container) return;
    
    let html = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold uppercase border-b pb-2">Exam Duty Chart</h2>
            <h3 class="text-lg mt-2">${examType} Exam - ${targetYear}</h3>
        </div>
        <div class="flex justify-between items-center mb-6 px-4 bg-gray-50 dark:bg-gray-800 p-3 border rounded text-black dark:text-white">
            <div><span class="font-bold">Centre Superintendent:</span> ${superintendent || 'N/A'}</div>
            <div><span class="font-bold">Deputy Superintendent:</span> ${deputySuperintendent || 'N/A'}</div>
        </div>
    `;
    
    html += examDays.map((d, i) => `
        <div class="mb-6 border border-gray-300 dark:border-gray-700 p-4 rounded bg-white dark:bg-gray-800 shadow-sm page-break-inside-avoid">
            <h4 class="font-bold text-lg mb-3 border-b pb-1 text-gray-800 dark:text-gray-200">
                Day ${i + 1} - ${d.date ? new Date(d.date).toLocaleDateString() : 'N/A'} 
                <span class="text-sm font-normal text-gray-600 dark:text-gray-400">(${d.subject} | ${d.time})</span>
            </h4>
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-100 dark:bg-gray-700">
                        <th class="border p-2">Hall / Room</th>
                        <th class="border p-2">Assigned Staff / Invigilator(s)</th>
                    </tr>
                </thead>
                <tbody>
                    ${halls.map(h => `
                        <tr>
                            <td class="border p-2 font-medium">${h.name}</td>
                            <td class="border p-2">${d.staff[h.id] || 'Not Assigned'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `).join('');
    
    html += `
        <div class="mt-16 pt-8 flex justify-between px-10 border-t-2 border-gray-800">
            <div class="text-center font-bold">
                <br/>
                Exam Controller
            </div>
            <div class="text-center font-bold">
                <br/>
                Principal
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    container.classList.remove('hidden');
}
