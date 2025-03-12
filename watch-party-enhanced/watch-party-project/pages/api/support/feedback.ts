import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import nodemailer from 'nodemailer';

type FeedbackData = {
  email: string;
  subject: string;
  message: string;
  type: 'bug' | 'feature' | 'general' | 'payment';
  username: string;
  userId: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session to verify user (optional)
    const session = await getServerSession(req, res, authOptions);
    
    // Parse the request body
    const { email, subject, message, type, username, userId }: FeedbackData = req.body;
    
    // Validate required fields
    if (!email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create email transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.example.com',
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SERVER_USER || '',
        pass: process.env.EMAIL_SERVER_PASSWORD || '',
      },
    });
    
    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'support@ickbal-watch-party.com',
      to: process.env.SUPPORT_EMAIL || 'support@ickbal-watch-party.com',
      subject: `[${type.toUpperCase()}] ${subject}`,
      text: `
Feedback from: ${username} (${email})
User ID: ${userId || 'Not logged in'}
Type: ${type}

Message:
${message}
      `,
      html: `
<h2>Feedback from Watch Party User</h2>
<p><strong>From:</strong> ${username} (${email})</p>
<p><strong>User ID:</strong> ${userId || 'Not logged in'}</p>
<p><strong>Type:</strong> ${type}</p>

<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    // Send email (wrapped in try/catch to handle email sending errors)
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Store feedback in database even if email fails
      // This would be implemented with a database connection
    }
    
    // Store feedback in database (placeholder for future implementation)
    // This would be implemented with a database connection
    
    // Return success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
