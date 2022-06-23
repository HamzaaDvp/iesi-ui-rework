import {unauthenticatedClient} from "@app/lib/requestWrapper";
import {GetServerSideProps} from "next";
import {withSessionSsr} from "@app/lib/withSession";
import API_ROUTES from "@app/constants/api/routes";
import useSWR from 'swr'
import {EconnRefusedError, ExpiredTokenError, InvalidTokenError} from "@app/throwables/auth";
import Head from "next/head";

export default function ScriptsOverview() {
    const data = useSWR('/scripts')

    if (!data) {
        return <p>Loading ...</p>
    }


    return (
        <>
            <Head>
                <title>Scripts overview</title>
            </Head>
            <p>Script overview</p>
        </>
    )
}

async function sendRequest(req: any, resolvedUrl: string) {
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

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async function getServerSideProps({ req, resolvedUrl }) {
        return await sendRequest(req, resolvedUrl);
    }
)