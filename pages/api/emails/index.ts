import type { NextApiRequest, NextApiResponse } from 'next';
import DB from '../../../utils/db';
import emailSchema from '../../../joiSchema/emailSchema';

export default async function subscribe(req : NextApiRequest, res : NextApiResponse) : Promise<void> {
    if (req.method === 'POST') {
        // Get the email to add from the request
        const { email } : { email? : string } = req.body;

        // Verify the email with the schema
        const { error } = emailSchema.validate({ email });
        if (error) {
            return res.status(400).end(error.details[0].message);
        }

        // Initialize the database
        const db = new DB();

        // Add the new email if it doesnt exist
        const inserted = await db.query("INSERT INTO users (email) SELECT CAST($1 AS VARCHAR) WHERE NOT EXISTS (SELECT email FROM users WHERE email = $1)", [email]);
        if (inserted.rowCount === 0) {
            return res.status(500).end("Failed to subscribe email");
        }

        // Close the connection
        db.close();

        // Return success
        return res.status(200).end("Successfully subscribed email!")

    } else if (req.method === 'DELETE') {
        // Get the email from the request
        const { email } : { email? : string } = req.body;

        // Check that the email is specified in the request
        if (typeof email === typeof undefined) {
            return res.status(400).end("Invalid user ID");
        }

        // Initialize the database connection
        const db = new DB();

        // Attempt to delete the item from the database if it exists
        const deleted = await db.query("DELETE FROM users WHERE email = $1", [email]);
        if (deleted.rowCount === 0) {
            return res.status(500).end("Failed to unsubscribe email");
        }

        // Close the connection
        db.close();

        // Return success
        return res.status(200).end("Successfully unsubscribed email");

    } else {
        return res.status(400).end("Invalid method");
    }
}