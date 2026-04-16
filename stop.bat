@echo off
title SlotSync — Stop Servers
color 0C

echo.
echo  Stopping all SlotSync servers...
taskkill /F /IM node.exe >nul 2>&1
echo  Done. All Node.js processes stopped.
echo.
pause
