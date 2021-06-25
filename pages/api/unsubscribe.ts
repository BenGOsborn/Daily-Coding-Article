import type { NextApiRequest, NextApiResponse } from 'next';
import DB from '../../utils/db';

export default async function subscribe(req : NextApiRequest, res : NextApiResponse) {
    if (req.method === 'DELETE') {
        // Get the email from the request
        const { userID } : { userID : string } = req.body;

        // Check that the email is specified in the request
        if (typeof userID === typeof undefined) {
            return res.status(400).end("Invalid user ID");
        }

        // Initialize the database connection
        const db = new DB();

        // Attempt to delete the item from the database if it exists
        const deleted = await db.query("DELETE FROM emails WHERE user_id = $1", [userID]);
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