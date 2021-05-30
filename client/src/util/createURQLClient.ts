import { dedupExchange, cacheExchange, fetchExchange } from '@urql/core'

import { serverURL } from '../config/config'
// import { isServer } from './isServer'

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  //  uncomment if necessary to send cookie to the server. Useful for authentification
  // let cookie = ''
  // if (isServer()) {
  //   cookie = ctx?.req?.headers?.cookie
  // }

  return {
    url: serverURL,
    fetchOptions: {
      credentials: 'include' as const,
      //  this will send a cookie to the server
      // headers: cookie
      //   ? {
      //       cookie,
      //     }
      //   : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange,
      ssrExchange, // Add `ssr` in front of the `fetchExchange`
      fetchExchange,
    ],
  }
}
