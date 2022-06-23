import {useRouter} from "next/router";
import {internalClient} from "@app/lib/requestWrapper";
import Head from "next/head";
import {Box, TextField, Typography} from "@mui/material";
import {useRef, useState} from "react";
import { LoadingButton } from "@mui/lab";


export default function Login() {
    const router = useRouter();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isLogging, setIsLogging] = useState(false);


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLogging(true)
        try {
            await internalClient.post(`/api/login?` + new URLSearchParams({
                grant_type: 'password',
                client_id: 'iesi',
                client_secret: 'iesi',
                username: usernameRef.current?.value,
                password: passwordRef.current?.value,
            } as any));
            await router.push(router.query.callbackUrl as string);
        } catch (e) {
            console.log('cc')
        }
        setIsLogging(false)


    }

    return (
        <Box display="flex" flexDirection="column" width="100%" py={8} alignItems="center">
            <Head>
                <title>IESI login page</title>
            </Head>
            <Box display="flex" flexDirection="column" component="form" onSubmit={onSubmit} gap={4} width="25%" alignItems="center">
                <Typography variant="h2" fontStyle="bold">IESI</Typography>
                <TextField
                    label="Username"
                    variant="filled"
                    id="login-form-username"
                    inputRef={usernameRef}
                    fullWidth
                    />
                <TextField
                    label="Password"
                    type="password"
                    variant="filled"
                    id="login-form-password"
                    inputRef={passwordRef}
                    fullWidth
                    />
                <LoadingButton type="submit" variant="contained" loading={isLogging}>
                    <Typography>Login</Typography>
                </LoadingButton>

            </Box>
        </Box>
    )
}