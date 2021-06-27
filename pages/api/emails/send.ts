import { NextApiRequest, NextApiResponse } from "next";
import { protectedMiddleware } from "../../../utils/auth";
import compileTemplate, {
    TemplateContent,
} from "../../../emailTemplates/compileTemplate";
import DB from "../../../utils/db";
import { EmailParams, sendMail } from "../../../utils/email";
import { siteURL } from "../../../next.config";

export interface SendParams
    extends Omit<EmailParams, "addresses" | "text" | "html">,
        Omit<TemplateContent, "unsubscribe"> {
    test?: boolean;
}

export default async function send(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        // Verify that the details are correct
        protectedMiddleware(req, res, async () => {
            // Get the params from the request
            const { subject, title, body, articleURL, test }: SendParams =
                req.body;

            // Make sure all of the params are specified
            if (!(subject && title && body && articleURL)) {
                return res.status(400).end("Missing a parameter");
            }

            // Define the data to be emailed
            const unsubscribe = `${siteURL}/unsubscribe`;

            const text = `${title}\n\n${body}\n\n${articleURL}\n${unsubscribe}`;
            const html = await compileTemplate({
                title,
                body,
                articleURL,
                unsubscribe,
            });

            // If the message is a test, then send a single email to the the sender and return success
            if (test) {
                await sendMail({
                    addresses: [process.env.GMAIL_USER as string],
                    subject,
                    text,
                    html,
                });

                return res.status(200).end("Test email sent");
            }

            // Initialize connection to the database
            const db = new DB();

            // Get all of the emails
            const { rows } = await db.query("SELECT email FROM users");
            if (rows.length === 0) {
                return res.status(500).end("No users to email");
            }

            // Send the emails
            await sendMail({
                addresses: rows.map((row: { email: string }) => row.email),
                subject,
                text,
                html,
            });

            // Close the database
            await db.close();

            // Return success
            return res.status(200).end("Emails sent");
        });
    } else {
        return res.status(400).end("Invalid method");
    }
}
