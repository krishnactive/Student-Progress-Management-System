import nodemailer from 'nodemailer';

export const sendReminderEmail = async (email, name) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Skillworm Bot" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Let’s get back to Codeforces!',
    html: `<p>Hi ${name},</p><p>We noticed you haven’t made any submissions in a while. Let's get back to problem-solving!</p>`,
  });
};
