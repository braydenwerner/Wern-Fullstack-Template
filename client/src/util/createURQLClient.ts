import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
} from '@urql/core'

import { serverURL } from '../config/config'
import { isServer } from './isServer'

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = ''
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie
  }

  return {
    url: serverURL,
    //  this will send a cookie to the server
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange,
      ssrExchange, // Add `ssr` in front of the `fetchExchange`
      fetchExchange,
    ],
  }
}
