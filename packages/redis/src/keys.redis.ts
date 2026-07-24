const REG_PREFIX = 'reg';
const SESSION_PREFIX = 'sess';

const encodeKeyPart = (value: string) =>
  encodeURIComponent(value.trim().toLowerCase());

const prefixReg = (...parts: string[]) => [REG_PREFIX, ...parts].join(':');
const prefixSess = (...parts: string[]) => [SESSION_PREFIX, ...parts].join(':');

export const redisKeys = {
  pendingRegistration: (registrationId: string) =>
    prefixReg('pending', 'registration', 'id', registrationId),
  pendingRegistrationByEmail: (email: string) =>
    prefixReg('pending', 'registration', 'email', encodeKeyPart(email)),
  sessionByTokenHash: (sessionTokenHash: string) =>
    prefixSess('token', sessionTokenHash),
};
