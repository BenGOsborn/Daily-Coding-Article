import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { SubscribeParams } from "./api/emails";
import { NextPage } from "next";

export interface StatusMessage {
    success : boolean,
    message : string
}

const Subscribe : NextPage<{}> = () => {
    const [subscribedStatus, setSubscribedStatus] = useState<StatusMessage | null>(null);
    
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        // Attempt to get the subscribed status from the local storage
        const subscribedStatus = localStorage.getItem("subscribed");
        if (subscribedStatus) {
            setSubscribedStatus(JSON.parse(subscribedStatus) as StatusMessage);
        }
    }, []);

    // Subscribe the user to the email list
    const subscribe = (e : ChangeEvent<HTMLFormElement>) : void => {
        // Prevent the page from reloading
        e.preventDefault();

        // Don't execute if the email is uninitialized
        if (!email) {
            console.error("Email does not have a value");
            return;
        }

        // Attempt to set the email
        axios.post<string>("/api/emails", { email } as SubscribeParams)
        .then(result => {
            // Set the status and store in local storage
            const subscribedStatus : StatusMessage = { success: true, message: result.data }
            setSubscribedStatus(subscribedStatus);

            // Save the status to local storage
            localStorage.setItem("subscribed", JSON.stringify(subscribedStatus));

            // Clear the form
            e.target.reset();
        })
        .catch(error => {
            // Set the status as an error message
            const subscribedStatus : StatusMessage = { success: false, message: error.response.data }
            setSubscribedStatus(subscribedStatus);
        });
    }

    // Check if the email is already subscribed
    const isSubscribed = () : boolean => {
        return subscribedStatus ? subscribedStatus.success : false;
    }

    return (
        <>
            <h1>Subscribe</h1>
            <p>Receive a new coding based article everyday to expand your knowledge!</p>
            <form onSubmit={subscribe}>
                <label htmlFor="email">Your Email</label>
                <input type="email" disabled={isSubscribed()} required={true} placeholder="your@email.com" id="email" onChange={e => setEmail(e.target.value)} />
                <input type="submit" disabled={isSubscribed()} value="Subscribe" />
            </form>
            {subscribedStatus ? subscribedStatus.success ? <p>{subscribedStatus.message}</p> : <p>{subscribedStatus.message}</p> : null}
        </>
    );
}

export default Subscribe;