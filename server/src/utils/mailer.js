import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      'Use the OTP code below to verify your email address. This code is valid for <strong style="color:#b69463;">10 minutes</strong>.',
    RESET_PASSWORD:
      'Use the OTP code below to reset your password. This code is valid for <strong style="color:#b69463;">10 minutes</strong>.',
  };

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subjects[type]}</title>
      </head>
      <body style="margin:0;padding:0;background:#fffaf2;font-family:'Inter',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffaf2;padding:48px 0;">
          <tr>
            <td align="center">
              <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #dcc8a6;box-shadow:0 4px 24px rgba(182,148,99,0.08);">

                <!-- Top gradient accent -->
                <tr>
                  <td style="height:4px;background:linear-gradient(to right,#dcc8a6,#b69463,#d6b98c);font-size:0;line-height:0;">&nbsp;</td>
                </tr>

                <!-- Header -->
                <tr>
                  <td style="background:#fffaf2;padding:36px 48px 28px;text-align:center;border-bottom:1px solid #dcc8a6;">
                    <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:0.35em;color:#b69463;text-transform:uppercase;">Koloseum</p>
                    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:600;color:#44403c;letter-spacing:-0.5px;">${titles[type]}</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 48px;">
                    <p style="margin:0 0 12px;font-size:15px;color:#44403c;">Hello, <strong style="color:#44403c;">${name}</strong>!</p>

                    <p style="margin:0 0 32px;font-size:14px;color:#78716c;line-height:1.7;">
                      ${descriptions[type]}
                    </p>

                    <!-- OTP Box -->
                    <div style="text-align:center;margin:0 0 32px;">
                      <div style="display:inline-block;background:#fffaf2;border:1px solid #dcc8a6;border-radius:16px;padding:20px 48px;">
                        <span style="font-family:Georgia,'Times New Roman',serif;font-size:40px;font-weight:700;letter-spacing:12px;color:#b69463;">${otp}</span>
                      </div>
                    </div>

                    <!-- Divider -->
                    <div style="height:1px;background:#dcc8a6;margin:0 0 28px;"></div>

                    <p style="margin:0;font-size:12px;color:#78716c;text-align:center;line-height:1.6;">
                      If you did not request this, please ignore this email.<br/>
                      Do not share this code with anyone.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#fffaf2;border-top:1px solid #dcc8a6;padding:20px 48px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.3em;color:#b69463;text-transform:uppercase;">Koloseum</p>
                    <p style="margin:0;font-size:11px;color:#dcc8a6;">&copy; ${new Date().getFullYear()} All rights reserved.</p>
                  </td>
                </tr>

              </table>

              <!-- Bottom note -->
              <p style="margin:20px 0 0;font-size:11px;color:#78716c;text-align:center;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await resend.emails.send({
    from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject: subjects[type],
    html,
  });
};
