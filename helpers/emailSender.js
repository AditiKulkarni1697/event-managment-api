const nodemailer = require("nodemailer");

require("dotenv").config();

async function sendMail(emailArray, subject, content){
    try{
        const transpoter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.systemEmail,
            pass: process.env.gmailPass
          },
        })

        const recepients_emails = emailArray.join(", ")

        const mailOptions = {
            from: process.env.systemEmail,
            to: recepients_emails,
            subject: subject,
            html: content
        };

        const send = await transpoter.sendMail(mailOptions);

        return send;
    }catch(err){
logger.error('Error message', err.message);
        return err.message
    }
}

module.exports = {sendMail}