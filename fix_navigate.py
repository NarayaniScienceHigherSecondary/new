import re
with open('librarian.js', 'r') as f:
    content = f.read()

content = content.replace("navigate('librarian_tracker');", "navigate('librarian');")

with open('librarian.js', 'w') as f:
    f.write(content)
