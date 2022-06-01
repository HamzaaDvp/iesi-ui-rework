import {withIronSessionApiRoute, withIronSessionSsr} from "iron-session/next";
import { IronSessionOptions } from "iron-session";
import {GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler} from "next";

const sessionOptions: IronSessionOptions = {
    cookieName: 'next-auth-session',
    password: 'KuSs2v9f3[;cvF@/}KZtZ/*~Gpj_9*S+',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr<
    P extends { [key: string]: unknown } = { [key: string]: unknown },
    >(
    handler: (
        context: GetServerSidePropsContext,
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
    return withIronSessionSsr(handler, sessionOptions);
}

declare module "iron-session" {
    interface IronSessionData {
        access_token?: string;
        refresh_token?: string;
        expires_in?: string;
    }
}