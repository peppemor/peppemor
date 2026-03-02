import { Request, Response } from 'express';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = new Resend(resendApiKey);

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
const TO_EMAIL = 'peppemor.napoli@gmail.com';

export const contactController = {
  async sendContact(req: Request, res: Response) {
    try {
      const { name, email, message } = req.body || {};

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email and message are required' });
      }

      if (!resendApiKey) {
        return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
      }

      await resend.emails.send({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        replyTo: email,
        subject: `New contact message from ${name}`,
        html: `
          <h1>New Contact Message</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Contact email error:', error);
      return res.status(500).json({ error: error.message || 'Failed to send contact email' });
    }
  },
};
