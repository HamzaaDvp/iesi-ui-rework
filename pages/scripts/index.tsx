import {unauthenticatedClient} from "@app/lib/requestWrapper";
import {GetServerSideProps} from "next";
import {withSessionSsr} from "@app/lib/withSession";
import API_ROUTES from "@app/constants/api/routes";
import useSWR from 'swr'

export default function ScriptsOverview() {
    const data = useSWR('/scripts')

    if (!data) {
        return <p>Loading ...</p>
    }


    return (
        <p>Script overview</p>
    )
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        try {
            await unauthenticatedClient.get(API_ROUTES.auth_routes.check_token({
                token: req.session.access_token
            }))
        } catch (err: any) {
            console.log(err)
            if (err.code === 'ECONNREFUSED') {
                return {
                    redirect: {
                        permanent: true,
                        destination: '/500?message=The server seems to not responding'
                    }
                }
            }
        }

        return {
            props: {}
        }
    }
)