import { createTransport } from "nodemailer";
import { EMAIL_FROM, EMAIL_HOST, EMAIL_PASSWORD, EMAIL_USER } from "../consts";
import { User } from "../entities/user";

const transporter = createTransport({
  host: EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

function sendEmail(
  user: User,
  subject: string,
  text: string,
  html: string = text
) {
  return transporter.sendMail({
    from: EMAIL_FROM,
    to: user.email,
    subject,
    text,
    html,
  });
}
