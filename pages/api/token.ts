// pages/api/user.ts

import {NextApiRequest, NextApiResponse} from "next";
import {withSessionRoute} from "@app/lib/withSession";

export default withSessionRoute(userRoute)

function userRoute(req: NextApiRequest, res: NextApiResponse) {
    res.send({ access_token: req.session.access_token, refresh_token: req.session.refresh_token });
}