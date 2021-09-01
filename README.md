# Unifrontend

Responsive CSS Framework and Sample HTML Templates.

Yeah, it's yet another but a little strange CSS *less*-based framework with HTML boilerplate for comfortable web development.
It supports *the latest 5 versions of all browsers* and many devices, including smartphones and tablets. This is not to say that Unifrontend kit cannot be used in browsers older than those reflected, but merely that our focus will be on ensuring our layouts work great in the above.


## Sample HTML Templates

There are some HTML templates that can help you to fast create typical pages of your site:

* `index.htm` - the default starting point, with basic layout
* `404.htm` - typical page that will be displayed when clicking on a incorrect link to the site
* `articles-list.htm` - list of articles
* `articles-item.htm` - one article
* `contacts.htm` - contacts' page
* `galleries-list.htm` - list of image galleries
* `galleries-item.htm` - one gallery
* `info.htm` - simple text page with a links to another pages of the same or nested level
* `news-list.htm` - list of news
* `news-item.htm` - one news
* `resources-list.htm` - list of links' catalogue
* `resources-item.htm` - one section of links' catalogue
* `search-results.htm` - page with search results output


## Installation

To take advantage of Unifrontend you need to perform a few simple steps.

1. Install the dependencies if you don't already have them:
   - Download and install [Node.js](http://nodejs.org)
   - Open up a terminal and type in the following:
```
npm install --global gulp-cli
```
2. Clone this repo and create a new Unifrontend kit anywhere you want to start a new project, e.g.:
```
template c:\dummy.ru
```
Unfortunately, it's just for Windows OS users only, but instead you can to copy all necessary files manually.
3. Go to the folder with a new project and run:
```
cd build
npm install
```

That's it! You should now have everything needed to use this kit!


## Usage

After that, you can start to creating a new project and run one of the following tasks to build it.

Go to the *build* folder if you are not already there:
```
cd build
```


### Watch and compile files with browser's live reload
```
gulp watch
```

This outputs an IP address you can use to locally test and another that can be used on devices connected to your network.

Faster version of the same command that disables all minifying tasks and processing the images:
```
gulp watch --dev
```

### Build project for production
```
gulp build
```
or just:
```
gulp
```