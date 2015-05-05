@echo off

rem Starts a simple file watcher for less files
rem Use with nodejs components (less, less-plugin-clean-css, less-watchr)

echo Less is watching for changes. Press Ctrl-C to stop.
echo.
cd ..
less-watchr --path css --fileToCompile css/less/_styles.less --outputFilename ../styles.css --options="--clean-css="--compatibility=ie8 --advanced" --strict-math=on"
exit