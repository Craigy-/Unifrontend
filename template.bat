@echo off

rem Create new HTML5 template based on this repository
rem Usage: template X:\dummy.ru\html\total

if "%1" EQU "" goto error
xcopy "templates" "%~1" /i /s /e /y /exclude:exclude.txt
copy "templates\index.htm" "%1" /y
exit

:error
echo ERROR: You must specify the folder in which you want to copy HTML5 template.