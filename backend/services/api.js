
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
      subject: "Your Student-Build verification code",
      textContent: [
        `Hi ${userName || "there"},`,
        "",
        "We received a request to reset your Student-Build password.",
        `Your verification code is: ${otp}`,
        "",
        "This code expires in 10 minutes and can only be used once.",
        "If you did not request this, you can ignore this email. Never share this code with anyone.",
      ].join("\n"),
      htmlContent: `
        <!doctype html>
        <html lang="en">
          <body style="margin:0; padding:0; background-color:#F4F5F8; font-family:Arial, Helvetica, sans-serif; color:#20212A;">
            <div style="display:none; max-height:0; overflow:hidden; opacity:0;">Use this one-time code to reset your Student-Build password.</div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F7F6F3; padding:36px 12px;">
              <tr>
                <td align="center">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px; background-color:#FFFFFF; border:1px solid #E4E1D9; border-radius:12px;">
                    <tr>
                      <td style="padding:28px 32px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td valign="middle" width="36" height="36" style="width:36px; height:36px; border-radius:9px; background-color:#3048E8; color:#FFFFFF; text-align:center; font-size:17px; font-weight:700;">D</td>
                            <td valign="middle" style="padding-left:10px; color:#20212A; font-size:16px; font-weight:700;">Student-Build</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px 32px 28px;">
                        <p style="margin:0 0 8px; color:#77747C; font-size:13px; line-height:20px;">PASSWORD RESET</p>
                        <h1 style="margin:0 0 12px; color:#20212A; font-size:24px; line-height:32px; font-weight:700;">Reset your password</h1>
                        <p style="margin:0 0 22px; color:#5C5964; font-size:15px; line-height:24px;">Hi ${safeName}, use the verification code below to reset your Student-Build password.</p>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 14px; background-color:#F4F5FF; border:1px solid #E4E7FF; border-radius:10px;">
                          <tr>
                            <td align="center" style="padding:18px 12px; color:#3048E8; font-size:30px; line-height:38px; font-weight:700; letter-spacing:7px;">${otp}</td>
                          </tr>
                        </table>
                        <p style="margin:0 0 20px; color:#5C5964; font-size:14px; line-height:22px;">This code expires in <strong style="color:#20212A;">10 minutes</strong> and can only be used once.</p>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F7F6F3; border-radius:8px;">
                          <tr>
                            <td style="padding:12px 14px; color:#5C5964; font-size:13px; line-height:20px;">For your security, never share this code. Student-Build staff will never ask you for it.</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:18px 32px 24px; border-top:1px solid #ECEAE5; color:#77747C; font-size:12px; line-height:19px;">
                        If you didn’t request a password reset, ignore this email. Your password will remain unchanged.
                      </td>
                    </tr>
                  </table>
                  <p style="margin:16px 0 0; color:#8B8790; font-size:11px; line-height:17px;">Student-Build · Find your circle. Build together.</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
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
