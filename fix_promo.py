import re

with open('admin.js', 'r') as f:
    content = f.read()

# Use regex to find and replace the block
pattern = r"const theirCard = allLibraryCards\.find\(c =>[\s\n]*\(String\(c\.rollNo\) === String\(s\.rollNo\) && c\.year === s\.year\)[\s\n]*\);"
replacement = "const theirCard = allLibraryCards.find(c => String(c.rollNo) === String(s.rollNo));"

content = re.sub(pattern, replacement, content)

with open('admin.js', 'w') as f:
    f.write(content)
