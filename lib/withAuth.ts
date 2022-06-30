import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { unauthenticatedClient } from '@app/lib/requestWrapper';
import API_URLS from '@app/constants/api/urls';
import { EconnRefusedError, ExpiredTokenError } from '@app/throwables/auth';
import { withSessionSsr } from '@app/lib/withSession';
import { encodeQueryParams } from '@app/lib/urlUtils';
import UI_URLS from '@app/constants/ui/urls';
import { AxiosResponse } from 'axios';
import { ISessionToken } from '@app/types/auth';

async function sendRequest(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<unknown>> {
  try {
    await unauthenticatedClient.get(API_URLS.CHECK_TOKEN, {
      params: {
        token: context.req.session.access_token,
      },
    });
  } catch (err: unknown) {
    let destination = `${UI_URLS.LOGIN}?${encodeQueryParams({
      callbackUrl: context.resolvedUrl,
    })}`;
    if (err instanceof EconnRefusedError) {
      destination = '/500?message=The server seems to not responding';
    } else if (err instanceof ExpiredTokenError) {
      try {
        const tokenRes: AxiosResponse<ISessionToken> = await unauthenticatedClient.post(API_URLS.TOKEN, null, {
          params: {
            client_id: 'iesi',
            client_secret: 'iesi',
            grant_type: 'refresh_token',
            refresh_token: context.req.session.refresh_token,
          },
        });
        context.req.session.access_token = tokenRes.data.access_token;
        context.req.session.refresh_token = tokenRes.data.refresh_token;

        await context.req.session.save();

        return sendRequest(context);
      } catch (error) {
        if (error instanceof EconnRefusedError) {
          destination = '/500?message=The server seems to not responding';
        }
      }
    }

    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  }

  return {
    props: {},
  };
}

function withAuth<P extends { [key: string]: unknown } = { [key: string]: unknown }>(handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>) {
  return withSessionSsr(async (context) => {
    const getServerSidePropsData = await handler(context);
    const data = await sendRequest(context);
    return {
      ...data,
      ...getServerSidePropsData,
    };
  });
}

export default withAuth;
