import { useState, useEffect, ChangeEvent } from "react";
import { StatusMessage, EmailStatusMessage } from ".";
import axios from "axios";
import { UnsubscribeParams } from "./api/emails";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import styles from "../styles/Unsubscribe.module.scss";
import Head from "next/head";

const Unsubscribe: NextPage<{}> = () => {
    const [unsubscribedStatus, setUnsubscribedStatus] =
        useState<StatusMessage | null>(null);

    const [email, setEmail] = useState<string>("");

    const router = useRouter();

    useEffect(() => {
        // Attempt to load the item from local storage
        const subscribedStatus = localStorage.getItem("subscribed");
        if (subscribedStatus) {
            setEmail(
                (JSON.parse(subscribedStatus) as EmailStatusMessage).email
            );
        }
    }, []);

    // Unsubscribe the user from the email list
    const unsubscribe = (e: ChangeEvent<HTMLFormElement>): void => {
        // Prevent the page from reloading
        e.preventDefault();

        // Don't execute if the email is uninitialized
        if (!email) {
            console.error("Email does not have a value");
            return;
        }

        // Unsubscribe the user from the email list
        axios
            .delete<string>("/api/emails", {
                data: { email } as UnsubscribeParams,
            })
            .then((result) => {
                // Set the status
                const unsubscribedStatus: StatusMessage = {
                    success: true,
                    message: result.data,
                };
                setUnsubscribedStatus(unsubscribedStatus);

                // Clear the local storage item
                localStorage.removeItem("subscribed");

                // Redirect to the home screen
                router.push("/");
            })
            .catch((error) => {
                // Set the status as an error message
                const unsubscribedStatus: StatusMessage = {
                    success: false,
                    message: error.response.data,
                };
                setUnsubscribedStatus(unsubscribedStatus);
            });
    };

    return (
        <>
            <Head>
                <title>Unsubscribe - Daily Coding Article</title>
                <meta
                    name="description"
                    content="Unsubscribe from the Daily Coding Article mailing list."
                />
            </Head>
            <div className={styles.container}>
                <h1>{"We're sad to see you go!"}</h1>
                <p>
                    {
                        "If there's anything we can do to change your mind, let us know."
                    }
                </p>
                <form onSubmit={unsubscribe} id="unsubscribe">
                    <label htmlFor="email">Your Email</label>
                    <input
                        type="email"
                        required={true}
                        value={email}
                        placeholder="your@email.com"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </form>
                <input
                    type="submit"
                    value="Unsubscribe"
                    className="button"
                    form="unsubscribe"
                />
                {unsubscribedStatus ? (
                    unsubscribedStatus.success ? (
                        <p className="textSuccess">
                            {unsubscribedStatus.message}
                        </p>
                    ) : (
                        <p className="textFail">{unsubscribedStatus.message}</p>
                    )
                ) : null}
            </div>
        </>
    );
};

export default Unsubscribe;
