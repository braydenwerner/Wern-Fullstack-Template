import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Provider, createClient } from 'urql'

import { AppProvider } from '../providers/AppProvider'
import { serverURL } from '../config/config'

//  create urql client
const client = createClient({
  url: serverURL,
  //  this will send a cookie to the server
  fetchOptions: {
    credentials: 'include',
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Head>
        <title>Wern Template</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </Provider>
  )
}

export default MyApp
