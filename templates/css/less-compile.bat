@echo off

rem Compiles all less files to single css (simple or minified)
rem Use with nodejs component (less)

cd ..
less css/less/_styles.less %~1 > ../styles.css