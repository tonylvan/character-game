@echo off
echo ========================================
echo   汉字闯关游戏 - 局域网启动脚本
echo ========================================
echo.

REM 获取本机IP地址
for /f "tokens=13" %%i in ('ipconfig ^| findstr /i "IPv4"') do set IP=%%i

echo 你的IP地址是: %IP%
echo.
echo 手机/平板请访问: http://%IP%:5173
echo.
echo 按任意键启动服务器...
pause > nul

cd /d %~dp0character-game
npm run dev