// pages/api/login.ts

import { withSessionRoute } from "lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import {ITokenPayload} from "@app/types/auth";
import axios from "axios";

export default withSessionRoute(loginRoute);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const tokenRes = await axios.post(`http://localhost:8080/api/oauth/token?${new URLSearchParams(req.query as any)}`)
    req.session.access_token = tokenRes.data.access_token;
    req.session.refresh_token = tokenRes.data.refresh_token;

    await req.session.save();
    res.status(200).json({
        message: 'Signed in'
    })
}