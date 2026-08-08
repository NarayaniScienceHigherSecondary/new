import re

with open('app.js', 'r') as f:
    content = f.read()

old_viewer = """                    <div class="prose dark:prose-invert max-w-none mb-8">
                        <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-lg">${notice.content}</p>
                    </div>
                    
                    <div class="flex justify-between items-center border-t dark:border-gray-700 pt-6 mt-6">"""

new_viewer = """                    <div class="prose dark:prose-invert max-w-none mb-8">
                        <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-lg">${notice.content}</p>
                    </div>
                    
                    ${notice.attachmentData ? `
                    <div class="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600 mb-8 flex items-center justify-between no-print">
                        <div class="flex items-center gap-4 overflow-hidden">
                            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-file-pdf text-2xl"></i>
                            </div>
                            <div class="truncate pr-4">
                                <p class="font-bold text-gray-800 dark:text-white truncate">${notice.attachmentName || 'Attached Document'}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">${(notice.attachmentType || '').split('/').pop() || 'DOCUMENT'}</p>
                            </div>
                        </div>
                        <a href="${notice.attachmentData}" download="${notice.attachmentName || 'notice_attachment'}" class="flex-shrink-0 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition flex items-center gap-2">
                            <i class="fas fa-download"></i> Download
                        </a>
                    </div>
                    ` : ''}
                    
                    <div class="flex justify-between items-center border-t dark:border-gray-700 pt-6 mt-6">"""

content = content.replace(old_viewer, new_viewer)

with open('app.js', 'w') as f:
    f.write(content)
