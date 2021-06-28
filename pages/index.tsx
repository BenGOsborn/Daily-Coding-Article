import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { SubscribeParams } from "./api/emails";
import { NextPage } from "next";
import styles from "../styles/Subscribe.module.scss";
import Head from "next/head";

export interface StatusMessage {
    success: boolean;
    message: string;
}

export interface EmailStatusMessage extends StatusMessage {
    email: string;
}

const Subscribe: NextPage<{}> = () => {
    const [subscribedStatus, setSubscribedStatus] =
        useState<EmailStatusMessage | null>(null);

    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        // Attempt to get the subscribed status from the local storage
        const subscribedStatus = localStorage.getItem("subscribed");
        if (subscribedStatus) {
            setSubscribedStatus(
                JSON.parse(subscribedStatus) as EmailStatusMessage
            );
        }
    }, []);

    // Subscribe the user to the email list
    const subscribe = (e: ChangeEvent<HTMLFormElement>): void => {
        // Prevent the page from reloading
        e.preventDefault();

        // Don't execute if the email is uninitialized
        if (!email) {
            console.error("Email does not have a value");
            return;
        }

        // Attempt to set the email
        axios
            .post<string>("/api/emails", { email } as SubscribeParams)
            .then((result) => {
                // Set the status and store in local storage
                const subscribedStatus: EmailStatusMessage = {
                    success: true,
                    message: result.data,
                    email,
                };
                setSubscribedStatus(subscribedStatus);

                // Save the status to local storage
                localStorage.setItem(
                    "subscribed",
                    JSON.stringify(subscribedStatus)
                );

                // Clear the form
                e.target.reset();
            })
            .catch((error) => {
                // Set the status as an error message
                const subscribedStatus: EmailStatusMessage = {
                    success: false,
                    message: error.response.data,
                    email,
                };
                setSubscribedStatus(subscribedStatus);
            });
    };

    return (
        <>
            <Head>
                <title>Subscribe - Daily Coding Article</title>
                <meta
                    name="description"
                    content="Subscribe to the Daily Coding Article mailing list to receive a new coding article every day to expand your knowledge."
                />
            </Head>
            <div className={styles.container}>
                <h1>Daily Coding Article</h1>
                <p>
                    Receive a new coding based article everyday to expand your
                    knowledge!
                </p>
                {!subscribedStatus?.success ? (
                    <>
                        <form onSubmit={subscribe} id="subscribe">
                            <label htmlFor="email">Your Email</label>
                            <input
                                type="email"
                                required={true}
                                placeholder="your@email.com"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </form>
                        <input
                            type="submit"
                            value="Subscribe"
                            form="subscribe"
                            className="button"
                        />
                    </>
                ) : null}
                {subscribedStatus ? (
                    subscribedStatus.success ? (
                        <p className="textSuccess">
                            {subscribedStatus.message}
                        </p>
                    ) : (
                        <p className="textFail">{subscribedStatus.message}</p>
                    )
                ) : null}
            </div>
        </>
    );
};

export default Subscribe;
