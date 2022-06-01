import useSWR from "swr"
import { requestWrapper } from "@app/lib/requestWrapper";
import axios from "axios";
import {useRouter} from "next/router";

export default function ScriptsOverview() {
    const router = useRouter();
    const { data, error } = useSWR('/scripts')


    if (error && !error.response.data.error_description.includes('expired')) {
        if (error.response.status === 401) {
            router.push("/login")
        }
        return <p>Error</p>
    }
    if (!data) {
        return <p>Loading ...</p>
    }


    return (
        <p>Script overview</p>
    )
}