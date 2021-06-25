import type { NextApiRequest, NextApiResponse } from 'next';
import { genToken } from '../../../utils/auth';
import cookie from 'cookie';

export default async function adminLogin(req : NextApiRequest, res : NextApiResponse) {
    if (req.method === 'POST') {
        // Get the params from the request
        const { username, password } : { username : string, password : string } = req.body;

        // Verify the admin username and password
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            // Set the expiry of the token to be 1 day
            const expiry = 60 * 60 * 24;

            // Create a token
            const token = genToken(expiry);

            // Set the cookie of the user
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("Authorization", "Bearer " + token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: expiry,
                    sameSite: "strict",
                    path: "/"
                })
            );

            // Set the header
            return res.status(200).end(token);

        } else {
            // Return an error message
            return res.status(400).end("Invalid details");
        }

    } else {
        return res.status(400).end("Invalid method");
    }
}