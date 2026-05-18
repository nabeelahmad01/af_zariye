@echo off
echo Copying images to public folder...
mkdir public 2>nul

copy /Y "C:\Users\Nabil\.gemini\antigravity\brain\b1bf7547-add9-4fee-a63c-60c4a9c46a1e\hero1_1779116588986.png" "public\hero1.jpg"
copy /Y "C:\Users\Nabil\.gemini\antigravity\brain\b1bf7547-add9-4fee-a63c-60c4a9c46a1e\hero2_1779120000852.png" "public\hero2.jpg"
copy /Y "C:\Users\Nabil\.gemini\antigravity\brain\b1bf7547-add9-4fee-a63c-60c4a9c46a1e\hero3_1779120018941.png" "public\hero3.jpg"
copy /Y "C:\Users\Nabil\.gemini\antigravity\brain\b1bf7547-add9-4fee-a63c-60c4a9c46a1e\col1_1779120035642.png" "public\col1.jpg"
copy /Y "C:\Users\Nabil\.gemini\antigravity\brain\b1bf7547-add9-4fee-a63c-60c4a9c46a1e\col2_1779120057203.png" "public\col2.jpg"
copy /Y "C:\Users\Nabil\.gemini\antigravity\brain\b1bf7547-add9-4fee-a63c-60c4a9c46a1e\col3_1779120074560.png" "public\col3.jpg"
copy /Y "C:\Users\Nabil\.gemini\antigravity\brain\b1bf7547-add9-4fee-a63c-60c4a9c46a1e\about1_1779120089044.png" "public\about1.jpg"
copy /Y "C:\Users\Nabil\.gemini\antigravity\brain\b1bf7547-add9-4fee-a63c-60c4a9c46a1e\about2_1779120110777.png" "public\about2.jpg"
copy /Y "C:\Users\Nabil\.gemini\antigravity\brain\b1bf7547-add9-4fee-a63c-60c4a9c46a1e\shop_banner_1779120124905.png" "public\shop-banner.jpg"
copy /Y "C:\Users\Nabil\.gemini\antigravity\brain\b1bf7547-add9-4fee-a63c-60c4a9c46a1e\af_zariye_logo_1779096390847.png" "public\logo.png"

echo.
echo Images copied successfully!
echo.
echo Now installing dependencies...
npm install
echo.
echo Done! Run 'npm run dev' to start the development server.
pause
