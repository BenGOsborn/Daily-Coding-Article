import axios, { AxiosError } from "axios";
import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/dist/client/router";
import { FormEvent, useState } from "react";
import { StatusMessage } from "..";
import { verifyToken } from "../../utils/auth";
import { AuthParams } from "../api/auth";
import cookie from "cookie";

export interface LoginProps {
    loggedIn : boolean
}

const Login : NextPage<LoginProps> = ({ loggedIn }) => {
    const [loginStatus, setLoginStatus] = useState<StatusMessage | null>(null);

    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const router = useRouter();

    const login = (e : FormEvent<HTMLFormElement>) => {
        // Prevent the page from reloading
        e.preventDefault();

        // Make a request to axios
        axios.post<string>("/api/auth", { username, password } as AuthParams)
        .then(result => {
            // Set the status
            const payload : StatusMessage = { success: true, message: result.data }
            setLoginStatus(payload);

            // Redirect to the admin page
            router.push("/admin");
        })
        .catch((result : AxiosError) => {
            // Set the status
            const payload : StatusMessage = { success: false, message: result.response?.data }
            setLoginStatus(payload);
        });
    }

    // Display the page if not logged in otherwise display nothing whilst redirected
    if (!loggedIn) {
        return (
            <>
                <h1>Login</h1>
                <form onSubmit={login}>
                    <label htmlFor="username">Username</label>
                    <input type="text" required={true} placeholder="Admin username" id="username" onChange={e => setUsername(e.target.value)} />
                    <label htmlFor="password">Password</label>
                    <input type="password" required={true} placeholder="Admin password" id="password" onChange={e => setPassword(e.target.value)} />
                    <input type="submit" value="Login" />
                </form>
                {loginStatus ? loginStatus.success ? <p>{loginStatus.message}</p> : <p>{loginStatus.message}</p> : null}
            </>
        );

    } else {
        return null;
    }
}

Login.getInitialProps = async ({ req, res } : NextPageContext) => {
    // Get the token before proceeding
    const { token } : any = cookie.parse(req?.headers.cookie as string);

    // If there is a token verify it
    if (token) {
        const verified = verifyToken(token);

        // If the token is valid redirect to the admin page
        if (verified) {
            res?.writeHead(302, { Location: "/admin" });
            res?.end();

            return { loggedIn: true }
        }
    }

    // Redirect and return false
    return { loggedIn: false }
}

export default Login;