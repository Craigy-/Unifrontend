@echo off

rem Starts a simple file watcher for less files
rem Use with nodejs scripts (lessc, less-watchr))

echo Less is watching for changes. Press Ctrl-C to stop.
echo.
cd ..
less-watchr --path css/less --fileToCompile css/less/styles.less --outputFilename ../styles.css --options="--yui-compress --strict-math=on"