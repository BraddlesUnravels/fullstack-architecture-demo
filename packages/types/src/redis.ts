export type RegistrationState = 'pending' | 'verified';

export type PendingRegistrationRecord = {
  registrationId: string;
  email: string;
  state: RegistrationState;
  attempts?: number;
};
