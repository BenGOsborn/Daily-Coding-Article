import { NextApiRequest, NextApiResponse } from "next";
import { protectedMiddleware } from "../../../utils/auth";
import compileTemplate from '../../../emailTemplates/compileTemplate';
import DB from "../../../utils/db";
import { sendMail } from "../../../utils/email";

export default async function auth(req : NextApiRequest, res : NextApiResponse) : Promise<void> {
    if (req.method === 'POST') {
        protectedMiddleware(req, res, async () => {
            // Get the params from the request
            const { subject, title, body, url, test } : { subject : string, title : string, body : string, url : string, test? : boolean } = req.body;

            // Make sure all of the params are specified
            if (!(typeof subject !== typeof undefined && typeof title !== typeof undefined && typeof body !== typeof undefined && typeof url !== typeof undefined)) {
                return res.status(400).end("Missing a parameter");
            }

            // Define the data to be emailed
            const text = `${title}\n\n${body}\n\n${url}`;
            const html = await compileTemplate({ title: "Lol", body: "This is my body", url: "https://www.google.com" });

            // If the message is a test, then send a single email to the the sender
            if (test) {
                await sendMail([process.env.GMAIL_USER as string], subject, text, html);

                return res.status(200).end("Test email sent");
            }

            // Initialize connection to the database
            // const db = new DB();

            // Get all of the emails
            // const { rows } = await db.query("SELECT email FROM users");

            // Send the emails
            // await sendMail(rows.map((row : { email : string }) => row.email), subject, text, html);

            // Close the database
            // await db.close();

            return res.status(200).end(html);
        });

    } else {
        return res.status(400).end("Invalid method");
    }
}