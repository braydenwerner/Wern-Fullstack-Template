'use strict'

exports.__esModule = true
exports.isEnumerableObject = void 0

const isEnumerableObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

exports.isEnumerableObject = isEnumerableObject
