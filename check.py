import sys

def check_backticks(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    in_backtick = False
    in_single = False
    in_double = False
    
    line_no = 1
    for i, char in enumerate(content):
        if char == "\n":
            line_no += 1
            continue
            
        if char == "`" and not in_single and not in_double:
            in_backtick = not in_backtick
        elif char == "'" and not in_backtick and not in_double:
            in_single = not in_single
        elif char == '"' and not in_backtick and not in_single:
            in_double = not in_double
            
    if in_backtick:
        print("Syntax Error: Unclosed backtick at end of file")
    else:
        print("Backticks are balanced.")

check_backticks("student.js")
