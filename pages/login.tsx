import axios from "axios";
import {ITokenPayload} from "@app/types/auth";

export default function Login() {

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await axios.post(`/api/login?${new URLSearchParams({
            grant_type: 'password',
            client_id: 'iesi',
            client_secret: 'iesi',
            username: 'admin',
            password: 'admin',
        })}`)
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