var path = require('path');

var gulp = require('gulp');
var through = require('through');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('files', function() {
  gulp
    .src([
      'node_modules/steam/resources/protobufs/steamclient/steammessages_clientserver.proto',
      'node_modules/steam/resources/protobufs/steamclient/steammessages_base.proto',
      'node_modules/steam/resources/protobufs/steamclient/encrypted_app_ticket.proto',
      'node_modules/steam/resources/protobufs/steamclient/steammessages_clientserver_2.proto',
      'node_modules/steam/resources/protobufs/dota/steammessages.proto',
      'node_modules/steam/lib/public.pub',
      'node_modules/steam/resources/steam_language/steammsg.steamd',
      'node_modules/steam/resources/steam_language/header.steamd',
      'node_modules/steam/resources/steam_language/gamecoordinator.steamd',
      'node_modules/steam/resources/steam_language/emsg.steamd',
      'node_modules/steam/resources/steam_language/eresult.steamd',
      'node_modules/steam/resources/steam_language/enums.steamd'
    ])
    .pipe(
      (function () {
        var files = {};
        return through(write, end);
  
        function write (file) {
          files[path.join('/', path.relative(process.cwd(), file.path))] = file.contents.toString();
        }
  
        function end () {
          this.emit('data', JSON.stringify(files));
        }
      })()
    )
    .pipe(source('my-files/files.json'))
    .pipe(gulp.dest('./node_modules'))
    .pipe(through(function (file) {
      console.log(file);
    }));
});

gulp.task('browserify', function() {
  browserify('./index.js', {
      ignoreMissing: true,
      standalone: 'Steam'
    })
    .transform(function (file) {
      var data = '';
      return through(write, end);

      function write (buf) { data += buf }
      function end () {
        this.queue(
          data
            .replace(/('|")fs('|")/g, '"my-fs"')
            .replace(/('|")net('|")/g, '"chrome-net"')
            .replace(/process\.cwd\(/g, 'require("my-process").cwd(')
            .replace(/process\.chdir\(/g, 'require("my-process").chdir(')
            .replace(/('|")bytebuffer('|")/g, '"bytebuffer/dist/ByteBufferNB.js"')
        );
        this.queue(null);
      }
    }, { global: true })
    .bundle()
    .pipe(source('steam.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['files', 'browserify']);