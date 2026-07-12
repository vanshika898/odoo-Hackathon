const nodemailer = require("nodemailer");
require('dotenv').config();
const mailSender =  function(email, title, body) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASS,
      },
    });

    const info = transporter.sendMail({
      from:'Team StudyNotion ',
      to: email,
      subject: title,
       html: body,
    });
  } catch (error) {
    console.log("Error happens while sending the email:", error);
  }
}
module.exports = mailSender;
