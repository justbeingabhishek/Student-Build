
import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";
import getApplicationAcceptedEmail from "./template.js";

dotenv.config();

if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY is missing from environment variables");
}

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendMail = async (
  email,
  userName,
  projectName,
  role,
  ownerName
) => {
  try {
    console.log("Sending email to:", email);

    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Application Accepted!",
      htmlContent: getApplicationAcceptedEmail(
        userName,
        projectName,
        role,
        ownerName
      ),
      sender: {
        name: "CodeApplication",
        email: process.env.BREVO_GMAIL,
      },
      to: [
        {
          email: email,
          name: userName,
        },
      ],
    });

    console.log("Email sent successfully:", result.messageId);

    return result;

  } catch (error) {
    console.error("Brevo email error:", error.message);
    console.error("Brevo error details:", error.body || error);

    throw error;
  }
};
