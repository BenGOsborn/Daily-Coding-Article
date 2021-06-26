import { NextApiRequest, NextApiResponse } from "next";
import { protectedMiddleware } from "../../../utils/auth";
import DB from "../../../utils/db";
import { sendMail } from "../../../utils/email";

export default async function auth(req : NextApiRequest, res : NextApiResponse) : Promise<void> {
    if (req.method === 'POST') {
        protectedMiddleware(req, res, async () => {
            // I want to authenticate, then add the email template, then store it in a new table, then email it out

            // Get the params from the request
            const { subject, text, html, test } : { subject : string, text : string, html : string, test? : boolean } = req.body;

            // Make sure all of the params are specified
            if (!(typeof subject !== typeof undefined && typeof text !== typeof undefined && typeof html !== typeof undefined)) {
                return res.status(400).end("Missing a parameter");
            }

            // If the message is a test, then send a single email to the the sender
            if (test) {
                await sendMail([process.env.GMAIL_USER as string], subject, text, html);

                return res.status(200).end("Test email sent");
            }

            // Initialize connection to the database
            const db = new DB();

            // Get all of the emails
            const { rows } = await db.query("SELECT email FROM users");

            // Send the emails
            await sendMail(rows.map((row : { email : string }) => row.email), subject, text, html);

            // Close the database
            await db.close();

            // Maybe on top of this I want to have an additional tracking table where I can track what the users see and then track if the users open the emails through a link
            // That custom link is going to have to have bto scrape the head tags of the page to display in the URL
            // Have an option to send a test email to a specific user

            return res.status(200).end("Emails sent");
        });

    } else {
        return res.status(400).end("Invalid method");
    }
}