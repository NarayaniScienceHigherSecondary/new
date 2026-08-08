with open('librarian.js', 'r') as f:
    content = f.read()

content = content.replace("    </script>\n    `;\n\n    `;", "    </script>\n    `;")

with open('librarian.js', 'w') as f:
    f.write(content)
