export const ignoreStream = stream => {
  stream.on('error', () => {})
  stream.resume()
}
