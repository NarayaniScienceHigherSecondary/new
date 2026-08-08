import re

with open('admin.js', 'r') as f:
    content = f.read()

# Add file input to modal
old_modal = """                            <label class="flex items-center space-x-2 mt-4 cursor-pointer">
                                <input type="checkbox" id="noticePinned" class="w-4 h-4 text-primary rounded border-gray-300">
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Pin to top</span>
                            </label>
                        </div>
                        
                        <div class="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">"""

new_modal = """                            <label class="flex items-center space-x-2 mt-4 cursor-pointer">
                                <input type="checkbox" id="noticePinned" class="w-4 h-4 text-primary rounded border-gray-300">
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Pin to top</span>
                            </label>
                            
                            <div class="mt-4">
                                <label class="block text-sm font-medium mb-1">Attachment (Optional - Max 1MB)</label>
                                <input type="file" id="noticeAttachment" accept=".pdf,.doc,.docx" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-white">
                                <p class="text-xs text-red-500 mt-1 hidden" id="noticeAttachmentError">File size exceeds 1MB limit.</p>
                            </div>
                        </div>
                        
                        <div class="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">"""

content = content.replace(old_modal, new_modal)

# Modify handleAddNotice to handle file
old_handle = """function handleAddNotice(e) {
    e.preventDefault();
    const title = document.getElementById('noticeTitle').value;
    const content = document.getElementById('noticeContent').value;
    const pinned = document.getElementById('noticePinned').checked;
    
    const date = new Date().toISOString().split('T')[0];
    
    DB.addNotice({ title, content, pinned, date, author: currentUser ? currentUser.name : 'Admin' });
    document.getElementById('addNoticeModal').classList.add('hidden');
    
    // Refresh views
    if(window.currentAdminView === 'notices') {
        renderUI();
    }
    showToast('Notice published successfully!');
}"""

new_handle = """function handleAddNotice(e) {
    e.preventDefault();
    const title = document.getElementById('noticeTitle').value;
    const content = document.getElementById('noticeContent').value;
    const pinned = document.getElementById('noticePinned').checked;
    const attachmentInput = document.getElementById('noticeAttachment');
    const date = new Date().toISOString().split('T')[0];
    const author = currentUser ? currentUser.name : 'Admin';
    
    const finishSave = (attachmentData = null, attachmentName = null, attachmentType = null) => {
        DB.addNotice({ title, content, pinned, date, author, attachmentData, attachmentName, attachmentType });
        document.getElementById('addNoticeModal').classList.add('hidden');
        if(window.currentAdminView === 'notices') {
            renderUI();
        }
        showToast('Notice published successfully!');
    };

    if (attachmentInput.files && attachmentInput.files[0]) {
        const file = attachmentInput.files[0];
        // 1MB limit = 1048576 bytes
        if (file.size > 1048576) {
            document.getElementById('noticeAttachmentError').classList.remove('hidden');
            return;
        }
        document.getElementById('noticeAttachmentError').classList.add('hidden');
        
        const reader = new FileReader();
        reader.onload = function(event) {
            finishSave(event.target.result, file.name, file.type);
        };
        reader.readAsDataURL(file);
    } else {
        finishSave();
    }
}"""

content = content.replace(old_handle, new_handle)

with open('admin.js', 'w') as f:
    f.write(content)
