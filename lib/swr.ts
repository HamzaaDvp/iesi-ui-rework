import { SWRConfiguration, Revalidator } from 'swr'
import axios from "axios";
import {requestWrapper} from "@app/lib/requestWrapper";

export const swrConfig: SWRConfiguration = {
    fetcher: requestWrapper,
    onErrorRetry
}


async function onErrorRetry(error: any, key: string, config: SWRConfiguration, revalidate: Revalidator) {
    if (
        error.response.data.error === 'invalid_token' &&
        error.response.data.error_description.includes('expired')
    ) {
        const sessionTokenRes = await axios.get("/api/token");
        await axios.post(`/api/login?${new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: 'iesi',
            client_secret: 'iesi',
            refresh_token: sessionTokenRes.data.refresh_token
        })}`)
        revalidate();
    }
}