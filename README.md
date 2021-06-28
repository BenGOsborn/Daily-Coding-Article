# [Daily Coding Article](https://daily-coding-article.herokuapp.com/)

## An email subscription service that sends you a new coding article every day to teach you something new.

### How it was built

The app was built using NextJS and TypeScript for both the frontend and backend. This provided me with a framework for building a frontend using ReactJS while still getting the benefits of server side rendering, as well as a backend REST API with ease. The backend is connected to a PostgreSQL database running on Heroku. The app is hosted on Heroku and is set up to automatically deploy to it whenever a commit is pushed to the main branch. The frontend is styled using Sass, which provides a much nicer experience compared to traditional CSS.

<br />

When a user subscribes, their email is stored in the database and an email notification is sent to the admin. To send out the emails, which is done using Nodemailer, the admin simply logs in to the dashboard and specifies the details of the email and sends it. He can send a test email to himself only to check if the email is error free before sending it out to everyone in the mailing list. When he sends the email out to the list, the parameters of the email specified in the admin dashboard are sent to the server and are parsed into the email template which is built and rendered using ejs. This is then emailed out to everyone subscribed.

<br />

When the user unsubscribes from the mailing list, the server simply removes them from the database and they will no longer receive emails. In addition to this, a notification is sent out to the admin to let him know.
