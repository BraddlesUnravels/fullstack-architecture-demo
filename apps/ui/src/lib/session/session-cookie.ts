import type { SessionEvent, SessionData } from '../types';

export const setSessionCookie = (
  event: SessionEvent,
  session: SessionData,
): void =>
  event.cookie.set('sid', session.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(session.exp * 1000),
  });

export const clearSessionCookie = (event: SessionEvent): void =>
  event.cookie.delete('sid', { path: '/' });
