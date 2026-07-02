import 'server-only';
import { getQFToken } from './oauth';

function getEnv() {
  const isLive = process.env.QF_ENV === 'live';
  const clientId = isLive ? process.env.QF_LIVE_CLIENT_ID : process.env.QF_PRELIVE_CLIENT_ID;
  const contentBase = process.env.QF_CONTENT_BASE_URL || (isLive ? 'https://apis.quran.foundation' : 'https://apis-prelive.quran.foundation');
  return { isLive, clientId, contentBase };
}

function toUrl(pathOrUrl, base) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const trimmedBase = base.replace(/\/$/, '');
  const trimmedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${trimmedBase}${trimmedPath}`;
}

/**
 * Fetch against Quran.Foundation Content APIs using required headers.
 * Adds: x-auth-token (Bearer) and x-client-id.
 */
export async function qfContentFetch(pathOrUrl, init = {}) {
  const { clientId, contentBase } = getEnv();
  if (!clientId) throw new Error('QF client id missing in env');
  const token = await getQFToken();
  const url = toUrl(pathOrUrl, contentBase);
  const headers = new Headers(init.headers || {});
  headers.set('x-auth-token', token);
  headers.set('x-client-id', clientId);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  return fetch(url, { ...init, headers, cache: 'no-store' });
}
