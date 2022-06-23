// pages/api/login.ts

import {withSessionRoute} from "lib/withSession";
import {NextApiRequest, NextApiResponse} from "next";
import {ITokenPayload} from "@app/types/auth";
import {unauthenticatedClient} from "@app/lib/requestWrapper";

export default withSessionRoute(loginRoute);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    try {
        const tokenRes = await unauthenticatedClient.post(`http://localhost:8080/api/oauth/token?${new URLSearchParams(req.query as ITokenPayload)}`)
        req.session.access_token = tokenRes.data.access_token;
        req.session.refresh_token = tokenRes.data.refresh_token;

        await req.session.save();

        res
            .status(tokenRes.status)
            .json(tokenRes.data)
    } catch (e: any) {
        res
            .status(e.response.status)
            .json(e.response.data)
    }



}