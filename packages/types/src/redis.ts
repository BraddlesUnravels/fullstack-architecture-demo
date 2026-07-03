export type PendingRegistrationRecord = {
  registrationId: string;
  email: string;
  attempts?: number;
};
