import type { NextApiRequest, NextApiResponse } from "next";
import DB from "../../../utils/db";
import emailSchema from "../../../joiSchema/emailSchema";
import { sendNotification } from "../../../utils/email";

export interface SubscribeParams {
    email: string;
}

export interface UnsubscribeParams {
    email: string;
}

export default async function subscribe(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        // Get the email to add from the request
        const { email }: SubscribeParams = req.body;

        // Verify the email with the schema
        const { error } = emailSchema.validate({ email });
        if (error) {
            return res.status(400).end(error.details[0].message);
        }

        // Initialize the database
        const db = new DB();

        // Check if the email already exists
        const { rows: existingEmails } = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (existingEmails.length > 0) {
            return res.status(200).end("Email is already subscribed");
        }

        // Add the new email if it doesnt exist
        const inserted = await db.query(
            "INSERT INTO users (email) VALUES ($1)",
            [email]
        );
        if (inserted.rowCount === 0) {
            return res.status(500).end("Failed to subscribe email");
        }

        // Close the connection
        db.close();

        // Notify the admin
        sendNotification("subscribed");

        // Return success
        return res.status(200).end("Email subscribed");
    } else if (req.method === "DELETE") {
        // Get the email from the request
        const { email }: UnsubscribeParams = req.body;

        // Check that the email is specified in the request
        if (typeof email === typeof undefined) {
            return res.status(400).end("Missing parameter");
        }

        // Initialize the database connection
        const db = new DB();

        // Attempt to delete the item from the database if it exists
        const deleted = await db.query("DELETE FROM users WHERE email = $1", [
            email,
        ]);
        if (deleted.rowCount === 0) {
            return res.status(500).end("Failed to unsubscribe email");
        }

        // Close the connection
        db.close();

        // Notify the admin
        sendNotification("unsubscribed");

        // Return success
        return res.status(200).end("Successfully unsubscribed email");
    } else {
        return res.status(400).end("Invalid method");
    }
}
