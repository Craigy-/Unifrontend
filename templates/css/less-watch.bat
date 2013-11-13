@echo off

rem Starts a simple file watcher for less files
rem Use with nodejs scripts (lessc, less-watchr)

echo Less is watching for changes. Press Ctrl-C to stop.
echo.
cd ..
less-watchr --path css/less --fileToCompile css/less/_styles.less --outputFilename ../styles.css --options="-x --strict-math=on"