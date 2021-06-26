import type { NextApiRequest, NextApiResponse } from 'next';
import { protectedMiddleware } from '../../../utils/auth';
import DB from '../../../utils/db';

// This route is going to be used for some sort of dashboard that displays the statistics for all of the different users and such
// ****************** CURRENTLY USELESS

export default async function auth(req : NextApiRequest, res : NextApiResponse) : Promise<void> {
    if (req.method === 'GET') {
        protectedMiddleware(req, res, async () => {
            // Initialize the database
            const db = new DB();

            // Query the database for the data
            const baseQuery = "SELECT * FROM users WHERE created > NOW() - INTERVAL '1 DAY' * $1";

            // Get the number of users for different days
            const prevDay = (await db.query(baseQuery, [1])).rowCount;
            const prevWeek = (await db.query(baseQuery, [7])).rowCount;
            const prevMonth = (await db.query(baseQuery, [30])).rowCount;
            const total = (await db.query("SELECT * FROM users")).rowCount;

            // Close the database
            db.close();

            // Return the data
            return res.status(200).json({ prevDay, prevWeek, prevMonth, total });
        });
    }
}