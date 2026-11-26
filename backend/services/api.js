
import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";
import getApplicationAcceptedEmail from "./template.js";

dotenv.config();

const getBrevoClient = () => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing from environment variables");
  }

  return new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
  });
};

const getBrevoSender = () => {
  if (!process.env.BREVO_GMAIL) {
    throw new Error("BREVO_GMAIL is missing from environment variables");
  }

  return process.env.BREVO_GMAIL;
};

export const sendMail = async (
  email,
  userName,
  projectName,
  role,
  ownerName
) => {
  try {
    console.log("Sending email to:", email);

    const result = await getBrevoClient().transactionalEmails.sendTransacEmail({
      subject: "Application Accepted!",
      htmlContent: getApplicationAcceptedEmail(
        userName,
        projectName,
        role,
        ownerName
      ),
      sender: {
        name: "CodeApplication",
        email: getBrevoSender(),
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

const escapeHtml = (value = "") =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

export const sendPasswordResetOtp = async (email, userName, otp) => {
  const safeName = escapeHtml(userName || "there");

  try {
    return await getBrevoClient().transactionalEmails.sendTransacEmail({
      subject: "Your Student-Build password reset code",
      htmlContent: `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #25232A; max-width: 480px; margin: 0 auto; padding: 24px 16px;">
          <h1 style="font-size: 22px; margin: 0 0 20px;">Student-Build</h1>
          <p style="font-size: 15px; line-height: 1.6;">Hi ${safeName}, use this code to reset your password:</p>
          <p style="margin: 24px 0; padding: 16px; border-radius: 12px; background: #F1F3FF; color: #3048E8; text-align: center; font-size: 30px; font-weight: 700; letter-spacing: 8px;">${otp}</p>
          <p style="font-size: 14px; line-height: 1.6; color: #5C5964;">This code expires in 10 minutes and can only be used once. If you didn’t request a password reset, you can ignore this email.</p>
        </div>
      `,
      sender: {
        name: "Student-Build",
        email: getBrevoSender(),
      },
      to: [{ email, name: userName || email }],
    });
  } catch (error) {
    console.error(
      "Brevo password reset email error:",
      error instanceof Error ? error.message : "Unknown email service error",
    );
    throw error;
  }
};
