with open('admin.js', 'r') as f:
    content = f.read()

# Replace window.deleteStudent definition with one wrapped in try/catch
import re

old_func = r"window\.deleteStudent\s*=\s*function\(id,\s*year\)\s*\{"
new_func = r"""window.deleteStudent = function(id, year) {
    try {"""

content = re.sub(old_func, new_func, content)

# And at the end of the function:
old_end = r"""        showToast\('Student and all related data deleted successfully'\);
        navigate\('admin_students'\); // Refresh UI
    \}
\}"""
new_end = r"""        showToast('Student and all related data deleted successfully');
        navigate('admin_students'); // Refresh UI
    } catch(err) {
        console.error("Delete Error:", err);
        alert("Delete failed: " + err.message);
    }
    }
}"""

content = re.sub(old_end, new_end, content)

with open('admin.js', 'w') as f:
    f.write(content)
