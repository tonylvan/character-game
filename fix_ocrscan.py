file_path = r"C:\Users\Administrator\.openclaw\workspace\character-game\src\pages\OCRScan.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixed = []
for i, line in enumerate(lines):
    # 修复第 5 行（索引 4）
    if i == 4 and '支持局域网访问' in line:
        line = line.replace('访问？', '访问）')
        fixed.append((i+1, '注释括号'))
    # 修复第 21 行（索引 20）
    elif i == 20 and '启动摄像' in line:
        line = line.replace('摄像？', '摄像头')
        fixed.append((i+1, '摄像头'))
    lines[i] = line

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed lines:")
for line_num, desc in fixed:
    print(f"  Line {line_num}: {desc}")
print(f"Total: {len(fixed)} fixes")
