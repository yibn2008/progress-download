# progress-download

download file with progress bar

## Screenshot



## CLI

### Install

Install as a global module

```bash
$ npm install progress-download -g
```

### Usage

Use `download` command to download a `url`

```bash
$ download -h

  Usage: download [options] <url>

  download file with progress bar (like wget)


  Options:

    -V, --version        output the version number
    -o, --output <name>  output file name
    -h, --help           output usage information

  Examples:

    $ download http://example.com/foobar.zip
    $ download http://example.com/foobar.zip -o xxx.zip

```

## Node API

### Usage

Use it like [download](https://github.com/kevva/download) module

```js
const download = require('progress-download')

let url = 'https://github.com/tj/commander.js/archive/master.zip'
let filename = 'commander.zip'
download(url, {
  filename
}).then(() => {
  console.log('download succeed')
}, err => {
  console.log('download failed')
})
```

### API

```js
download(url, [destination], [options])
```

- url: url to download
- destination: path where you download to
- options: more other download options

same API as [download api](https://github.com/kevva/download#api)

## License

MIT
