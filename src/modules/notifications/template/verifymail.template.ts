export const verifyMail = (name: string, code: string) => (`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Verification Code</title>
        </head>
        <body style="margin:0; padding:0; background:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6fb" style="padding:30px 0;">
                <tr>
                    <td align="center">
                        <!-- Container -->
                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="padding:20px; font-size:18px; font-weight:bold; color:#111827;">
                                Hello ${name},
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td colspan="2" style="padding:30px 20px 20px;">
                            <h1 style="margin:0 0 10px; font-size:20px; color:#111827;">Your verification code</h1>
                            <p style="margin:0; font-size:14px; color:#6b7280;">Use this code, verification code expires in 10 minutes.</p>
                            </td>
                        </tr>
                        <!-- Code -->
                        <tr>
                            <td colspan="2" align="center" style="padding:20px;">
                            <div style="font-size:32px; font-weight:bold; letter-spacing:8px; background:#f9fafb; padding:15px 20px; border:1px solid #e5e7eb; border-radius:8px; display:inline-block; color:#111827;">
                                ${code}
                            </div>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td colspan="2" style="padding:20px; font-size:12px; color:#6b7280;">
                                If you didn’t request this, you can ignore this email.  
                            <br><br>
                                Best Regards,
                                Vaultiva Team.
                            </td>
                        </tr>
                        </table>
                        <!-- /container -->
                    </td>
                </tr>
            </table>
        </body>
    </html>
`)

export const verifyMessage = (code: string) => (`
    *Verification Code is*

        Code: *${code}*

    Expires in 10 mins
    Do not share with anyone.
`)