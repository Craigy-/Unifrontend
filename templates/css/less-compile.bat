@echo off

rem Compiles all less files to a single css
rem Use with nodejs component (less)

lessc less/_styles.less --strict-math=on > styles.css