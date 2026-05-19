import { createTransport } from 'nodemailer';
import { API_CONSTANTS } from '../../constants';

const EMAIL_USER = API_CONSTANTS.email.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const transport = createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});
