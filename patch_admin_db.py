import re

with open('admin.js', 'r') as f:
    content = f.read()

# Add the Data Backup & Restore section to Settings
old_settings = """                    <div class="mt-6 flex justify-end">
                        <button onclick="window.saveCollegeSettings()" class="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition flex items-center">
                            <i class="fas fa-save mr-2"></i> Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};"""

new_settings = """                    <div class="mt-6 flex justify-end">
                        <button onclick="window.saveCollegeSettings()" class="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition flex items-center">
                            <i class="fas fa-save mr-2"></i> Save Settings
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Database Backup and Restore -->
            <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4"><i class="fas fa-database text-primary mr-2"></i>Database Management</h3>
                <p class="text-sm text-gray-500 mb-6">Backup your complete college database or restore it when moving between Local File mode and Live Server mode.</p>
                
                <div class="flex flex-col md:flex-row gap-4">
                    <button onclick="window.exportDatabaseBackup()" class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition flex items-center justify-center">
                        <i class="fas fa-download mr-2"></i> Download Backup (JSON)
                    </button>
                    <label class="flex-1 cursor-pointer bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition flex items-center justify-center">
                        <i class="fas fa-upload mr-2"></i> Restore Backup
                        <input type="file" id="db_restore_file" accept=".json" class="hidden" onchange="window.importDatabaseBackup(event)">
                    </label>
                </div>
            </div>
        </div>
    </div>
    `;
};

window.exportDatabaseBackup = () => {
    const db = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        db[key] = localStorage.getItem(key);
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "college_database_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast('Backup downloaded successfully!');
};

window.importDatabaseBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if(!confirm("WARNING: This will completely replace your current database with the backup file. Are you sure you want to proceed?")) {
        e.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const db = JSON.parse(event.target.result);
            localStorage.clear();
            for (const key in db) {
                localStorage.setItem(key, db[key]);
            }
            showToast('Database restored successfully! Reloading...');
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error(error);
            showToast('Failed to parse backup file.', 'error');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
};
"""

content = content.replace(old_settings, new_settings)

with open('admin.js', 'w') as f:
    f.write(content)
