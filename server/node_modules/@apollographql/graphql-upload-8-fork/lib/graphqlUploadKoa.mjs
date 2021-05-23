import { processRequest as defaultProcessRequest } from './processRequest'
export const graphqlUploadKoa = ({
  processRequest = defaultProcessRequest,
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
