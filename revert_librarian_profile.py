import re

with open('librarian.js', 'r') as f:
    content = f.read()

# Remove button from sidebar
old_nav = """                <button onclick="window.currentLibrarianView='clearance'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'clearance' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-clipboard-check w-6"></i> Clearance (+2 1st)
                </button>
                <button onclick="window.currentLibrarianView='profile'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'profile' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-user-circle w-6"></i> Profile
                </button>
                
                <div class="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">"""

new_nav = """                <button onclick="window.currentLibrarianView='clearance'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'clearance' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-clipboard-check w-6"></i> Clearance (+2 1st)
                </button>
                
                <div class="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">"""

content = content.replace(old_nav, new_nav)

with open('librarian.js', 'w') as f:
    f.write(content)
