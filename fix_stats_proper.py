import re

with open('librarian.js', 'r') as f:
    content = f.read()

old_block = """    <!-- Library Cards Tracker -->
    <div class="glass-card p-6 mt-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 class="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-id-card text-primary"></i> Library Cards Management</h3>
            <button onclick="window.deleteAllLibraryCards()" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors shadow text-sm"><i class="fas fa-trash-alt mr-2"></i> Delete All Cards</button>
        </div>
        
        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                <p class="text-2xl font-bold text-gray-800 dark:text-white" id="stat_total_students">0</p>
            </div>
            <div class="bg-green-50 dark:bg-gray-700 p-4 rounded-lg border border-green-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Cards Generated</p>
                <p class="text-2xl font-bold text-green-700 dark:text-green-400" id="stat_cards_generated">0</p>
            </div>
            <div class="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg border border-yellow-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Pending to Generate</p>
                <p class="text-2xl font-bold text-yellow-700 dark:text-yellow-400" id="stat_pending_cards">0</p>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left whitespace-nowrap">
                <thead>
                    <tr class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <th class="px-4 py-3 font-semibold rounded-tl-lg">Student Name</th>
                        <th class="px-4 py-3 font-semibold">Roll Number</th>
                        <th class="px-4 py-3 font-semibold">Year</th>
                        <th class="px-4 py-3 font-semibold">Card Number</th>
                        <th class="px-4 py-3 font-semibold">Status</th>
                        <th class="px-4 py-3 font-semibold rounded-tr-lg">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
    `;
    
    const allStudents = DB.getStudents() || [];
    const allCards = DB.getLibraryCards() || [];
    
    let generatedCount = 0;"""

new_block = """    `;
    
    const allStudents = DB.getStudents() || [];
    const allCards = DB.getLibraryCards() || [];
    
    let generatedCount = 0;
    allStudents.forEach(student => {
        const card = allCards.find(c => String(c.rollNo) === String(student.rollNo) && c.year === student.year);
        if (card && card.status !== 'Deleted') generatedCount++;
    });

    html += `
    <!-- Library Cards Tracker -->
    <div class="glass-card p-6 mt-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 class="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-id-card text-primary"></i> Library Cards Management</h3>
            <button onclick="window.deleteAllLibraryCards()" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors shadow text-sm"><i class="fas fa-trash-alt mr-2"></i> Delete All Cards</button>
        </div>
        
        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                <p class="text-2xl font-bold text-gray-800 dark:text-white" id="stat_total_students">${allStudents.length}</p>
            </div>
            <div class="bg-green-50 dark:bg-gray-700 p-4 rounded-lg border border-green-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Cards Generated</p>
                <p class="text-2xl font-bold text-green-700 dark:text-green-400" id="stat_cards_generated">${generatedCount}</p>
            </div>
            <div class="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg border border-yellow-100 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400">Pending to Generate</p>
                <p class="text-2xl font-bold text-yellow-700 dark:text-yellow-400" id="stat_pending_cards">${allStudents.length - generatedCount}</p>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left whitespace-nowrap">
                <thead>
                    <tr class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <th class="px-4 py-3 font-semibold rounded-tl-lg">Student Name</th>
                        <th class="px-4 py-3 font-semibold">Roll Number</th>
                        <th class="px-4 py-3 font-semibold">Year</th>
                        <th class="px-4 py-3 font-semibold">Card Number</th>
                        <th class="px-4 py-3 font-semibold">Status</th>
                        <th class="px-4 py-3 font-semibold rounded-tr-lg">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
    `;"""

content = content.replace(old_block, new_block)

# Remove the old loop's `generatedCount++` since we computed it beforehand
content = content.replace("generatedCount++;", "")

with open('librarian.js', 'w') as f:
    f.write(content)
