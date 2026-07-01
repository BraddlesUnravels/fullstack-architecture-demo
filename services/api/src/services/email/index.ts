import { transport } from './transport';
import { template } from './email-template';

export const emailService = {
  testConnection: () => transport.verify(),
  sendConfirmEmail: (email: string, tokenUrl: string) => {
    return transport.sendMail({
      to: email,
      ...template.confirmEmail(tokenUrl),
    });
  },
  sendAccountCreated: (email: string, name: string, appLink: string) => {
    return transport.sendMail({
      to: email,
      ...template.accCreated(name, appLink),
    });
  },
  sendResetPassword: (email: string, name: string, tokenUrl: string, expiry: string) => {
    return transport.sendMail({
      to: email,
      ...template.resetPassword(name, tokenUrl, expiry),
    });
  },
};
