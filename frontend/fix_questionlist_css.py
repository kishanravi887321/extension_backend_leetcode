
import os

file_path = r'd:\WeBDevelopment\Main\backend_leetcode_extension\frontend\src\components\QuestionList.css'

# Read the file
lines = []
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

# Find the line with .list-body::-webkit-scrollbar-thumb:hover
cutoff_index = -1
for i, line in enumerate(lines):
    if '.list-body::-webkit-scrollbar-thumb:hover' in line:
        cutoff_index = i + 2 # Keep the selector and the closing brace (which is typically a few lines down)
        break

# Manual check from previous read_file:
# Line 819 is .list-body::-webkit-scrollbar-thumb:hover {
# Line 820 is   background: rgba(255, 255, 255, 0.2);
# Line 821 is }
# So we want to keep up to line 821.

lines = lines[:822]

# Ensure the last line has a newline
if lines and not lines[-1].endswith('\n'):
    lines[-1] += '\n'

# Write back with new content
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("QuestionList.css fixed.")
