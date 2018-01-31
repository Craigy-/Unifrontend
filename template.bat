@echo off

if "%1" EQU "" goto error
xcopy "templates" "%~1" /i /s /e /y /exclude:exclude.txt
copy "templates\index.htm" "%~1" /y
exit

:error
echo ERROR: You must specify the folder in which you want to create new HTML Templates.