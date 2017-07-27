'use strict'

const fs = require('fs')
const rimraf = require('rimraf')
const path = require('path')
const assert = require('assert')
const cp = require('child_process')
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
    await download('https://github.com/yibn2008/progress-download/archive/master.zip', cacheDir)

    cp.execSync('tar -zxf master.zip', {
      cwd: cacheDir
    })
  })
})
