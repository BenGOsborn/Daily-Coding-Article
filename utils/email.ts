import nodemailer from "nodemailer";

export interface EmailParams {
    addresses: string[];
    subject: string;
    text: string;
    html?: string;
}

export async function sendMail(params: EmailParams): Promise<void> {
    // Initialize the transport
    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    // Configure the options for the email
    const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.GMAIL_USER,
        to: params.addresses.join(","),
        subject: params.subject,
        text: params.text,
        html: params.html,
    };

    // Send the email
    await transport.sendMail(mailOptions);
}

type Notification = "subscribed" | "unsubscribed";

export async function sendNotification(
    notificationType: Notification
): Promise<void> {
    // Initialize the transport
    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    // Initialize the mail options
    let mailOptions: nodemailer.SendMailOptions;

    // Set the content of the email based on the type of notification
    if (notificationType === "subscribed") {
        // Configure the mail options for subscribed email
        mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: "User Subscribed - Daily Coding Article",
            text: "A user has subscribed to the Daily Coding Article mailing list.",
        };
    } else {
        // Configure the mail options for unsubscribed email
        mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: "User Unsubscribed - Daily Coding Article",
            text: "A user has unsubscribed from the Daily Coding Article mailing list.",
        };
    }

    // Send the email
    await transport.sendMail(mailOptions);
}
