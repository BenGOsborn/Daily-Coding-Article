import axios, { AxiosError } from "axios";
import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import { FormEvent, useState } from "react";
import { StatusMessage } from "..";
import { TokenParams, verifyToken } from "../../utils/auth";
import { AuthParams } from "../api/auth";
import styles from "../../styles/Login.module.scss";

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
            <div className="container">
                <div className={styles.login}>
                    <h1>Login</h1>
                    <form onSubmit={login} id="LoginForm" >
                        <section>
                            <label htmlFor="username">Username</label>
                            <input type="text" required={true} placeholder="Admin username" id="username" onChange={e => setUsername(e.target.value)} />
                            <label htmlFor="password">Password</label>
                            <input type="password" required={true} placeholder="Admin password" id="password" onChange={e => setPassword(e.target.value)} />
                        </section>
                    </form>
                    <input type="submit" form="LoginForm" value="Login" />
                    {loginStatus ? loginStatus.success ? <p>{loginStatus.message}</p> : <p>{loginStatus.message}</p> : null}
                </div>
            </div>
        );

    } else {
        return null;
    }
}


export const getServerSideProps : GetServerSideProps<LoginProps> = async ({ req, res }) => {
    // Get the token before proceeding
    const { token } : TokenParams = req.cookies;

    // If there is a token verify it
    if (token) {
        const verified = verifyToken(token);

        // If the token is valid redirect to the admin page
        if (verified) {
            res.statusCode = 302;
            res.setHeader("Location", "/admin");

            return { props: { loggedIn: true } }
        }
    }

    // Return false
    return { props: { loggedIn: false } }
}

export default Login;