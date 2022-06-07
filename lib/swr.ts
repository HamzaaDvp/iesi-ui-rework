import {SWRConfiguration} from 'swr'
import {authenticatedClient, internalClient} from "@app/lib/requestWrapper";
import API_ROUTES from "@app/constants/api/routes";

export const swrConfig: SWRConfiguration = {
    fetcher: authenticatedClient,
    onErrorRetry: async (err, key, config, revalidate) => {
        if (
            err.response.data.error === 'invalid_token' &&
            err.response.data.error_description.includes('expired')
        ) {
            const sessionTokenRes = await internalClient.get("/api/token");
            await internalClient.post(API_ROUTES.auth_routes.login({
                grant_type: 'refresh_token',
                client_id: 'iesi',
                client_secret: 'iesi',
                refresh_token: sessionTokenRes.data.refresh_token
            }))
            revalidate();
        }
        return;
    }
}



