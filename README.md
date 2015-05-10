# Steam for Chrome Apps

This is basically a set of tools and hacks to make [node-steam](https://github.com/seishun/node-steam) run as part of a Chrome App.

## How to use this example

Install [gulp](http://gulpjs.com/).

Clone the repo, switch to its directory and do `npm install`.

Run `gulp` to compile the project.

In Google Chrome load `dist` subdirectory as unpacked extension, then open `background.html` console and follow the instructions.

## Short review

* `main.js` is just an example. Note how `shaSentryfile` is handled in this example. Check out [node-steam](https://github.com/seishun/node-steam) docs to see how to use its API.

* To bundle `node-steam` with all of its dependencies [browserify](http://browserify.org/) is used.

* `node-steam` requires `net.Socket` to function, and that's is why it can't be run in a regular web page or as part of an extension. This example uses [chrome-net](https://github.com/feross/chrome-net) module to utilize `sockets` from Chrome Apps API without changing any `node-steam` code. `sockets` permission is needed for Sockets Chrome API.

* Browser version of [ByteBuffer](https://github.com/dcodeIO/ByteBuffer.js) module uses Array Buffer which is incompatible with Node buffers. This example forces use of Node buffers version of ByteBuffer.

* Since there is no any actual access to file system in ChromeApps, simple `my-fs` and `my-process` substitute modules for `fs.readFileSync()`, `process.cwd()`, and `process.chdir()` are included. gulp reads all necessary files and creates a JSON file which is required by `my-fs`.

* `"https://api.steampowered.com/"` permission is needed for `webLogOn` to work.

Review `node_modules/`, `Gulpfile.js`, and `dist/manifest.json` to see how everything is done.

## Liсense

MIT
