import re

with open('admin.js', 'r') as f:
    content = f.read()

old_promo = """            const theirCard = allLibraryCards.find(c => String(c.rollNo) === String(s.rollNo));
            
            s.year = '+2 2nd year';
            s.profileComplete = false;
            
            if (theirCard) {
                theirCard.year = s.year;
            }"""

new_promo = """            const theirCard = allLibraryCards.find(c => String(c.rollNo) === String(s.rollNo));
            
            s.year = '+2 2nd year';
            s.profileComplete = false;
            
            if (theirCard) {
                console.log('Promoting card for RollNo', s.rollNo, 'Old number:', theirCard.cardNumber);
                theirCard.year = s.year;
                console.log('Promoted card. New number:', theirCard.cardNumber);
            } else {
                console.warn('NO CARD FOUND during promotion for RollNo', s.rollNo);
            }"""

content = content.replace(old_promo, new_promo)

with open('admin.js', 'w') as f:
    f.write(content)
