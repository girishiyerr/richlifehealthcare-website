@echo off
echo ========================================
echo   Preparing files for GitHub upload
echo ========================================
echo.

echo Creating backup folder...
if not exist "github-upload" mkdir "github-upload"

echo Copying website files...
copy "index.html" "github-upload\"
copy "styles.css" "github-upload\"
copy "script.js" "github-upload\"
copy "performance.js" "github-upload\"
copy "sw.js" "github-upload\"
copy "logo.svg" "github-upload\"
copy ".htaccess" "github-upload\"
copy ".gitignore" "github-upload\"
copy "README.md" "github-upload\"

echo Copying PHOTOS folder...
xcopy "PHOTOS" "github-upload\PHOTOS\" /E /I /Y

echo.
echo ========================================
echo   Files ready for GitHub upload!
echo ========================================
echo.
echo Your files are now in the "github-upload" folder.
echo Upload this entire folder to your GitHub repository.
echo.
echo Files included:
echo ✅ index.html
echo ✅ styles.css
echo ✅ script.js
echo ✅ performance.js
echo ✅ sw.js
echo ✅ logo.svg
echo ✅ .htaccess
echo ✅ .gitignore
echo ✅ README.md
echo ✅ PHOTOS/ (entire folder)
echo.
pause 