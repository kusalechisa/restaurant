// mail.config.js
import nodemailer from 'nodemailer';

export function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com", // Replace with your SMTP server
    port: 587, // Replace with the port your SMTP server uses
    secure: false, // Use true for port 465, false for other ports
    auth: {
      user: "kusalechisac@gmail.com", // Replace with your email address
      pass: "sntvidibsyjafsnm", // Replace with your email password
    },
  });
}
