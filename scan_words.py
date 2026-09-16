import os, re

bad_patterns = re.compile(r'\((?![eE]\b|id\b|req\b|res\b|err\b|_)[a-zA-Z0-9_ +.,-]*\)')

for root, _, files in os.walk("src/app"):
    for f in files:
        if f.endswith(".jsx") or f == "page.js" or f == "Sidebar.jsx":
            path = os.path.join(root, f)
            with open(path, "r") as file:
                lines = file.readlines()
                for i, line in enumerate(lines):
                    if '<' in line or 'label' in line or 'placeholder' in line or 'title' in line or 'title=' in line or 'alert(' in line:
                        matches = bad_patterns.findall(line)
                        valid_matches = []
                        for m in matches:
                            if "=>" not in line and "e." not in m and "e " not in m and len(m)>3:
                                valid_matches.append(m)
                        if valid_matches:
                            print(f"{path}:{i+1}: {line.strip()}")
