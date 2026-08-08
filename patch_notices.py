import re

# 1. Update librarian.js
with open('librarian.js', 'r') as f:
    content = f.read()

old_librarian = """        content: `The following +2 1st year students have unreturned library books. You MUST return your books by **${deadline}** or your promotion to 2nd year will be blocked.\\n\\nStudents:\\n${studentListHTML}`,
        date: new Date().toISOString().split('T')[0],
        target: 'all' // visible to all students"""
new_librarian = """        content: `The following +2 1st year students have unreturned library books. You MUST return your books by **${deadline}** or your promotion to 2nd year will be blocked.\\n\\nStudents:\\n${studentListHTML}`,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        target: 'all' // visible to all students"""
content = content.replace(old_librarian, new_librarian)
with open('librarian.js', 'w') as f:
    f.write(content)

# 2. Update admin_exams.js
with open('admin_exams.js', 'r') as f:
    content = f.read()

old_exams = """        date: new Date().toISOString().split('T')[0],
        content: tableHtml,
        target: year === 'All Years' ? 'All' : year"""
new_exams = """        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        content: tableHtml,
        target: year === 'All Years' ? 'All' : year"""
content = content.replace(old_exams, new_exams)

old_exams_pub = """        title: `Exam Results Published: ${exam.title}`,
        date: new Date().toISOString().split('T')[0],
        content: `The results for ${exam.title} (${exam.targetYear}) have been published and are now available for viewing.`,
        target: exam.targetYear === 'All Years' ? 'All' : exam.targetYear"""
new_exams_pub = """        title: `Exam Results Published: ${exam.title}`,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        content: `The results for ${exam.title} (${exam.targetYear}) have been published and are now available for viewing.`,
        target: exam.targetYear === 'All Years' ? 'All' : exam.targetYear"""
content = content.replace(old_exams_pub, new_exams_pub)
with open('admin_exams.js', 'w') as f:
    f.write(content)

# 3. Update student.js
with open('student.js', 'r') as f:
    content = f.read()

old_student = """                            ${notices.length ? notices.map(n => `
                                <div onclick="openPublicNoticeModal('${n.id}')" class="cursor-pointer p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col">
                                    <h4 class="font-bold text-gray-800 dark:text-white mb-1 group-hover:text-primary transition-colors">${n.title}</h4>
                                    <span class="text-xs text-gray-500 font-medium flex items-center"><i class="far fa-calendar mr-2"></i>${n.date}</span>
                                </div>
                            `).join('') : '<p class="text-gray-500 italic p-4">No recent notices.</p>'}"""

new_student = """                            ${notices.length ? notices.map(n => {
                                const isNew = n.createdAt && (Date.now() - new Date(n.createdAt).getTime() <= 48 * 60 * 60 * 1000);
                                return `
                                <div onclick="openPublicNoticeModal('${n.id}')" class="cursor-pointer p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col">
                                    <h4 class="font-bold text-gray-800 dark:text-white mb-1 group-hover:text-primary transition-colors">
                                        ${n.title}
                                        ${isNew ? '<span class="bg-red-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ml-2 animate-pulse shadow-sm inline-block transform -translate-y-0.5">New</span>' : ''}
                                    </h4>
                                    <span class="text-xs text-gray-500 font-medium flex items-center"><i class="far fa-calendar mr-2"></i>${n.date}</span>
                                </div>
                            `}).join('') : '<p class="text-gray-500 italic p-4">No recent notices.</p>'}"""
content = content.replace(old_student, new_student)
with open('student.js', 'w') as f:
    f.write(content)

# 4. Update staff.js
with open('staff.js', 'r') as f:
    content = f.read()

old_staff = """                        ${notices.length ? notices.slice(0, 4).map(n => `
                        <div onclick="openPublicNoticeModal('${n.id}')" class="cursor-pointer p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            <h4 class="font-semibold text-gray-800 dark:text-white mb-1">${n.title}</h4>
                            <span class="text-xs text-gray-500">${n.date}</span>
                        </div>
                    `).join('') : '<p class="text-gray-500">No notices.</p>'}"""

new_staff = """                        ${notices.length ? notices.slice(0, 4).map(n => {
                            const isNew = n.createdAt && (Date.now() - new Date(n.createdAt).getTime() <= 48 * 60 * 60 * 1000);
                            return `
                        <div onclick="openPublicNoticeModal('${n.id}')" class="cursor-pointer p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            <h4 class="font-semibold text-gray-800 dark:text-white mb-1">
                                ${n.title}
                                ${isNew ? '<span class="bg-red-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ml-2 animate-pulse shadow-sm inline-block transform -translate-y-0.5">New</span>' : ''}
                            </h4>
                            <span class="text-xs text-gray-500">${n.date}</span>
                        </div>
                    `}).join('') : '<p class="text-gray-500">No notices.</p>'}"""

content = content.replace(old_staff, new_staff)
with open('staff.js', 'w') as f:
    f.write(content)

print("Patch applied")
