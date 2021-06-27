import { useState, useEffect, ChangeEvent } from "react";
import { StatusMessage } from ".";
import axios from "axios";
import { UnsubscribeParams } from "./api/emails";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";

const Unsubscribe : NextPage<{}> = () => {
    const [unsubscribedStatus, setUnsubscribedStatus] = useState<StatusMessage | null>(null);
    
    const [email, setEmail] = useState<string | null>(null);

    const router = useRouter();

    // Unsubscribe the user from the email list
    const unsubscribe = (e : ChangeEvent<HTMLFormElement>) : void => {
        // Prevent the page from reloading
        e.preventDefault();

        // Don't execute if the email is uninitialized
        if (!email) {
            console.error("Email does not have a value");
            return;
        }

        // Unsubscribe the user from the email list
        axios.delete<string>("/api/emails", { data: { email } as UnsubscribeParams })
        .then(result => {
            // Set the status
            const unsubscribedStatus : StatusMessage = { success: true, message: result.data }
            setUnsubscribedStatus(unsubscribedStatus);

            // Redirect to the home screen
            router.push("/");
        })
        .catch(error => {
            // Set the status as an error message
            const unsubscribedStatus : StatusMessage = { success: false, message: error.response.data }
            setUnsubscribedStatus(unsubscribedStatus);
        });
    }

    return (
        <>
            <h1>Unsubscribe</h1>
            <p>We're sad to see you go!</p>
            <form onSubmit={unsubscribe}>
                <label htmlFor="email">Your Email</label>
                <input type="email" required={true} placeholder="your@email.com" id="email" onChange={e => setEmail(e.target.value)} />
                <input type="submit" value="Unsubscribe" />
            </form>
            {unsubscribedStatus ? unsubscribedStatus.success ? <p className="textSuccess">{unsubscribedStatus.message}</p> : <p className="textFail">{unsubscribedStatus.message}</p> : null}
        </>
    );
}

export default Unsubscribe;