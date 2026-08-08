import sys
try:
    import js2py
    js2py.parse_js(open('admin.js').read())
    print("Syntax OK")
except Exception as e:
    print(e)
