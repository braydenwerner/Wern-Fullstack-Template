import { processRequest as defaultProcessRequest } from './processRequest'
export const graphqlUploadExpress = ({
  processRequest = defaultProcessRequest,
  ...processRequestOptions
} = {}) => (request, response, next) => {
  if (!request.is('multipart/form-data')) return next()
  const finished = new Promise(resolve => request.on('end', resolve))
  const { send } = response

  response.send = (...args) => {
    finished.then(() => {
      response.send = send
      response.send(...args)
    })
  }

  processRequest(request, response, processRequestOptions)
    .then(body => {
      request.body = body
      next()
    })
    .catch(error => {
      if (error.status && error.expose) response.status(error.status)
      next(error)
    })
}
