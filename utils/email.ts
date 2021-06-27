import nodemailer from "nodemailer";

export interface EmailParams {
    addresses: string[];
    subject: string;
    text: string;
    html: string;
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
