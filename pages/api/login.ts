// pages/api/login.ts

import { withSessionRoute } from 'lib/withSession';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISessionToken, ITokenPayload } from '@app/types/auth';
import { unauthenticatedClient } from '@app/lib/requestWrapper';
import API_URLS from '@app/constants/api/urls';
import { AxiosError, AxiosResponse } from 'axios';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tokenRes: AxiosResponse<ISessionToken> = await unauthenticatedClient.post(API_URLS.TOKEN, null, {
      params: req.query as ITokenPayload,
    });
    req.session.access_token = tokenRes.data.access_token;
    req.session.refresh_token = tokenRes.data.refresh_token;

    await req.session.save();

    res
      .status(tokenRes.status)
      .json(tokenRes.data);
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      res
        .status(e.response?.status || 500)
        .json(e.response?.data);
    }
    res.status(500)
      .json('Unexpected login error');
  }
}

export default withSessionRoute(loginRoute);
