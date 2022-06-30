import { SWRConfiguration } from 'swr';
import { authenticatedClient, internalClient } from '@app/lib/requestWrapper';
import { ExpiredTokenError } from '@app/throwables/auth';
import API_URLS from '@app/constants/api/urls';
import { ISessionToken } from '@app/types/auth';
import { AxiosResponse } from 'axios';

const swrConfig: SWRConfiguration = {
  fetcher: authenticatedClient,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onErrorRetry: async (err, key, config, revalidate) => {
    if (err instanceof ExpiredTokenError) {
      const sessionTokenRes: AxiosResponse<ISessionToken> = await internalClient.get('/api/token');
      await internalClient.post(API_URLS.LOGIN, null, {
        params: {
          grant_type: 'refresh_token',
          client_id: 'iesi',
          client_secret: 'iesi',
          refresh_token: sessionTokenRes.data.refresh_token,
        },
      });
      await revalidate();
    }
  },
};

export default swrConfig;
