'use strict'

exports.__esModule = true
exports.graphqlUploadKoa = void 0

var _processRequest = require('./processRequest')

const graphqlUploadKoa = ({
  processRequest = _processRequest.processRequest,
  ...processRequestOptions
} = {}) => async (ctx, next) => {
  if (!ctx.request.is('multipart/form-data')) return next()
  const finished = new Promise(resolve => ctx.req.on('end', resolve))

  try {
    ctx.request.body = await processRequest(
      ctx.req,
      ctx.res,
      processRequestOptions
    )
    await next()
  } finally {
    await finished
  }
}

exports.graphqlUploadKoa = graphqlUploadKoa
