import {unauthenticatedClient} from "@app/lib/requestWrapper";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {withSessionSsr} from "@app/lib/withSession";
import API_ROUTES from "@app/constants/api/routes";
import useSWR from 'swr'
import {EconnRefusedError, ExpiredTokenError, InvalidTokenError} from "@app/throwables/auth";
import Head from "next/head";
import {withAuth} from "@app/lib/withAuth";

export default function ScriptsOverview(props) {
    const data = useSWR('/scripts')

    if (!data) {
        return <p>Loading ...</p>
    }

    console.log(props)


    return (
        <>
            <Head>
                <title>Scripts overview</title>
            </Head>
            <p>Script overview</p>
        </>
    )
}



export const getServerSideProps = withAuth((context: GetServerSidePropsContext) => {
    return {
        props: {
            hello: 'World'
        }
    }
})