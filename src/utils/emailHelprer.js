import nodemailer from "nodemailer";

const mailHelper = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: "alakhkaler.ak@gmail.com", // sender address
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(message);
};

export { mailHelper };