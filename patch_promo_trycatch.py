import re

with open('admin.js', 'r') as f:
    content = f.read()

old_logic = """window.promote1stYearStudents = function() {
    if(!confirm("⚠️ WARNING: This will PERMANENTLY DELETE all current '+2 2nd year' students (profiles and logins) and promote all '+2 1st year' students to 2nd year. This action cannot be undone! Are you absolutely sure?")) {
        return;
    }"""

new_logic = """window.promote1stYearStudents = function() {
    try {
    if(!confirm("⚠️ WARNING: This will PERMANENTLY DELETE all current '+2 2nd year' students (profiles and logins) and promote all '+2 1st year' students to 2nd year. This action cannot be undone! Are you absolutely sure?")) {
        return;
    }"""

content = content.replace(old_logic, new_logic)

old_end = """    if (blockedStudents.length > 0) {
        alert(`Successfully promoted ${promotedCount} students.\\n\\nWARNING: ${blockedStudents.length} students were BLOCKED from promotion because they have unreturned library books (No Clearance):\\n\\n${blockedStudents.join('\\n')}`);
    } else {
        showToast("Successfully promoted 1st year students, cleared the old batch, and updated library cards.");
    }
    navigate('admin_students'); // Refresh UI
};"""

new_end = """    if (blockedStudents.length > 0) {
        alert(`Successfully promoted ${promotedCount} students.\\n\\nWARNING: ${blockedStudents.length} students were BLOCKED from promotion because they have unreturned library books (No Clearance):\\n\\n${blockedStudents.join('\\n')}`);
    } else {
        showToast("Successfully promoted 1st year students, cleared the old batch, and updated library cards.");
    }
    navigate('admin_students'); // Refresh UI
    } catch (e) {
        console.error("Promotion Error:", e);
        alert("An error occurred during promotion: " + e.message);
    }
};"""

content = content.replace(old_end, new_end)

with open('admin.js', 'w') as f:
    f.write(content)
