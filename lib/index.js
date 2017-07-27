'use strict'

const download = require('download')
const debug = require('debug')('progress-download')
const ProgressBar = require('progress')
const filesize = require('filesize')

class Dot {
  constructor (prefix) {
    this._count = 0
    this._lastTick = 0

    process.stdout.write('  downloading ')
  }

  tick (size) {
    if (size) {
      this._count += size
    }

    if (Date.now() - this._lastTick > 300) {
      process.stdout.write('.')
      this._lastTick = Date.now()
    }
  }

  done (err) {
    if (err) {
      process.stdout.write(' failed\n')
    } else {
      process.stdout.write(' done, total ' + filesize(this._count) + '\n')
    }
  }
}

module.exports = function (url, dest, opts) {
  let stream = download(url, dest, opts)
  let bar, dot

  stream.on('response', resp => {
    if (!resp.headers['content-length']) {
      dot = new Dot()

      debug('response header "content-length" does not exists, create dot')
    } else {
      let total = parseInt(resp.headers['content-length'], 10)
      bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 25,
        total: total
      })

      debug('create progress bar with total = %s', total)
    }
  })

  stream.on('data', chunk => {
    if (bar) {
      bar.tick(chunk.length)
    } else if (dot) {
      dot.tick(chunk.length)
    }
  })

  stream.on('end', () => {
    if (dot) {
      dot.done()
    }
  })

  stream.on('error', err => {
    if (dot) {
      dot.done(err)
    }
  })

  return stream
}
