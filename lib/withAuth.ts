import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult} from "next";
import {unauthenticatedClient} from "@app/lib/requestWrapper";
import API_ROUTES from "@app/constants/api/routes";
import {EconnRefusedError, ExpiredTokenError} from "@app/throwables/auth";
import {withSessionSsr} from "@app/lib/withSession";
import {withIronSessionSsr} from "iron-session/next/index";


async function sendRequest(req: any, resolvedUrl: string): Promise<GetServerSidePropsResult<any>> {
    try {
        await unauthenticatedClient.get(API_ROUTES.auth_routes.check_token({
            token: req.session.access_token
        }))
    } catch (err: any) {
        let destination = '/login?' + new URLSearchParams({
            callbackUrl: resolvedUrl
        });
        if (err instanceof EconnRefusedError) {
            destination = '/500?message=The server seems to not responding'
        } else if (err instanceof ExpiredTokenError) {
            try {
                const tokenRes = await unauthenticatedClient.post(`oauth/token?${new URLSearchParams({
                    client_id: 'iesi',
                    client_secret: 'iesi',
                    grant_type: 'refresh_token',
                    refresh_token: req.session.refresh_token
                })}`)
                req.session.access_token = tokenRes.data.access_token;
                req.session.refresh_token = tokenRes.data.refresh_token;

                await req.session.save();

                return sendRequest(req, resolvedUrl);
            } catch (error) {
                if (error instanceof EconnRefusedError) {
                    destination = '/500?message=The server seems to not responding'
                }
            }
        }

        return {
            redirect: {
                permanent: false,
                destination,
            }
        }
    }

    return {
        props: {}
    }
}

export function withAuth<P extends { [key: string]: unknown } = { [key: string]: unknown }>(handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
    return withSessionSsr(async function getServerSideProps(context){
        const gsspData = await handler(context);
        const data = await sendRequest(context.req, context.resolvedUrl);
        return {
            ...data,
            ...gsspData,
        }
    })
}