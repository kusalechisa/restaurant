// email.service.js
import { getTransporter } from "../config/mail.config.js";
import { generateEmail } from "./mailgen.config.js";

export async function sendEmailReceipt(order) {
  const transporter = getTransporter();
  const emailContent = generateEmail(order);

  try {
    await transporter.sendMail({
      from: "kusalechisac@gmail.com.com",
      to: user.email,
      subject: `Order ${order.id} is being processed`,
      html: emailContent,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
