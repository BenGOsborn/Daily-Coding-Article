import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { SubscribeParams } from "./api/emails";
import { NextPage } from "next";

export interface StatusMessage {
    success : boolean,
    message : string
}

const Subscribe : NextPage<{}> = () => {
    const [subscribed, setSubscribed] = useState<StatusMessage | null>(null);
    
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        // Attempt to get the subscribed status from the local storage
        const subscribedStatus = localStorage.getItem("subscribed");
        if (subscribedStatus) {
            setSubscribed(JSON.parse(subscribedStatus) as StatusMessage);
        }
    }, []);

    // Subscribe the user to the email list
    const subscribe = (e : ChangeEvent<HTMLFormElement>) : void => {
        // Prevent the page from reloading
        e.preventDefault();

        // Don't execute if the email is uninitialized
        if (typeof email === typeof null) {
            console.error("Email does not have a value");
            return;
        }

        // Attempt to set the email
        axios.post<string>("/api/emails", { email } as SubscribeParams)
        .then(result => {
            // Set the status and store in local storage
            const subscribedStatus : StatusMessage = { success: true, message: result.data }
            setSubscribed(subscribedStatus);

            // Save the status to local storage
            localStorage.setItem("subscribed", JSON.stringify(subscribedStatus));
        })
        .catch(error => {
            // Set the status as an error message
            const subscribedStatus : StatusMessage = { success: false, message: error.response.data }
            setSubscribed(subscribedStatus);

            // Look at the status from the server and see if one already exists then it should set the local storage and the status and such
        });
    }

    const isSubscribed = () : boolean => {
        return subscribed ? subscribed.success : false;
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
            {subscribed ? subscribed.success ? <p>{subscribed.message}</p> : <p>{subscribed.message}</p> : null}
        </>
    );
}

export default Subscribe;