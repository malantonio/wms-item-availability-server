var http = require('http')
var url = require('url')
var fs = require('fs')
var WSKey = require('oclc-wskey')
var ItemAvailability = require('wms-item-availability')

var key = WSKey(process.env['WSKEY_PUBLIC'], process.env['WSKEY_SECRET'])
var avail = ItemAvailability(key, process.env['INST_ID'])

var validreg = /^\/oclc\/([0-9]+)$/
var baseurl = process.env['BASE_URL'] || '/'
var port = process.env['PORT'] || 8880

var server = http.createServer(function (req, res) {
    var parsed = url.parse(req.url)
    var m = parsed.path.match(validreg)

    if (m) {
        var num = m[1]
        var stat, out
        avail.query(num, function (err, holdings) {
            if (err) {
                stat = err.statusCode
                out = { error: err.message }
            } else {
                var isAvailable = hasAvailableHolding(holdings)
                stat = 200
                out = { oclcNumber: num, availableNow: isAvailable, holdings: holdings }
            }

            res.writeHead(stat, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' })
            return res.end(JSON.stringify(out))
        })
    } else {
        if (parsed.path === baseurl) {
            return fs.createReadStream('./info.txt').pipe(res)
        }

        res.writeHead(301, {Location: 'http://' + req.headers.host + baseurl})
        return res.end()
    }

}).listen(port, function () { console.log('listening on ' + port) })

function hasAvailableHolding (h) {
    for (var i = 0; i < h.length; i++)
        for (var c = 0; c < h[i].circulations.length; c++)
            if (h[i].circulations[c].availableNow) return true

    return false
}
