import type { NextApiRequest, NextApiResponse } from 'next';
import DB from '../../utils/db';

export default async function subscribe(req : NextApiRequest, res : NextApiResponse) {
    if (req.method === 'DELETE') {
        // Get the email from the request
        const { email } : { email : string } = req.body;

        // Check that the email is specified in the request
        if (typeof email === typeof undefined) {
            return res.status(400).end("Email to be unsubscribed is required");
        }

        // Initialize the database connection
        const db = new DB();

        // Attempt to delete the item from the database if it exists
        const deleted = await db.query("DELETE FROM emails WHERE email = $1", [email]);
        if (deleted.rowCount === 0) {
            return res.status(400).end("Email doesn't exist");
        }

        // Close the connection
        db.close();

        // Return success
        return res.status(200).end("Successfully removed email");

    } else {
        return res.status(400).end("Invalid method");
    }
}