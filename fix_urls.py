import os
import re

directory = 'frontend/app'
pattern_quote = re.compile(r"'http://localhost:8000(/[^']*)'")
pattern_tick = re.compile(r"`http://localhost:8000(/[^`]*)`")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Replace 'http://localhost:8000/...' with `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/...`
            new_content = pattern_quote.sub(r"`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}\1`", content)
            
            # Replace `http://localhost:8000/...` with `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/...`
            new_content = pattern_tick.sub(r"`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}\1`", new_content)
            
            if content != new_content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
