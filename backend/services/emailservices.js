import nodemailer from "nodemailer";
import "dotenv/config";

// 1. Create the transporter configuration
const transport = nodemailer.createTransport({

host: "smtp.gmail.com",
port: 465,
secure: true,
auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
}
})

const emailoptions = async (from,to,subject,text) => {

// 2. Define the email options
const options = {
from: from,                     //`"Todo App Verification" <${process.env.GMAIL_USER}>`,
to: to,                         // process.env.GMAIL_USER,
subject: subject,                  // "Hello From Todo App",
text: text                      // "This is a test email sent via a configured transporter.",
}

try{

const info = await transport.sendMail(options);
console.log("Email sent successfully! Message ID:", info.messageId);
}catch(error){
    console.error("Error occurred:", error);
}
}

export {
    emailoptions
}

