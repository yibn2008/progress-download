'use strict'

const download = require('download')
const debug = require('debug')('progress-download')
const ProgressBar = require('progress')
const filesize = require('filesize')
const tty = require('tty')

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
  let start = Date.now()
  let bar, dot

  stream.on('response', resp => {
    if (!resp.headers['content-length'] || !tty.isatty(2)) {
      dot = new Dot()

      debug('current task/env does not support progress bar, create dot')
    } else {
      let total = parseInt(resp.headers['content-length'], 10)
      bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 25,
        renderThrottle: 300,
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
    debug('time cost: %ss', (Date.now() - start) / 1000)
  })

  stream.on('error', err => {
    if (dot) {
      dot.done(err)
    }
  })

  return stream
}
