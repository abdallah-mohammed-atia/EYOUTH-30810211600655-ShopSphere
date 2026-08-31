const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { to, name } = req.body || {};

    if (!to || !name) {
      return res.status(400).json({ message: 'to and name are required' });
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`[welcome-email job] SMTP not configured; skipping send for ${to}`);
      return res.status(200).json({ status: 'skipped', reason: 'SMTP not configured' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: 'Welcome to Zashop',
      text: `Hi ${name}, welcome to Zashop!`,
    });

    console.log(`[welcome-email job] Sent welcome email to ${to}`);
    return res.status(200).json({ status: 'sent' });
  } catch (err) {
    console.error('[welcome-email job] Failed:', err.message);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
