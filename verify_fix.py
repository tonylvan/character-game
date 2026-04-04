with open('src/pages/OCRScan.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
print("Line 5:", lines[4].strip())
print("Line 21:", lines[20].strip())

# 检查是否正确
has_correct_comment = '支持局域网访问）' in ''.join(lines)
has_correct_camera = '启动摄像头' in ''.join(lines)

print(f"\nHas correct comment: {has_correct_comment}")
print(f"Has correct camera: {has_correct_camera}")
