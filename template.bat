@echo off

if "%1" EQU "" goto error
xcopy "app" "%~1" /i /s /e /y /exclude:exclude.txt
copy "app\index.htm" "%~1" /y
exit

:error
echo ERROR: You must specify the folder in which you want to create new HTML Templates.