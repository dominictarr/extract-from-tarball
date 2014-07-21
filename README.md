# extract-from-tarball

pull files that match a given pattern out of a tarball.

``` js
var xft = require('extract-from-tarball')

//pass in a stream or buffer,
//a object of patterns,
//and a cb
xft(process.stdin, {
  readme: /readme/i
}, function (err, output) {
  if(err) throw err
  console.log(output.readme)
})
```

Since I need this for npmd, there are also builtin patterns
for extracting data from npm modules.
just use: `xft(steam, xft, cb)` to get the readme, the package,
and the license out of a module tarball.

The match will be the first file matching the pattern.

## License

MIT
