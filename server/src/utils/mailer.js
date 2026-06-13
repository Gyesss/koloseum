import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === "true",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtpEmail = async ({ to, name, otp, type }) => {
  const subjects = {
    EMAIL_VERIFY: "Verify Your Email Address",
    RESET_PASSWORD: "Reset Your Password",
  };

  const titles = {
    EMAIL_VERIFY: "Email Verification",
    RESET_PASSWORD: "Password Reset",
  };

  const descriptions = {
    EMAIL_VERIFY:
      "Use the OTP code below to verify your email address. This code is valid for <strong>10 minutes</strong>.",
    RESET_PASSWORD:
      "Use the OTP code below to reset your password. This code is valid for <strong>10 minutes</strong>.",
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${subjects[type]}</title>
      </head>
      <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:#4f46e5;padding:32px 40px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">${titles[type]}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 40px;">
                    <p style="margin:0 0 16px;color:#374151;font-size:15px;">Hello, <strong>${name}</strong>!</p>
                    <p style="margin:0 0 28px;color:#6b7280;font-size:14px;line-height:1.6;">
                      ${descriptions[type]}
                    </p>
                    <div style="text-align:center;margin:0 0 28px;">
                      <span style="display:inline-block;background:#f3f4f6;border-radius:8px;padding:18px 40px;font-size:36px;font-weight:700;letter-spacing:10px;color:#4f46e5;">${otp}</span>
                    </div>
                    <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                      If you did not request this, please ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f9fafb;padding:20px 40px;text-align:center;">
                    <p style="margin:0;color:#d1d5db;font-size:12px;">&copy; ${new Date().getFullYear()} All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject: subjects[type],
    html,
  });
};
