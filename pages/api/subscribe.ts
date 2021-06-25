import type { NextApiRequest, NextApiResponse } from 'next';
import DB from '../../utils/db';
import emailSchema from '../../joiSchema/emailSchema';

export default async function subscribe(req : NextApiRequest, res : NextApiResponse) : Promise<void> {
    if (req.method === 'POST') {
        // Get the email to add from the request
        const { email } : { email : string } = req.body;

        // Verify the email with the schema
        const { error } = emailSchema.validate({ email });
        if (error) {
            return res.status(400).end(error.details[0].message);
        }

        // Initialize the database
        const db = new DB();

        // Add the new email if it doesnt exist
        const inserted = await db.query("INSERT INTO emails (email) SELECT CAST($1 AS VARCHAR) WHERE NOT EXISTS (SELECT email FROM emails WHERE email = $1)", [email]);
        if (inserted.rowCount === 0) {
            return res.status(400).end("This email already exists");
        }

        // Close the connection
        db.close();

        // Return success
        return res.status(200).end("Successfully added email!")

    } else {
        return res.status(400).end("Invalid method");
    }
}
