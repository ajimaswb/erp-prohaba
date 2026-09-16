import os, re

def extract_text(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Simple regex to find text inside tags that contains parentheses
    # Not perfect but gives a good idea
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if '(' in line and ')' in line:
            # strip leading whitespace
            stripped = line.strip()
            # check if it looks like JSX text (not a function call)
            if re.search(r'>[^<]*\([^)]+\)[^<]*<', stripped) or ('placeholder=' in stripped and '(' in stripped):
                print(f"{filepath}:{i+1}: {stripped}")

for root, _, files in os.walk("src/app"):
    for f in files:
        if f.endswith("Client.jsx") or f == "Sidebar.jsx":
            extract_text(os.path.join(root, f))
