import re

with open('librarian.js', 'r') as f:
    content = f.read()

# Add button to sidebar
old_nav = """                <button onclick="window.currentLibrarianView='clearance'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'clearance' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-clipboard-check w-6"></i> Clearance (+2 1st)
                </button>
                
                <div class="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">"""

new_nav = """                <button onclick="window.currentLibrarianView='clearance'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'clearance' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-clipboard-check w-6"></i> Clearance (+2 1st)
                </button>
                <button onclick="window.currentLibrarianView='profile'; navigate('librarian')" class="w-full text-left px-4 py-2.5 rounded-lg transition-colors ${window.currentLibrarianView === 'profile' ? 'bg-blue-50 text-primary dark:bg-gray-700 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}">
                    <i class="fas fa-user-circle w-6"></i> Profile
                </button>
                
                <div class="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">"""

content = content.replace(old_nav, new_nav)

# Add view switcher
old_switch = """            <!-- Content Area -->
            ${(!window.currentLibrarianView || window.currentLibrarianView === 'issue') ? renderLibrarianIssueView() : (window.currentLibrarianView === 'track' ? renderLibrarianTrackerView() : renderLibrarianClearanceView())}
            
        </main>"""

new_switch = """            <!-- Content Area -->
            ${(!window.currentLibrarianView || window.currentLibrarianView === 'issue') ? renderLibrarianIssueView() : (window.currentLibrarianView === 'track' ? renderLibrarianTrackerView() : (window.currentLibrarianView === 'profile' ? renderLibrarianProfile() : renderLibrarianClearanceView()))}
            
        </main>"""

content = content.replace(old_switch, new_switch)

# Add renderLibrarianProfile function
profile_func = """
function renderLibrarianProfile() {
    return `
    <div class="max-w-2xl mx-auto">
        <div class="glass-card p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-bl-full opacity-10"></div>
            
            <div class="flex items-center gap-6 mb-8 relative z-10">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-md flex items-center justify-center text-4xl text-white font-bold border-4 border-white dark:border-gray-800">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-white">${currentUser.name || 'Librarian'}</h2>
                    <p class="text-gray-500 text-lg flex items-center gap-2 mt-1">
                        <i class="fas fa-id-badge"></i> ID: ${currentUser.id}
                    </p>
                    <p class="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                        ${currentUser.role} Account
                    </p>
                </div>
            </div>

            <div class="border-t border-gray-100 dark:border-gray-700 pt-8 mt-4 relative z-10">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <i class="fas fa-lock text-primary"></i> Security & Settings
                </h3>
                
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><i class="fas fa-font"></i></span>
                                <input type="text" id="lib_profile_name" value="${currentUser.name || ''}" class="w-full pl-10 pr-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Password</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><i class="fas fa-key"></i></span>
                                <input type="password" id="lib_profile_pass" placeholder="Enter new password" class="w-full pl-10 pr-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-6 flex justify-end">
                        <button onclick="window.saveLibrarianProfile()" class="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

window.saveLibrarianProfile = () => {
    const newName = document.getElementById('lib_profile_name').value.trim();
    const newPass = document.getElementById('lib_profile_pass').value.trim();
    
    if(!newName) return showToast('Name cannot be empty', 'error');
    
    let allUsers = DB.getUsers();
    let userRec = allUsers.find(u => u.id === currentUser.id && u.role === currentUser.role);
    
    if(userRec) {
        userRec.name = newName;
        if(newPass) userRec.password = newPass;
        DB.set('users', allUsers);
        
        // Update current session
        currentUser.name = newName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showToast('Profile updated successfully!');
        navigate('librarian');
    }
};
"""

content += profile_func

with open('librarian.js', 'w') as f:
    f.write(content)
