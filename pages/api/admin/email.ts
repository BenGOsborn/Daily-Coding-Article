import { NextApiRequest, NextApiResponse } from "next";

export default async function auth(req : NextApiRequest, res : NextApiResponse) : Promise<void> {
    if (req.method === 'POST') {
        // I want to authenticate, then add the email template, then store it in a new table, then email it out

        // Maybe on top of this I want to have an additional tracking table where I can track what the users see and then track if the users open the emails through a link
        // That custom link is going to have to have bto scrape the head tags of the page to display in the URL

    } else {
        return res.status(400).end("Invalid method");
    }
}