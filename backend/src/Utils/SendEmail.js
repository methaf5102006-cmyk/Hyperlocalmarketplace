// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (toEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ya apna SMTP provider
      auth: {
        user: process.env.EMAIL_USER,   // .env me set karein
        pass: process.env.EMAIL_PASS,   // .env me set karein (app password)
      },
    });

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2><p>This code will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Email sending failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;