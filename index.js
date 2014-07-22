var zlib = require('zlib')
var tar = require('tar-stream')
var concat = require('concat-stream')

exports = module.exports = function (input, matchers, cb) {

  var n = 1
  var waiting = {}
  var zstream = zlib.createGunzip()
    .on('error', done)

  var extract = tar.extract()
    .on('error', done)
    .on('entry', function (header, stream, next) {
      for(var k in matchers) {
        if(matchers[k].test(header.name))
          return (function (matcher, i) {
            stream.pipe(concat(function (data) {
              header.source = data.toString('utf8')
              header.pattern = matcher
              waiting[k] = header
              next()
            }))
          })(matchers[k], k)
      }
      stream.resume()
      next()
    })
    .on('finish', done)


  function done(err) {
    if(--n) return
    cb(err, waiting)
  }

  zstream.pipe(extract)

  if(Buffer.isBuffer(input)) {
    console.log('EXTRACT >FROM BUFFER', input.length)
    zstream.write(input)
    zstream.end()
  }
  else
    input.pipe(zstream)
}

exports.package = /^[^/]*\/package.json$/
exports.readme  = /^[^/]*\/readme(\.(md|markdown|txt))?$/i,
exports.license = /^[^/]*\/LICEN(S|C)E$/i

if(!module.parent) {
  var stream =
    module.exports(process.stdin, exports, function (err, out) {
      if(err) throw err
      console.log(out)
    })

}
