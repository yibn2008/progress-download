'use strict'

const fs = require('fs')
const rimraf = require('rimraf')
const path = require('path')
const assert = require('assert')
const download = require('..')

describe('test progress download', function () {
  this.timeout(20000)

  let cacheDir

  beforeEach(() => {
    cacheDir = path.join(__dirname, '.cache')
    if (fs.existsSync(cacheDir)) {
      rimraf.sync(cacheDir)
    }
    fs.mkdirSync(cacheDir)
  })

  it('should download with progress bar', async function () {
    await download('https://codeload.github.com/yibn2008/fast-sass-loader/zip/master', cacheDir)
  })
})
