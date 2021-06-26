import { FC, useState, useEffect, ChangeEvent } from "react";
import { StatusMessage } from ".";
import axios from "axios";
import { UnsubscribeParams } from "./api/emails";

const Unsubscribe : FC<{}> = () => {
    const [unsubscribed, setUnsubscribed] = useState<StatusMessage | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    // Unsubscribe the user from the email list
    const unsubscribe = (e : ChangeEvent<HTMLFormElement>) : void => {
        // Prevent the page from reloading
        e.preventDefault();

        // Don't execute if the email is uninitialized
        if (typeof email === typeof null) {
            console.error("Email does not have a value");
            return;
        }

        // Unsubscribe the user from the email list
        axios.delete("/api/emails", { data: { email } as UnsubscribeParams })
        .then(result => {
            // Set the status
            const unsubscribedStatus : StatusMessage = { success: true, message: result.data }
            setUnsubscribed(unsubscribedStatus);
        })
        .catch(error => {
            // Set the status as an error message
            const unsubscribedStatus : StatusMessage = { success: false, message: error.response.data }
            setUnsubscribed(unsubscribedStatus);
        });
    }

    return (
        <div>
            <h1>Unsubscribe</h1>
            <p>We're sad to see you go!</p>
            <form onSubmit={unsubscribe}>
                <label htmlFor="email">Your Email</label>
                <input type="email" required={true} placeholder="your@email.com" id="email" onChange={e => setEmail(e.target.value)} />
                <input type="submit" value="Unsubscribe" />
            </form>
            {unsubscribed ? unsubscribed.success ? <p>{unsubscribed.message}</p> : <p>{unsubscribed.message}</p> : null}
        </div>
    );
}

export default Unsubscribe;