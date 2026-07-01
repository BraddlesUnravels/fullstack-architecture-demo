const regPrefix = 'app';

const encodeKeyPart = (value: string) => encodeURIComponent(value.trim().toLowerCase());

const prefixedKey = (...parts: string[]) => [regPrefix, ...parts].join(':');

export const redisKeys = {
  pendingRegistration: (registrationId: string) =>
    prefixedKey('auth', 'registration', 'pending', registrationId),
  pendingRegistrationByEmail: (email: string) =>
    prefixedKey('auth', 'registration', 'email', encodeKeyPart(email)),
};
