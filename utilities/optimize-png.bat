@echo off

rem Optimize PNG from 'files\*.png' (all files will be replaced)
rem Use with optipng.exe and pngout.exe (for Windows 32-bit OS)

path programs
for /F "usebackq" %%f in (`dir /B files\*.png`) do (
optipng -o7 files\%%f )
for /F "usebackq" %%f in (`dir /B files\*.png`) do (
pngout files\%%f files\%%f.op-stub.png
del /F /Q files\%%f
rename files\%%f.op-stub.png %%f )