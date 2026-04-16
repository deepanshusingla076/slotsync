const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter using the provided credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.submitContact = async (req, res) => {
  try {
    const { type, email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    const subject = type === 'feedback' 
      ? `SlotSync Feedback from ${email}` 
      : `SlotSync Contact from ${email}`;

    const mailOptions = {
      from: '"SlotSync Platform" <deepanshusingla0746@gmail.com>',
      to: 'deepanshusingla0746@gmail.com',
      replyTo: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #006BFF; padding: 20px; color: white;">
            <h2 style="margin: 0;">New ${type === 'feedback' ? 'Feature Request' : 'Contact Message'}</h2>
          </div>
          <div style="padding: 24px; background-color: #f8fafc;">
            <p><strong>From:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 16px; border: 1px solid #e2e8f0; border-radius: 6px; white-space: pre-wrap;">${message}</div>
          </div>
          <div style="background-color: #f1f5f9; padding: 12px; text-align: center; color: #64748b; font-size: 12px;">
            Sent automatically via SlotSync
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ error: 'Failed to send message: ' + error.message });
  }
};
