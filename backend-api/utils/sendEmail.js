const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    console.log(`Sending email to: ${options.email}`);
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to: ${options.email}`);
  } catch (error) {
    console.error(`Error sending email to ${options.email}:`, error);
    throw error;
  }
};

module.exports = sendEmail;
