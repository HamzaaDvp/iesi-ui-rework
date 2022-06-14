import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import {swrConfig} from "@app/lib/swr";
import Appshell from "@app/components/AppShell";

function MyApp({ Component, pageProps }: AppProps) {
  return <SWRConfig value={swrConfig}>
    <Appshell>
      <Component {...pageProps} />
    </Appshell>
  </SWRConfig>
}

export default MyApp
