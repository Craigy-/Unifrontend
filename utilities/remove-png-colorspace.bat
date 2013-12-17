@echo off

rem Remove colorspaces from 'files\*.png' (all files will be replaced)
rem Use with pngcrush.exe (for Windows 32-bit OS)

path programs
for /F "usebackq" %%f in (`dir /B files\*.png`) do (
pngcrush -rem gAMA -rem cHRM -rem iCCP -rem sRGB files\%%f files\%%f.rpcs-stub
del /F /Q files\%%f
rename files\%%f.rpcs-stub %%f )