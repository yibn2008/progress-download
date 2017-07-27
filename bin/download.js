#!/usr/bin/env node

'use strict'

const program = require('commander')
const download = require('..')
const pkg = require('../package.json')
const chalk = require('chalk')

program
  .version(pkg.version)
  .description('download file with progress bar (like wget)')
  .usage('[options] <url>')
  .option('-o, --output <name>', 'output file name')
  .arguments('<url>')
  .on('--help', () => {
    console.log()
    console.log('  Examples:')
    console.log()
    console.log('    $ download http://example.com/foobar.zip')
    console.log('    $ download http://example.com/foobar.zip -o xxx.zip')
    console.log()
  })
  .parse(process.argv)

let url = program.args[0]
let opts = program.opts()

if (!url) {
  console.error(chalk.red('[i] download url is invalid!'))
  program.help()
} else {
  // output filename
  let dlOpts = {}
  if (opts.output) {
    dlOpts.filename = opts.output
  }

  download(url, process.cwd(), dlOpts)
    .catch(err => {
      console.error('download error: %s', chalk.red(err))
    })
}
