import axios from "axios";
import {useRouter} from "next/router";
import {internalClient} from "@app/lib/requestWrapper";

export default function Login() {
    const { query, push } = useRouter();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await internalClient.post(`/api/login?` + new URLSearchParams({
                grant_type: 'password',
                client_id: 'iesi',
                client_secret: 'iesi',
                username: 'admin',
                password: 'admin',
            } as any))

            push(query.callbackUrl as string);

        } catch (err) {

        }
    }

    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                placeholder="Jane Doe"
            />
            <input
                type="password"
            />
            <button type="submit">Log in</button>
        </form>
    )
}