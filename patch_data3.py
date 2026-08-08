with open('data.js', 'r') as f:
    content = f.read()

import re

old_card_gen = """        let yearPrefix = '0';
        if (student.year === '+2 1st year') yearPrefix = '1';
        else if (student.year === '+2 2nd year') yearPrefix = '2';
        
        const cardNo = `LIB-${yearPrefix}-${new Date().getFullYear()}-${student.rollNo}`;"""

new_card_gen = """        // Generate unique NSHSS number for the library card
        const uniqueNum = Math.floor(100000 + Math.random() * 900000);
        const cardNo = `NSHSS-${uniqueNum}`;"""

content = content.replace(old_card_gen, new_card_gen)

with open('data.js', 'w') as f:
    f.write(content)
