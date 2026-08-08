import re
with open('librarian.js', 'r') as f:
    content = f.read()

# Add the delete button
old_buttons = """                <td class="px-4 py-3 flex gap-2">
                    ${b.status === 'Issued' ? `
                        <button onclick="window.markBookReturned('${b.id}')" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-check"></i> Return
                        </button>
                        <button onclick="window.openRenewBookModal('${b.id}')" class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors shadow-sm">
                            <i class="fas fa-sync-alt"></i> Renew
                        </button>
                    ` : '<span class="text-gray-400 text-sm">Completed</span>'}
                </td>"""

new_buttons = """                <td class="px-4 py-3 flex gap-2 items-center">
                    ${b.status === 'Issued' ? `
                        <button onclick="window.markBookReturned('${b.id}')" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors shadow-sm" title="Mark as Returned">
                            <i class="fas fa-check"></i>
                        </button>
                        <button onclick="window.openRenewBookModal('${b.id}')" class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors shadow-sm" title="Renew Book">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    ` : '<span class="text-gray-400 text-sm">Completed</span>'}
                    <button onclick="window.deleteIssuedBook('${b.id}')" class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors shadow-sm ml-auto" title="Delete Record">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>"""

content = content.replace(old_buttons, new_buttons)

# Add window.deleteIssuedBook at the end of the file or somewhere appropriate
delete_func = """
window.deleteIssuedBook = (id) => {
    if(confirm("Are you sure you want to permanently delete this issued book record?")) {
        if(DB && typeof DB.deleteIssuedBook === 'function') {
            DB.deleteIssuedBook(id);
            showToast('Issued book record deleted');
            navigate('librarian_tracker');
        }
    }
};
"""

content += delete_func

with open('librarian.js', 'w') as f:
    f.write(content)
