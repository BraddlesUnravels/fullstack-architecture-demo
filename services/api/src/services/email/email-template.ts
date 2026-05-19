const confirmEmail = (tokenUrl: string) => ({
  subject: 'Confirm your StackChatr account',
  html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Confirm your account</title>
      </head>
      <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f6f8;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 0;">
              <table width="600" style="background:#ffffff;padding:30px;border-radius:8px;">
                <tr>
                  <td>
                    <h2 style="margin-top:0;">Welcome to StackChatr, ${name}</h2>
                    <p>Thanks for registering. Please confirm your email to activate your account.</p>


                <div style="text-align:center;margin:30px 0;">
                  <a href="${tokenUrl}" 
                    style="background:#4CAF50;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">
                    Confirm Email
                  </a>
                </div>

                <p>If you didn’t create this account, you can ignore this email.</p>

                <p style="font-size:12px;color:#888;">
                  Or copy and paste this link:<br/>
                  ${tokenUrl}
                </p>
              </td>
            </tr>
          </table>
          <p style="font-size:12px;color:#999;">© ${new Date().getFullYear()} StackChatr</p>
      </body>
      </html>
    `,
});

const accCreated = (name: string, appLink: string) => ({
  subject: 'Your StackChatr account has been created',
  html: `
      <!DOCTYPE html>

      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Account created</title>
      </head>
      <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f6f8;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 0;">
              <table width="600" style="background:#ffffff;padding:30px;border-radius:8px;">
                <tr>
                  <td>
                    <h2 style="margin-top:0;">Hi ${name}, your account is ready</h2>
                    <p>Your StackChatr account has been successfully created.</p>

                <p>You can now start tracking your job applications, organize opportunities, and stay on top of your progress.</p>

                <div style="text-align:center;margin:30px 0;">
                  <p>Get started with your new account by clicking the button below to set the account password:</p>
                  <a href="${appLink}" 
                    style="background:#007BFF;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">
                    Open StackChatr
                  </a>
                </div>

                <p>If you have any questions, feel free to reach out.</p>
              </td>
            </tr>
          </table>
          <p style="font-size:12px;color:#999;">© ${new Date().getFullYear()} StackChatr</p>
        </td>
      </tr>

        </table>
      </body>
      </html>
    `,
});

const resetPassword = (name: string, tokenUrl: string, expiry: string) => ({
  subject: 'Reset your StackChatr password',
  html: `
    <!DOCTYPE html>

    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password reset</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f6f8;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="600" style="background:#ffffff;padding:30px;border-radius:8px;">
              <tr>
                <td>
                  <h2 style="margin-top:0;">Reset your password</h2>
                  <p>Hi ${name},</p>
                  <p>We received a request to reset your password.</p>


              <div style="text-align:center;margin:30px 0;">
                <a href="${tokenUrl}" 
                  style="background:#e53935;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">
                  Reset Password
                </a>
              </div>

              <p>This link will expire in ${expiry}.</p>

              <p>If you didn’t request this, you can safely ignore this email.</p>

              <p style="font-size:12px;color:#888;">
                Or copy and paste this link:<br/>
                ${tokenUrl}
              </p>
            </td>
          </tr>
        </table>
        <p style="font-size:12px;color:#999;">© ${new Date().getFullYear()} StackChatr</p>
      </td>
    </tr>

      </table>
    </body>
    </html>
  `,
});

export const template = {
  confirmEmail,
  accCreated,
  resetPassword,
};
