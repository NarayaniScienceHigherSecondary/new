import re
with open('admin.js', 'r') as f:
    content = f.read()

# I will replace the end of deleteStudent to be perfectly balanced.
# Let's locate the exact end of deleteStudent.
# The start is: window.deleteStudent = function(id, year) {
#    try {
#        if(confirm(...)) {
old_str = """        showToast('Student and all related data deleted successfully');
        navigate('admin_students'); // Refresh UI
        }
    } catch(err) {
        console.error("Delete Error:", err);
        alert("Delete failed: " + err.message);
    }
    }
}"""

new_str = """        showToast('Student and all related data deleted successfully');
        navigate('admin_students'); // Refresh UI
        }
    } catch(err) {
        console.error("Delete Error:", err);
        alert("Delete failed: " + err.message);
    }
}"""

content = content.replace(old_str, new_str)
with open('admin.js', 'w') as f:
    f.write(content)
