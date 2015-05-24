# Steam for Chrome Apps

__IMPORTANT__ This is an experiment library wrapper, it might break in some unexpected way.

This is basically a set of tools and hacks to make [node-steam](https://github.com/seishun/node-steam) run as part of a Chrome App.

## Installation

```
npm install chrome-steam
```

or 

```
bower install chrome-steam
```

or just [download the latest version](https://github.com/Alex7Kom/chrome-steam/releases/latest) from Github.

## Usage

Include `dist/steam.js` or `dist/steam.min.js` in your Chrome App.

Then create an instance of `SteamClient`, call its `logOn` and assign event listeners.

```js
var bot = new Steam.SteamClient();
bot.logOn({
  accountName: 'username',
  password: 'password'
});
bot.on('loggedOn', function() { /* ... */});
```

Check out [node-steam docs](https://github.com/seishun/node-steam/tree/d92b12e0aa63cde3fa5433a93eafefb752f875cf#usage) for information about API.

Note that for your convenience `chrome-steam` exposes Buffer API as `Steam.Buffer` to use in your Chrome App, for example, for handing `shaSentryfile` to `Steam.logOn`.

Check out example to see how to use it if you are unsure.

## Example

`dist/` directory contains a basic example Chrome App. 

In Google Chrome load `dist` subdirectory as unpacked extension, then open `background.html` console and follow the instructions.

## Compile your own

Clone the repo, switch to its directory and do `npm install`.

Install `gulp` and `uglifyjs`, then run `npm run-script make` to compile the project.

## How it is done

* To bundle `node-steam` with all of its dependencies [browserify](http://browserify.org/) is used.

* `node-steam` requires `net.Socket` to function, and that's is why it can't be run in a regular web page or as part of an extension. This example uses [chrome-net](https://github.com/feross/chrome-net) module to utilize `sockets` from Chrome Apps API without changing any `node-steam` code. `sockets` permission is needed for Sockets Chrome API.

* Browser version of [ByteBuffer](https://github.com/dcodeIO/ByteBuffer.js) module uses Array Buffer which is incompatible with Node buffers. This example forces use of Node buffers version of ByteBuffer.

* Since there is no any actual access to file system in ChromeApps, simple `my-fs` and `my-process` substitute modules for `fs.readFileSync()`, `process.cwd()`, and `process.chdir()` are included. gulp reads all necessary files and creates a JSON file which is required by `my-fs`.

* `"https://api.steampowered.com/"` permission is needed for `webLogOn` to work.

Review `node_modules/`, `Gulpfile.js`, and `dist/manifest.json` to see how everything is done.

## Liсense

The MIT License (MIT)

Copyright (c) 2015 Alexey Komarov <alex7kom@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
