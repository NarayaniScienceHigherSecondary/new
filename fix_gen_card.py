import re

with open('librarian.js', 'r') as f:
    lib_content = f.read()

old_gen_btn = """<button onclick="window.createNewLibraryCard('${student.id || student._id}')" class="text-sm bg-primary hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors shadow-sm">"""
new_gen_btn = """<button onclick="window.createNewLibraryCard('${student.rollNo}', '${student.year}')" class="text-sm bg-primary hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors shadow-sm">"""
lib_content = lib_content.replace(old_gen_btn, new_gen_btn)

old_win_func = """window.createNewLibraryCard = (studentId) => {
    if(confirm("Generate a new library card for this student?")) {
        if(DB && typeof DB.createNewLibraryCard === 'function') {
            DB.createNewLibraryCard(studentId);"""
new_win_func = """window.createNewLibraryCard = (rollNo, year) => {
    if(confirm("Generate a new library card for this student?")) {
        if(DB && typeof DB.createNewLibraryCard === 'function') {
            DB.createNewLibraryCard(rollNo, year);"""
lib_content = lib_content.replace(old_win_func, new_win_func)

with open('librarian.js', 'w') as f:
    f.write(lib_content)


with open('data.js', 'r') as f:
    data_content = f.read()

old_data_func = """    createNewLibraryCard: (studentId) => {
        let students = DB.getStudents();
        let student = students.find(s => String(s.id || s._id) === String(studentId));"""
new_data_func = """    createNewLibraryCard: (rollNo, year) => {
        let students = DB.getStudents();
        let student = students.find(s => String(s.rollNo) === String(rollNo) && String(s.year) === String(year));"""
data_content = data_content.replace(old_data_func, new_data_func)

with open('data.js', 'w') as f:
    f.write(data_content)
