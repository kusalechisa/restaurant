// email.service.js
import { getTransporter } from "../config/mail.config.js";
import { UserModel } from "../models/user.model.js";
import { generateEmail } from "./mailgen.config.js";

export async function sendEmailReceipt(order) {
  const transporter = getTransporter();
  const emailContent = generateEmail(order);

  try {
    // Fetch the user's email using the user ID in the order
    const user = await UserModel.findById(order.user);

    if (!user || !user.email) {
      throw new Error("User email not found");
    }

    // Send email
    await transporter.sendMail({
      from: "kusalechisac@gmail.com",
      to: user.email || "yadilechisa51@gmail.com", // Fallback email if user email is not found
      subject: `You Order is being processed`,
      html: emailContent,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

