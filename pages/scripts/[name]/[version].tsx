import {withAuth} from "@app/lib/withAuth";
import {Typography} from "@mui/material";
import axios from "axios";

export default function ScriptDetail({ posts, currentUrl}) {
    return (
        <Typography>Script detail</Typography>
    )
}


export const getServerSideProps = withAuth(async (context) => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts?size=5')
    return {
        props: {
            posts: response.data,
            currentUrl: context.resolvedUrl
        }
    }
})