const regPrefix = 'app';

const encodeKeyPart = (value: string) => encodeURIComponent(value.trim().toLowerCase());

const prefixedKey = (...parts: string[]) => [regPrefix, ...parts].join(':');

export const redisKeys = {
  pendingRegistration: (registrationId: string) =>
    prefixedKey('pending', 'registration', 'id', registrationId),
  pendingRegistrationByEmail: (email: string) =>
    prefixedKey('pending', 'registration', 'email', encodeKeyPart(email)),
};
