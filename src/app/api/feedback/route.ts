import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { name, email, message } = payload || {};

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.FEEDBACK_EMAIL_TO || 'feedback@edudashpro.org.za';

    if (resendApiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'EduDash Pro <support@edudashpro.org.za>',
          reply_to: email,
          to: [toEmail],
          subject: `Website Feedback${name ? ` from ${name}` : ''}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Website Feedback</h2>
              <p><strong>Name:</strong> ${name || 'N/A'}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
              <p style="color: #6b7280; font-size: 12px;">Generated via the website feedback form.</p>
            </div>
          `,
        }),
      });
    }

    console.log('[Feedback] Submission', payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ success: true });
  }
}
