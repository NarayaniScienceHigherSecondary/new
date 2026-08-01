window.renderAdminCertificate = () => {
    window.currentAdminView = 'certificate';
    const students = DB.getStudents() || [];

    return `
    <div class="animate-fade-in no-print">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            <i class="fas fa-certificate text-purple-600 mr-2"></i> Achievement Certificate Generator
        </h2>

        <div class="glass-card p-6 rounded-xl max-w-3xl mx-auto">
            <form onsubmit="handleGenerateCertificate(event)">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="col-span-1 md:col-span-2">
                        <label class="block text-sm font-medium mb-1">Select Student</label>
                        <select id="cert_student" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary" onchange="fillCertStudentDetails()">
                            <option value="">-- Choose a Student --</option>
                            ${students.map(s => `<option value="${s.id || s.rollNo}">${s.name} (Roll: ${s.rollNo} - ${s.year || ''})</option>`).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-1">Student Name</label>
                        <input type="text" id="cert_name" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Roll Number</label>
                        <input type="text" id="cert_roll" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>

                    <div class="col-span-1 md:col-span-2">
                        <label class="block text-sm font-medium mb-1">Competition Name</label>
                        <input type="text" id="cert_competition" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. Inter-College Science Quiz">
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Place Secured</label>
                        <input type="text" id="cert_place" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. 1st, 2nd, Gold Medal">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-1">Academic Year</label>
                        <input type="text" id="cert_academic_year" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. 2025-2026">
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Date of Issue</label>
                        <input type="date" id="cert_date" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Place of Issue</label>
                        <input type="text" id="cert_place_issue" required value="Narayani Science College" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                </div>

                <div class="flex justify-end mt-6">
                    <button type="submit" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition transform hover:-translate-y-1">
                        <i class="fas fa-print mr-2"></i> Generate & Print Certificate
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Printable Certificate Area -->
    <div id="print_certificate_area" class="hidden"></div>
    `;
};

window.fillCertStudentDetails = () => {
    const val = document.getElementById('cert_student').value;
    if(!val) {
        document.getElementById('cert_name').value = '';
        document.getElementById('cert_roll').value = '';
        return;
    }
    const students = DB.getStudents();
    const student = students.find(s => String(s.id || s.rollNo) === String(val));
    if(student) {
        document.getElementById('cert_name').value = student.name;
        document.getElementById('cert_roll').value = student.rollNo;
    }
};

window.handleGenerateCertificate = (e) => {
    e.preventDefault();
    const name = document.getElementById('cert_name').value.trim();
    const roll = document.getElementById('cert_roll').value.trim();
    const competition = document.getElementById('cert_competition').value.trim();
    const place = document.getElementById('cert_place').value.trim();
    const academicYear = document.getElementById('cert_academic_year').value.trim();
    const dateInput = document.getElementById('cert_date').value;
    const placeIssue = document.getElementById('cert_place_issue').value.trim();

    const dateParts = dateInput.split('-');
    const formattedDate = dateParts.length === 3 ? \`\${dateParts[2]} / \${dateParts[1]} / \${dateParts[0]}\` : dateInput;

    const info = DB.getCollegeInfo();
    const logoUrl = info.logo || 'https://via.placeholder.com/150?text=Logo';

    const certHTML = \`
    <div class="certificate-container" style="padding: 50px; border: 20px solid #1e3a8a; background: #fff; max-width: 1100px; height: 750px; margin: 0 auto; position: relative; font-family: 'Times New Roman', serif; text-align: center; box-sizing: border-box; outline: 2px solid #b91c1c; outline-offset: -10px;">
        
        <!-- Background watermark logo -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; z-index: 0; pointer-events: none;">
            <img src="\${logoUrl}" style="width: 500px; height: 500px; object-fit: contain;">
        </div>
        
        <div style="position: relative; z-index: 1;">
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
                <img src="\${logoUrl}" alt="College Logo" style="height: 120px; margin-right: 30px;">
                <h1 style="font-size: 34px; font-weight: bold; color: #1e3a8a; margin: 0;">NARAYANI SCIENCE HIGHER SECONDARY SCHOOL</h1>
            </div>
            
            <p style="font-size: 20px; margin-bottom: 30px; font-weight: bold;">Academic Year: <span style="border-bottom: 1px solid #000; padding: 0 10px;">\${academicYear}</span></p>
            
            <h2 style="font-size: 40px; color: #b91c1c; font-weight: bold; margin: 30px 0; letter-spacing: 2px;">CERTIFICATE OF ACHIEVEMENT</h2>
            
            <p style="font-size: 20px; line-height: 2.2; text-align: justify; margin: 0 40px;">
                This is to certify that Mr./Ms. <strong style="border-bottom: 1px dashed #000; padding: 0 10px; font-size: 22px;">\${name}</strong>, 
                Roll Number <strong style="border-bottom: 1px dashed #000; padding: 0 10px;">\${roll}</strong>, has demonstrated exceptional dedication, talent, and excellence by securing 
                <strong style="border-bottom: 1px dashed #000; padding: 0 10px;">\${place}</strong> Place in the 
                <strong style="border-bottom: 1px dashed #000; padding: 0 10px;">\${competition}</strong> conducted during the Academic Year 
                <strong style="border-bottom: 1px dashed #000; padding: 0 10px;">\${academicYear}</strong>. This achievement reflects the student’s hard work, perseverance, discipline, and commitment to excellence. 
                In recognition of this commendable accomplishment, Narayani Science Higher Secondary School proudly presents this Certificate of Achievement and extends heartfelt congratulations along with best wishes for continued success and excellence in all future academic, cultural, and extracurricular endeavors.
            </p>
            
            <div style="display: flex; justify-content: space-between; margin: 50px 40px 0 40px; font-size: 18px;">
                <p>Date of Issue: <strong>\${formattedDate}</strong></p>
                <p>Place of Issue: <strong>\${placeIssue}</strong></p>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin: 60px 40px 20px 40px; font-size: 18px; font-weight: bold;">
                <div style="text-align: center;">
                    <div style="border-bottom: 2px solid #000; width: 250px; margin-bottom: 10px;"></div>
                    <p style="margin: 0;">Principal</p>
                    <p style="margin: 0; font-size: 14px; font-weight: normal;">(Signature & School Seal)</p>
                </div>
                <div style="text-align: center;">
                    <div style="border-bottom: 2px solid #000; width: 250px; margin-bottom: 10px;"></div>
                    <p style="margin: 0;">Competition Coordinator</p>
                </div>
            </div>
        </div>
    </div>
    <style>
        @media print {
            body * {
                visibility: hidden !important;
            }
            #print_certificate_area, #print_certificate_area * {
                visibility: visible !important;
            }
            #print_certificate_area {
                display: flex !important;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100vh;
                align-items: center;
                justify-content: center;
                margin: 0;
                padding: 0;
                background: white;
            }
            .certificate-container {
                width: 297mm !important;
                height: 210mm !important;
                max-width: none !important;
                border: 25px solid #1e3a8a !important;
                outline: 2px solid #b91c1c !important;
                outline-offset: -12px !important;
            }
            @page {
                size: A4 landscape;
                margin: 0;
            }
        }
    </style>
    \`;
    
    document.getElementById('print_certificate_area').innerHTML = certHTML;
    document.getElementById('print_certificate_area').classList.remove('hidden');
    
    setTimeout(() => {
        window.print();
        document.getElementById('print_certificate_area').classList.add('hidden');
    }, 500);
};
