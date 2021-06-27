import { FormEvent, useState, MouseEvent } from "react";
import { SendParams } from "../api/emails/send";
import { NextPage, GetServerSideProps } from "next";
import { TokenParams, verifyToken } from "../../utils/auth";
import { LoginProps } from "./login";
import { StatusMessage } from "..";
import Link from 'next/link';
import axios, { AxiosError } from "axios";
import styles from "../../styles/Dashboard.module.scss";

const Dashboard : NextPage<LoginProps> = ({ loggedIn }) => {
    const [sentStatus, setSentStatus] = useState<StatusMessage | null>(null);

    const [subject, setSubject] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [body, setBody] = useState<string | null>(null);
    const [articleURL, setArticleURL] = useState<string | null>(null);
    const [test, setTest] = useState<boolean>(true);

    const send = (e : FormEvent<HTMLFormElement>) => {
        // Prevent the page from reloading
        e.preventDefault();

        // Attempt to send the email
        axios.post<string>("/api/emails/send", { subject, title, body, articleURL, test } as SendParams)
        .then(result => {
            // Set the status
            const payload : StatusMessage = { success: true, message: result.data }
            setSentStatus(payload);

            // If it was not a test then reset the form
            if (!test) {
                // @ts-ignore
                e.target.reset();
            }
        })
        .catch((error : AxiosError) => {
            // Set the status
            const payload : StatusMessage = { success: true, message: error.response?.data }
            setSentStatus(payload);
        });
    }

    // Log the user out
    const logout = (e : MouseEvent<HTMLAnchorElement>) => {
        // Request a logout
        axios.delete<string>("/api/auth")
        .then(result => { })
        .catch((error : AxiosError) => {
            // Prevent the page from redirecting in case of error
            e.preventDefault();
        });
    }

    // Display the page if logged in otherwise display nothing whilst redirected
    if (loggedIn) {
        return (
            <div className={styles.dashboard}>
                <Link href="/"><a onClick={logout}>Logout</a></Link>
                <h1>Admin Dashboard</h1>
                <form onSubmit={send} id="sendForm">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" required={true} placeholder="Subject" id="subject" onChange={e => setSubject(e.target.value)} />
                    <label htmlFor="title">Title</label>
                    <input type="text" required={true} placeholder="Title" id="title" onChange={e => setTitle(e.target.value)} />
                    <label htmlFor="body">Body</label>
                    <textarea required={true} placeholder="Body" id="body" onChange={e => setBody(e.target.value)} />
                    <label htmlFor="articleURL">Article URL</label>
                    <input type="text" required={true} placeholder="Article URL" id="articleURL" onChange={e => setArticleURL(e.target.value)} />
                </form>
                <div className={styles.checkbox}>
                    <label htmlFor="test">Test Mode</label>
                    <input type="checkbox" id="test" defaultChecked onChange={e => setTest(!test)} />
                </div>
                <input type="submit" value="Send" form="sendForm" className="button" />
                {sentStatus ? sentStatus.success ? <p className="textSuccess">{sentStatus.message}</p> : <p className="textFail">{sentStatus.message}</p> : null}
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

        // If the token is valid then proceed
        if (verified) {
            return { props: { loggedIn: true } }
        }
    }

    // Redirect and return false
    res.statusCode = 302;
    res.setHeader("Location", "/admin/login");

    return { props: { loggedIn: false } }
}

export default Dashboard;