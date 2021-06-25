import type { NextApiRequest, NextApiResponse } from 'next';
import query from '../../utils/queryDB';

export default async function addEmail(req : NextApiRequest, res : NextApiResponse) : Promise<void> {
    if (req.method === 'POST') {
        // Get the email to add from the request
        const { email } = req.body;

        

        const status = await query("INSERT INTO emails (email) VALUES ($1)", [email]);
        console.log(status);

        res.status(200).json({ name: 'John Doe' })

    } else {
        return res.status(400).end("Invalid method");
    }
}
