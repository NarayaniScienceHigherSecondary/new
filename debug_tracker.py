import json

try:
    with open('backend/data/college_data.json', 'r') as f:
        data = json.load(f)
except Exception as e:
    print("Could not read json", e)
    
if 'libraryBooks' in data:
    books = data['libraryBooks']
    print(f"Total books: {len(books)}")
    
    cards = data.get('libraryCards', [])
    students = data.get('students', [])
    
    deleted = 0
    second = 0
    first = 0
    
    for b in books:
        card = next((c for c in cards if c.get('cardNumber') == b.get('cardNumber')), None)
        activeStudent = None
        if card:
            activeStudent = next((s for s in students if str(s.get('rollNo')) == str(card.get('rollNo')) and s.get('year') == card.get('year')), None)
            
        if not activeStudent:
            deleted += 1
            print(f"DELETED BOOK: {b.get('bookName')} issued to {b.get('studentName')} card {b.get('cardNumber')}")
        elif activeStudent.get('year') == '+2 2nd year':
            second += 1
        else:
            first += 1
            
    print(f"Deleted: {deleted}, 2nd: {second}, 1st: {first}")
