"""
修复 OCRScan.tsx 中的乱码字符
"""
import re

file_path = r"C:\Users\Administrator\.openclaw\workspace\character-game\src\pages\OCRScan.tsx"

with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# 修复常见乱码
fixes = {
    '启动摄像？': '启动摄像头',
    '启动摄像？': '启动摄像头',
    '摄像？': '摄像头',
    '？': '头',
    '娆㈣繋': '欢迎',
    '娑堟伅': '消息',
    '闂垜': '问我',
    '浠讳綍': '任何',
    '闂': '问题',
    '鑾峰彇': '获取',
    '鏁版嵁': '数据',
    '娲炲': '洞察',
}

fixed_count = 0
for wrong, correct in fixes.items():
    if wrong in content:
        content = content.replace(wrong, correct)
        fixed_count += 1
        print(f"Fixed: {wrong} -> {correct}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nTotal fixes: {fixed_count}")
print("File saved!")
