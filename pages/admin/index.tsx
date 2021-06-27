import { FormEvent, useState, MouseEvent } from "react";
import { SendParams } from "../api/emails/send";
import { NextPage, NextPageContext } from "next";
import { verifyToken } from "../../utils/auth";
import { LoginProps } from "./login";
import { StatusMessage } from "..";
import cookie from "cookie";
import Link from 'next/link';
import axios, { AxiosError } from "axios";

const Dashboard : NextPage<LoginProps> = ({ loggedIn }) => {
    const [sent, setSent] = useState<StatusMessage | null>(null);

    const [subject, setSubject] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [body, setBody] = useState<string | null>(null);
    const [articleURL, setArticleURL] = useState<string | null>(null);
    const [test, setTest] = useState<boolean>(true);

    const send = (e : FormEvent<HTMLFormElement>) => {
        // Prevent the page from reloading
        e.preventDefault();

        // Attempt to send the email
    }

    // Log the user out
    const logout = (e : MouseEvent<HTMLAnchorElement>) => {
        // Request a logout
        axios.delete<string>("/api/auth")
        .then(result => {
            
        })
        .catch((error : AxiosError) => {
            // Prevent the page from redirecting in case of error
            e.preventDefault();
        });
    }

    // Display the page if logged in otherwise display nothing whilst redirected
    if (loggedIn) {
        return (
                <>
                    <Link href="/"><a onClick={logout}>Logout</a></Link>
                    <h1>Admin Dashboard</h1>
                    <form onSubmit={send}>
                        <label htmlFor="subject">Subject</label>
                        <input type="text" required={true} placeholder="Subject" id="subject" onChange={e => setSubject(e.target.value)} />
                        <label htmlFor="title">Title</label>
                        <input type="text" required={true} placeholder="Title" id="title" onChange={e => setTitle(e.target.value)} />
                        <label htmlFor="body">Body</label>
                        <input type="text" required={true} placeholder="Body" id="body" onChange={e => setBody(e.target.value)} />
                        <label htmlFor="articleURL">Article URL</label>
                        <input type="text" required={true} placeholder="Article URL" id="articleURL" onChange={e => setArticleURL(e.target.value)} />
                        <label htmlFor="test">Test Mode</label>
                        <input type="checkbox" id="test" defaultChecked onChange={e => setTest(!test)} />
                        <input type="submit" value="Send" />
                    </form>
                </>
        );
        
    } else {
        return null;
    }
}

// Maybe make into a server side redirect at some point ?
Dashboard.getInitialProps = async ({ req, res } : NextPageContext) => {
    // Get the token before proceeding
    const { token } : any = cookie.parse(req?.headers.cookie as string);

    // If there is a token verify it
    if (token) {
        const verified = verifyToken(token);

        // If the token is valid proceed
        if (verified) {
            return { loggedIn: true }
        }
    }

    // Redirect and return false
    res?.writeHead(302, { Location: "/admin/login" });
    res?.end();

    return { loggedIn: false }
}

export default Dashboard;