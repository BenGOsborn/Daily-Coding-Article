import type { NextApiRequest, NextApiResponse } from 'next';
import DB from '../../../utils/db';
import emailSchema from '../../../joiSchema/emailSchema';
import { v4 as uuidv4 } from 'uuid';

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

        // Generate a userID to be inserted
        const userID = uuidv4();

        // Add the new email if it doesnt exist
        const inserted = await db.query("INSERT INTO users (email, user_id) SELECT CAST($1 AS VARCHAR), $2 WHERE NOT EXISTS (SELECT email FROM users WHERE email = $1)", [email, userID]);
        if (inserted.rowCount === 0) {
            return res.status(500).end("Failed to subscribe email");
        }

        // Close the connection
        db.close();

        // Return success
        return res.status(200).end("Successfully subscribed email!")

    } else {
        return res.status(400).end("Invalid method");
    }
}
