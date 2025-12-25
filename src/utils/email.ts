import { env } from '@config/env';
import { EmailOptionsInterface } from 'interface/authInterface';
import nodemailer from 'nodemailer';

// Send an email using async/await
export const sendEmail = async (options: EmailOptionsInterface) => {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: false, // Use true for port 465, false for port 587
    auth: {
      user: env.EMAIL_USERNAME || '',
      pass: env.EMAIL_PASSWORD || '',
    },
  });

  const info = await transporter.sendMail({
    from: '"Support" <pramit.io@gmail.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    // html: '<b>Hello world?</b>', // HTML version of the message
  });

  console.log('Message sent:', info.messageId);
};
