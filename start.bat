@echo off
title SlotSync — Dev Server Launcher
color 0A

echo.
echo  ==========================================
echo   SlotSync ^| Scheduling Platform
echo  ==========================================
echo.

:: ── Kill any existing instances ─────────────
echo [1/3] Stopping any existing dev servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 >nul

:: ── Start Backend ────────────────────────────
echo [2/3] Starting Backend API (port 5000)...
start "SlotSync Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 3 >nul

:: ── Start Frontend ───────────────────────────
echo [3/3] Starting Frontend (port 3000)...
start "SlotSync Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 5 >nul

:: ── Open in browser ──────────────────────────
echo.
echo  ==========================================
echo   App is starting!
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:5000
echo   Health   : http://localhost:5000/health
echo  ==========================================
echo.
echo  Opening browser in 4 seconds...
timeout /t 4 >nul
start http://localhost:3000

echo.
echo  Both servers are running in separate windows.
echo  Close those windows to stop the servers.
echo.
pause
