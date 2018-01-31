HTML-Templates

To use this CSS Adaptive Framework you need to perform a few simple steps.

First of all, create a new HTML Templates based on this repository
path - folder of the new project, for example: c:\dummy.ru
  template [path]

Go to the build folder and run (npmjs must be already installed):
  npm i --global gulp-cli
  npm i

After that you can start one of the next tasks.

Watch and compile files with browser's live reload
--dev - disables all minifying tasks (it's much faster)
  gulp watch [--dev]

Build project for production:
  gulp build
or:
  gulp