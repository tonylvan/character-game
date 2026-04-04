"""
修复 HandwritingBoard.tsx - 将 drawGrid 函数移到 useEffect 之前
"""
import re

# 读取文件
with open('src/pages/HandwritingBoard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到 drawGrid 函数定义
drawgrid_pattern = r'(  // 绘制田字格背景\n  const drawGrid = .*?ctx\.setLineDash\(\[\])\n  \})'
drawgrid_match = re.search(drawgrid_pattern, content, re.DOTALL)

if not drawgrid_match:
    print('Could not find drawGrid function')
    exit(1)

drawgrid_func = drawgrid_match.group(1)

# 找到 useEffect
useeffect_pattern = r'(  // 初始化画布\n  useEffect\(\(\) => \{.*?drawGrid\(ctx, canvas\.width, canvas\.height\)\n  \}, \[\]))'
useeffect_match = re.search(useeffect_pattern, content, re.DOTALL)

if not useeffect_match:
    print('Could not find useEffect')
    exit(1)

useeffect_code = useeffect_match.group(1)

# 删除原来的 drawGrid 和 useEffect
content = content.replace(drawgrid_func, '')
content = content.replace(useeffect_code, '')

# 在 useState 之后插入 drawGrid
lines = content.split('\n')
insert_pos = -1
for i, line in enumerate(lines):
    if 'useState' in line and i < 50:  # 在前 50 行找
        insert_pos = i + 1
        break

if insert_pos > 0:
    # 插入 drawGrid 函数
    lines.insert(insert_pos, '')
    lines.insert(insert_pos + 1, drawgrid_func)
    
    # 插入 useEffect
    lines.insert(insert_pos + 2, '')
    lines.insert(insert_pos + 3, useeffect_code)
    
    # 写回文件
    with open('src/pages/HandwritingBoard.tsx', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    print('Fixed! drawGrid moved before useEffect')
else:
    print('Could not find insert position')
