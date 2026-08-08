import re

with open('app.js', 'r') as f:
    content = f.read()

# Extract from window.printNotice to the end of the function (just before window.toggleTheme)
match = re.search(r'window\.printNotice\s*=\s*\(id\)\s*=>\s*\{.*?\n\};\n\nwindow\.toggleTheme', content, re.DOTALL)
if match:
    old_func = match.group(0).replace('\n\nwindow.toggleTheme', '')

    new_func = """window.printNotice = (id) => {
    const notice = DB.getNotices().find(n => String(n.id) === String(id));
    const info = DB.getCollegeInfo();
    if (!notice) return;
    
    let iframe = document.getElementById('print-iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'print-iframe';
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        document.body.appendChild(iframe);
    }
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>Print Notice - ${notice.title}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
                .college-logo { width: 80px; height: 80px; object-fit: cover; border-radius: 50%; margin: 0 auto 15px; display: block; }
                .college-logo-fallback { width: 80px; height: 80px; background: #1e3a8a; color: white; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; }
                .college-name { font-size: 24px; font-weight: bold; text-transform: uppercase; margin: 0; color: #1e3a8a; }
                .college-location { font-size: 14px; color: #666; margin-top: 5px; }
                .notice-title { font-size: 20px; font-weight: bold; text-align: center; text-decoration: underline; margin-bottom: 10px; }
                .notice-date { text-align: center; font-size: 14px; color: #666; margin-bottom: 30px; }
                .notice-content { font-size: 16px; white-space: pre-wrap; margin-bottom: 50px; }
                .footer-container { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; }
                .signature-box { text-align: center; }
                .signature-line { width: 150px; border-bottom: 1px solid #333; margin-bottom: 5px; }
                .signature-text { font-size: 14px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                ${info.logoUrl ? \`<img src="${info.logoUrl}" class="college-logo" alt="Logo">\` : \`<div class="college-logo-fallback">${info.name.charAt(0)}</div>\`}
                <h1 class="college-name">${info.name}</h1>
                <div class="college-location">${info.address}</div>
            </div>
            
            <div class="notice-title">${notice.title}</div>
            <div class="notice-date">Date: ${notice.date}</div>
            
            <div class="notice-content">${notice.content}</div>
            
            <div class="footer-container">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-text">Clerk Signature</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-text">Principal Signature</div>
                </div>
            </div>
        </body>
        </html>
    `);
    doc.close();
    
    iframe.contentWindow.focus();
    setTimeout(() => {
        iframe.contentWindow.print();
    }, 500);
};"""

    content = content.replace(old_func, new_func)
    
    with open('app.js', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Match not found")
