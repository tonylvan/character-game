# 修复 HandwritingBoard.tsx 函数顺序问题

with open('src/pages/HandwritingBoard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 找到需要移动的代码块
useeffect_start = -1
useeffect_end = -1
drawgrid_start = -1
drawgrid_end = -1

for i, line in enumerate(lines):
    if '// 初始化画布' in line:
        useeffect_start = i
    if '// 绘制田字格' in line and drawgrid_start == -1:
        drawgrid_start = i

# 找到 useEffect 的结束
if useeffect_start >= 0:
    for i in range(useeffect_start, len(lines)):
        if '}, [])' in lines[i]:
            useeffect_end = i
            break

# 找到 drawGrid 函数的结束
if drawgrid_start >= 0:
    brace_count = 0
    for i in range(drawgrid_start, len(lines)):
        brace_count += lines[i].count('{') - lines[i].count('}')
        if brace_count == 0 and '}' in lines[i]:
            drawgrid_end = i
            break

print(f"useEffect: {useeffect_start + 1} - {useeffect_end + 1}")
print(f"drawGrid: {drawgrid_start + 1} - {drawgrid_end + 1}")

if useeffect_start >= 0 and drawgrid_start > useeffect_start:
    # 提取 drawGrid 函数
    drawgrid_func = lines[drawgrid_start:drawgrid_end + 1]
    
    # 删除原来的 drawGrid
    del lines[drawgrid_start:drawgrid_end + 1]
    
    # 在 useState 之后插入 drawGrid
    insert_pos = -1
    for i, line in enumerate(lines):
        if 'useState' in line and i < useeffect_start:
            insert_pos = i + 1
            break
    
    if insert_pos:
        # 插入空行和 drawGrid 函数
        lines.insert(insert_pos, '\n')
        for i, func_line in enumerate(drawgrid_func):
            lines.insert(insert_pos + 1 + i, func_line)
        
        # 写回文件
        with open('src/pages/HandwritingBoard.tsx', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        
        print('Fixed function order!')
