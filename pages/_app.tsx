import React from 'react';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import swrConfig from '@app/lib/swr';
import Appshell from '@app/components/AppShell';
import { SnackbarProvider } from 'notistack';
import { SnackbarUtilsConfigurator } from '@app/lib/snackbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'top',
      }}
    >
      <SnackbarUtilsConfigurator />
      <SWRConfig value={swrConfig}>
        <Appshell>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </Appshell>
      </SWRConfig>
    </SnackbarProvider>
  );
}

export default MyApp;
