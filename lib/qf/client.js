import 'server-only';
import { getQFToken } from './oauth';

/**
 * Authorized fetch for Quran.Foundation content endpoints.
 * Usage: await qfAuthorizedFetch('https://prelive-api.quran.foundation/...')
 */
export async function qfAuthorizedFetch(url, init = {}) {
  const token = await getQFToken();
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  // default content type if body present and not set
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(url, { ...init, headers, cache: 'no-store' });
}
