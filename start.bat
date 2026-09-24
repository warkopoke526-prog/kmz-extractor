@echo off
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel%==0 (
  start "KMZ Extractor Server" cmd /k py -m http.server 8000
) else (
  where python >nul 2>&1
  if %errorlevel%==0 (
    start "KMZ Extractor Server" cmd /k python -m http.server 8000
  ) else (
    echo Python tidak ditemukan.
    echo Cara paling sederhana: buka index.html langsung di browser.
    pause
    exit /b 1
  )
)
timeout /t 2 >nul
start http://localhost:8000/index.html
