@echo off

rem Compiles all less files to a single css (simple or minified)
rem Use with nodejs component (less)

lessc less/_styles.less --strict-math=on %~1 > styles.css