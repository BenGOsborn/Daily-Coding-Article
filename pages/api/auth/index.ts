import type { NextApiRequest, NextApiResponse } from 'next';
import { genAuthorization } from '../../../utils/auth';
import cookie from 'cookie';

export default function auth(req : NextApiRequest, res : NextApiResponse) {
    if (req.method === 'POST') {
        // Get the params from the request
        const { username, password } : { username? : string, password? : string } = req.body;

        // Verify the admin username and password
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            // Set the expiry of the token to be 1 day
            const expiry = 60 * 60 * 24;

            // Set the cookie of the user
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("Authorization", genAuthorization(expiry), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: expiry,
                    sameSite: "strict",
                    path: "/"
                })
            );

            // Set the header
            return res.status(200).end("Login successful");

        } else {
            // Return an error message
            return res.status(400).end("Invalid details");
        }

    } else if (req.method === 'DELETE') {
        // Determine if the cookie exists
        const { Authorization } : { Authorization? : string } = req.cookies;

        // Check that there is a cookie else return error
        if (!Authorization) {
            return res.status(400).end("Not logged in");
        }

        // Delete the cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("Authorization", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                expires: new Date(0),
                sameSite: "strict",
                path: "/"
            })
        );

        // Return success
        return res.status(200).end("Logout successful");

    } else {
        // Return error
        return res.status(400).end("Invalid method");
    }
}