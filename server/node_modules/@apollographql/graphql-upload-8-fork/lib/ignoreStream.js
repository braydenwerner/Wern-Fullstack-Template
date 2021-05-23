'use strict'

exports.__esModule = true
exports.ignoreStream = void 0

const ignoreStream = stream => {
  stream.on('error', () => {})
  stream.resume()
}

exports.ignoreStream = ignoreStream
