@echo off

rem Compiles all less files to a single minified css
rem Use with nodejs components (less, less-plugin-clean-css)

lessc less/_styles.less --clean-css="--advanced" --strict-math=on > styles.css