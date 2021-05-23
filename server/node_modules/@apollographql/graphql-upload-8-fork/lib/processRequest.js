'use strict'

exports.__esModule = true
exports.processRequest = void 0

var _util = _interopRequireDefault(require('util'))

var _busboy = _interopRequireDefault(require('busboy'))

var _fsCapacitor = require('fs-capacitor')

var _httpErrors = _interopRequireDefault(require('http-errors'))

var _objectPath = _interopRequireDefault(require('object-path'))

var _constants = require('./constants')

var _ignoreStream = require('./ignoreStream')

var _isEnumerableObject = require('./isEnumerableObject')

// istanbul ignore next
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

class Upload {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = file => {
        this.file = file
        resolve(file)
      }

      this.reject = reject
    })
    this.promise.catch(() => {})
  }
}

const processRequest = (
  request,
  response,
  { maxFieldSize = 1000000, maxFileSize = Infinity, maxFiles = Infinity } = {}
) =>
  new Promise((resolve, reject) => {
    let released
    let exitError
    let currentStream
    let operations
    let operationsPath
    let map
    const parser = new _busboy.default({
      headers: request.headers,
      limits: {
        fieldSize: maxFieldSize,
        fields: 2,
        fileSize: maxFileSize,
        files: maxFiles
      }
    })

    const exit = error => {
      if (exitError) return
      exitError = error
      reject(exitError)
      parser.destroy()
      if (currentStream) currentStream.destroy(exitError)
      if (map)
        for (const upload of map.values())
          if (!upload.file) upload.reject(exitError)
      request.unpipe(parser)
      setImmediate(() => {
        request.resume()
      })
    }

    const release = () => {
      // istanbul ignore next
      if (released) return
      released = true
      if (map)
        for (const upload of map.values())
          if (upload.file) upload.file.capacitor.destroy()
    }

    const abort = () => {
      exit(
        (0, _httpErrors.default)(
          499,
          'Request disconnected during file upload stream parsing.'
        )
      )
    }

    parser.on(
      'field',
      (fieldName, value, fieldNameTruncated, valueTruncated) => {
        if (exitError) return
        if (valueTruncated)
          return exit(
            (0, _httpErrors.default)(
              413,
              `The ‘${fieldName}’ multipart field value exceeds the ${maxFieldSize} byte size limit.`
            )
          )

        switch (fieldName) {
          case 'operations':
            try {
              operations = JSON.parse(value)
            } catch (error) {
              return exit(
                (0, _httpErrors.default)(
                  400,
                  `Invalid JSON in the ‘operations’ multipart field (${_constants.SPEC_URL}).`
                )
              )
            }

            if (
              !(0, _isEnumerableObject.isEnumerableObject)(operations) &&
              !Array.isArray(operations)
            )
              return exit(
                (0, _httpErrors.default)(
                  400,
                  `Invalid type for the ‘operations’ multipart field (${_constants.SPEC_URL}).`
                )
              )
            operationsPath = (0, _objectPath.default)(operations)
            break

          case 'map': {
            if (!operations)
              return exit(
                (0, _httpErrors.default)(
                  400,
                  `Misordered multipart fields; ‘map’ should follow ‘operations’ (${_constants.SPEC_URL}).`
                )
              )
            let parsedMap

            try {
              parsedMap = JSON.parse(value)
            } catch (error) {
              return exit(
                (0, _httpErrors.default)(
                  400,
                  `Invalid JSON in the ‘map’ multipart field (${_constants.SPEC_URL}).`
                )
              )
            }

            if (!(0, _isEnumerableObject.isEnumerableObject)(parsedMap))
              return exit(
                (0, _httpErrors.default)(
                  400,
                  `Invalid type for the ‘map’ multipart field (${_constants.SPEC_URL}).`
                )
              )
            const mapEntries = Object.entries(parsedMap)
            if (mapEntries.length > maxFiles)
              return exit(
                (0, _httpErrors.default)(
                  413,
                  `${maxFiles} max file uploads exceeded.`
                )
              )
            map = new Map()

            for (const [fieldName, paths] of mapEntries) {
              if (!Array.isArray(paths))
                return exit(
                  (0, _httpErrors.default)(
                    400,
                    `Invalid type for the ‘map’ multipart field entry key ‘${fieldName}’ array (${_constants.SPEC_URL}).`
                  )
                )
              map.set(fieldName, new Upload())

              for (const [index, path] of paths.entries()) {
                if (typeof path !== 'string')
                  return exit(
                    (0, _httpErrors.default)(
                      400,
                      `Invalid type for the ‘map’ multipart field entry key ‘${fieldName}’ array index ‘${index}’ value (${_constants.SPEC_URL}).`
                    )
                  )

                try {
                  operationsPath.set(path, map.get(fieldName).promise)
                } catch (error) {
                  return exit(
                    (0, _httpErrors.default)(
                      400,
                      `Invalid object path for the ‘map’ multipart field entry key ‘${fieldName}’ array index ‘${index}’ value ‘${path}’ (${_constants.SPEC_URL}).`
                    )
                  )
                }
              }
            }

            resolve(operations)
          }
        }
      }
    )
    parser.on('file', (fieldName, stream, filename, encoding, mimetype) => {
      if (exitError) {
        ;(0, _ignoreStream.ignoreStream)(stream)
        return
      }

      if (!map) {
        ;(0, _ignoreStream.ignoreStream)(stream)
        return exit(
          (0, _httpErrors.default)(
            400,
            `Misordered multipart fields; files should follow ‘map’ (${_constants.SPEC_URL}).`
          )
        )
      }

      currentStream = stream
      stream.on('end', () => {
        currentStream = null
      })
      const upload = map.get(fieldName)

      if (!upload) {
        ;(0, _ignoreStream.ignoreStream)(stream)
        return
      }

      const capacitor = new _fsCapacitor.WriteStream()
      capacitor.on('error', () => {
        stream.unpipe()
        stream.resume()
      })
      stream.on('limit', () => {
        stream.unpipe()
        capacitor.destroy(
          (0, _httpErrors.default)(
            413,
            `File truncated as it exceeds the ${maxFileSize} byte size limit.`
          )
        )
      })
      stream.on('error', error => {
        stream.unpipe() // istanbul ignore next

        capacitor.destroy(exitError || error)
      })
      stream.pipe(capacitor)
      const file = {
        filename,
        mimetype,
        encoding,

        createReadStream() {
          const error = capacitor.error || (released ? exitError : null)
          if (error) throw error
          return capacitor.createReadStream()
        }
      }
      let capacitorStream
      Object.defineProperty(file, 'stream', {
        get: _util.default.deprecate(function() {
          if (!capacitorStream) capacitorStream = this.createReadStream()
          return capacitorStream
        }, 'File upload property ‘stream’ is deprecated. Use ‘createReadStream()’ instead.')
      })
      Object.defineProperty(file, 'capacitor', {
        value: capacitor
      })
      upload.resolve(file)
    })
    parser.once('filesLimit', () =>
      exit(
        (0, _httpErrors.default)(413, `${maxFiles} max file uploads exceeded.`)
      )
    )
    parser.once('finish', () => {
      request.unpipe(parser)
      request.resume()
      if (!operations)
        return exit(
          (0, _httpErrors.default)(
            400,
            `Missing multipart field ‘operations’ (${_constants.SPEC_URL}).`
          )
        )
      if (!map)
        return exit(
          (0, _httpErrors.default)(
            400,
            `Missing multipart field ‘map’ (${_constants.SPEC_URL}).`
          )
        )

      for (const upload of map.values())
        if (!upload.file)
          upload.reject(
            (0, _httpErrors.default)(400, 'File missing in the request.')
          )
    })
    parser.once('error', exit)
    response.once('finish', release)
    response.once('close', release)
    request.once('close', abort)
    request.once('end', () => {
      request.removeListener('close', abort)
    })
    request.pipe(parser)
  })

exports.processRequest = processRequest
