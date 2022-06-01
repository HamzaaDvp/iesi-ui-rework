import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import {swrConfig} from "@app/lib/swr";

function MyApp({ Component, pageProps }: AppProps) {
  return <SWRConfig value={swrConfig}>
    <Component {...pageProps} />
  </SWRConfig>
}

export default MyApp
