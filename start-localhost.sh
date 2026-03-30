#!/bin/bash
# 汉字闯关游戏 - 局域网启动脚本

# 获取本机IP地址 (Mac/Linux)
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo "========================================"
echo "  汉字闯关游戏 - 局域网启动脚本"
echo "========================================"
echo ""
echo "你的IP地址是: $IP"
echo ""
echo "手机/平板请访问: http://$IP:5173"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

cd "$(dirname "$0")/character-game"
npm run dev