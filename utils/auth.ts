import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export interface TokenParams {
    token? : string
}

export function verifyToken(token : string) {
    try {
        // Verify the token - throws an error if it is not
        jwt.verify(token, process.env.SERVER_SECRET as string);

        // Valid token
        return true;

    } catch {
        // Invalid token
        return false;
    }
}

export function genToken(timeToExpire : number = 60 * 60 * 24) {
    // Generate a token that by default lasts for one day
    const token = jwt.sign({ auth: "Admin" }, process.env.SERVER_SECRET as string, { expiresIn: timeToExpire });

    // Return the token
    return token;
}

export async function protectedMiddleware(req : NextApiRequest, res : NextApiResponse, callback : () => void | Promise<void>) {
    // Get the token from the request
    const { token } : TokenParams = req.cookies;

    // Check that the token exists
    if (typeof token === typeof undefined) {
        return res.status(403).end("Token is required");
    }

    // Verify that the token is valid
    const validToken = verifyToken(token);
    if (!validToken) {
        return res.status(403).end("Invalid token");
    }

    // Call the callback function and throw an error if it does
    try {
        await callback();

    } catch (e) {
        // Log the error and return error
        console.log(e);
        res.status(500).end("Internal Server Error");
    }
}