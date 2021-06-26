import nodemailer from 'nodemailer';

export async function sendMail(addresses : string[], subject? : string, text? : string, html? : string) : Promise<void> {
    // Initialize the transport
    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    // Configure the options for the email
    const mailOptions : nodemailer.SendMailOptions = {
        from: process.env.GMAIL_USER,
        to: addresses.join(','),
        subject: subject,
        text: text,
        html: html
    }

    // Send the email
    await transport.sendMail(mailOptions);
}