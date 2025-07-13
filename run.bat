@echo off
title Running Next.js App

:: Step 0: Git pull
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Git is not installed. Please install Git first.
    start https://git-scm.com/downloads
    pause
    exit /b
)

echo Pulling latest code from Git...
git pull
echo Code updated.

:: Step 1: Check NodeJS
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js not found. Installing...
    start https://nodejs.org/en/download
    pause
    exit /b
)

:: Step 2: Check dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

:: Step 3: Check NextJS
if not exist "node_modules\.bin\next.cmd" (
    echo Next.js not found in node_modules. Installing manually...
    call npm install next react react-dom
)

:: Step 4: Open browser
start http://localhost:3000

:: Step 5: Start project
echo Starting development server...
call npx next dev

pause
