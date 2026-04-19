import os
import glob
import re

directory = 'frontend/src'
pattern = re.compile(r'"http://localhost:8000/api(.*?)"')
pattern2 = re.compile(r'`http://localhost:8000/api(.*?)`')

for filepath in glob.iglob(directory + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = pattern.sub(r'`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}\1`', content)
    new_content = pattern2.sub(r'`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}\1`', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
