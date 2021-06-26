import jwt from 'jsonwebtoken';

export function verifyAuthorization(authorization : string) : boolean {
    const token = authorization.split(" ")[1];

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

export function genAuthorization(timeToExpire : number = 60 * 60 * 24) : string {
    // Generate a token that by default lasts for one day
    const token = jwt.sign({ auth: "Admin" }, process.env.SERVER_SECRET as string, { expiresIn: timeToExpire });

    // Return the token
    return "Bearer " + token;
}