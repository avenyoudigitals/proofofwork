import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'noreply@yourdomain.com' // TODO: update to your verified Resend domain

export interface WelcomeEmailOptions {
  to: string
  name: string
}

export interface NotificationEmailOptions {
  to: string
  subject: string
  body: string
}

/**
 * Send a welcome email after a user signs up.
 */
export async function sendWelcomeEmail({ to, name }: WelcomeEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Welcome! 🎉',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #111;">Welcome, ${name}!</h1>
        <p style="color: #444; line-height: 1.6;">
          Your account has been created successfully. You're all set to get started.
        </p>
        <a
          href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
          style="
            display: inline-block;
            padding: 12px 24px;
            background: #111;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 16px;
          "
        >
          Go to Dashboard
        </a>
        <p style="color: #888; font-size: 13px; margin-top: 32px;">
          If you didn't create this account, you can safely ignore this email.
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send welcome email:', error)
  }

  return { data, error }
}

/**
 * Send a generic notification email.
 */
export async function sendNotificationEmail({
  to,
  subject,
  body,
}: NotificationEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p style="color: #444; line-height: 1.6;">${body}</p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send notification email:', error)
  }

  return { data, error }
}
