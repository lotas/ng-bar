# Angular Debug Toolbar

## Features

Just though it would be nice to have such tool that would show some usefull info for an angular.js developer:

* memory used (only in chrome)
* Scopes count
* Scopes watchers count (to make you feel bad for having lots of them)
* Angular version
* Angular modules
* Angular services
* Angular forms
* Router info (ngRoute, ui.router registered states & routes)

TODO:
* active http requests
* errors happening
* included templates ($tempalteCache fun)



## Install

* Clone this repository
* Using bower:

	bower install ng-bar


Install dev-dependencies with

	npm install



## Build

Build with:

	npm run build

## Usage

Simply add this:

	<script src="ng-bar.js"></script>


## Ideas from

https://github.com/paulirish/memory-stats.js

https://github.com/livingobjects/angular-memory-stats

https://github.com/kentcdodds/ng-stats

http://blog.ionic.io/angularjs-console/


## License

MIT

## Author

Yaraslau Kurmyza <yaraslau.kurmyza@crosslend.com>


### Why

Despite the fact that we have an awesome Batarang Angular.js chrome extension, we still need more information during development.
We need to see memory information, scopes information and various additional info, that is not directly accessible in other tools
