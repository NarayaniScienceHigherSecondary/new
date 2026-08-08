import re

with open('librarian.js', 'r') as f:
    content = f.read()

# Locate the beginning of the Library Cards Tracker section
start_marker = "<!-- Library Cards Tracker -->"
# Wait, I can just replace the whole section starting from <!-- Library Cards Tracker --> down to the end of the table HTML.

# Actually, I can use a simpler approach. I'll find where it says "const cards = DB.getLibraryCards() || [];" and replace the logic.
# Wait, I also need to insert the statistics header. Let's just find the `<!-- Library Cards Tracker -->` and replace everything down to `</table>`.

start_idx = content.find("<!-- Library Cards Tracker -->")
end_idx = content.find("</table>", start_idx) + 8 # + len("</table>")
end_of_div = content.find("</div>", end_idx)
end_of_div2 = content.find("</div>", end_of_div + 6) + 6

new_tracker_code = """<!-- Library Cards Tracker -->
    <div class="glass-card p-6 mt-8">
        <h3 class="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white"><i class="fas fa-id-card text-primary"></i> Library Cards Management</h3>
        
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
    
    let generatedCount = 0;
    
    if(allStudents.length === 0) {
        html += `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No students registered yet.</td></tr>`;
    } else {
        allStudents.forEach(student => {
            const card = allCards.find(c => (c.studentId && (String(c.studentId) === String(student.id || student._id))) || (String(c.rollNo) === String(student.rollNo) && c.year === student.year));
            
            if (card && card.status !== 'Deleted') {
                generatedCount++;
                const status = card.status || 'Active';
                html += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-4 py-3 font-medium text-gray-800 dark:text-white">${student.name}</td>
                    <td class="px-4 py-3">${student.rollNo}</td>
                    <td class="px-4 py-3">${student.year}</td>
                    <td class="px-4 py-3 font-mono text-sm text-primary">${card.cardNumber}</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 text-xs rounded-full font-medium ${status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">${status}</span>
                    </td>
                    <td class="px-4 py-3 flex gap-2">
                        ${status === 'Suspended' ? `
                        <button onclick="window.renewLibraryCard('${card.id || card.cardNumber}')" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-check"></i> Renew
                        </button>
                        ` : `
                        <button onclick="window.suspendLibraryCard('${card.id || card.cardNumber}')" class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-pause"></i> Suspend
                        </button>
                        `}
                        <button onclick="window.revokeLibraryCard('${card.id || card.cardNumber}')" class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
                `;
            } else {
                html += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-4 py-3 font-medium text-gray-800 dark:text-white">${student.name}</td>
                    <td class="px-4 py-3">${student.rollNo}</td>
                    <td class="px-4 py-3">${student.year}</td>
                    <td class="px-4 py-3 font-mono text-sm text-gray-400">Not Generated</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-600">Pending</span>
                    </td>
                    <td class="px-4 py-3 flex gap-2">
                        <button onclick="window.createNewLibraryCard('${student.id || student._id}')" class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-id-card"></i> Generate Card
                        </button>
                    </td>
                </tr>
                `;
            }
        });
    }

    html += `
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
        setTimeout(() => {
            if(document.getElementById('stat_total_students')) document.getElementById('stat_total_students').innerText = '${allStudents.length}';
            if(document.getElementById('stat_cards_generated')) document.getElementById('stat_cards_generated').innerText = '${generatedCount}';
            if(document.getElementById('stat_pending_cards')) document.getElementById('stat_pending_cards').innerText = '${allStudents.length - generatedCount}';
        }, 100);
    </script>
    `;
"""

content = content[:start_idx] + new_tracker_code + content[end_of_div2:]

with open('librarian.js', 'w') as f:
    f.write(content)

