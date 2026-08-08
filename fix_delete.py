with open('admin.js', 'r') as f:
    content = f.read()

# Fix the syntax error by closing the 'if' before 'catch'
import re
content = content.replace("    } catch(err) {", "        }\n    } catch(err) {")

with open('admin.js', 'w') as f:
    f.write(content)
