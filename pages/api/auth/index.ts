import type { NextApiRequest, NextApiResponse } from 'next';
import { genToken } from '../../../utils/auth';
import cookie from 'cookie';
import { TokenParams } from '../../../utils/auth';

export interface LoginParams {
    username : string,
    password : string
}

export default async function auth(req : NextApiRequest, res : NextApiResponse) {
    if (req.method === 'POST') {
        // Get the params from the request
        const { username, password } : LoginParams = req.body;

        // Verify the admin username and password
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            // Set the expiry of the token to be 1 day
            const expiry = 60 * 60 * 24;

            // Generate the token
            const token = genToken(expiry);

            // Set the cookie that contains the token
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: expiry,
                    sameSite: "strict",
                    path: "/"
                })
            );

            // Return the token
            return res.status(200).end(token);

        } else {
            // Return an error message
            return res.status(400).end("Invalid details");
        }

    } else if (req.method === 'DELETE') {
        // Determine if the cookie exists
        const { token } : TokenParams = req.cookies;

        // Check that the user is logged in with a token
        if (typeof token === typeof undefined) {
            return res.status(400).end("Not logged in");
        }

        // Delete the cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", "", {
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