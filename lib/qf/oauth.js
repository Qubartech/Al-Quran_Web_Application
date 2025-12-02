import 'server-only';

let cachedToken = null;
let cachedExpiry = 0; // epoch ms

function getEnvConfig() {
  const env = process.env.QF_ENV === 'live' ? 'live' : 'prelive';
  if (env === 'live') {
    return {
      clientId: process.env.QF_LIVE_CLIENT_ID,
      clientSecret: process.env.QF_LIVE_CLIENT_SECRET,
      oauthBase: process.env.QF_LIVE_OAUTH_URL || 'https://oauth2.quran.foundation',
    };
  }
  return {
    clientId: process.env.QF_PRELIVE_CLIENT_ID,
    clientSecret: process.env.QF_PRELIVE_CLIENT_SECRET,
    oauthBase: process.env.QF_PRELIVE_OAUTH_URL || 'https://prelive-oauth2.quran.foundation',
  };
}

export async function getQFToken() {
  const now = Date.now();
  if (cachedToken && cachedExpiry - 5000 > now) {
    return cachedToken;
  }

  const { clientId, clientSecret, oauthBase } = getEnvConfig();
  if (!clientId || !clientSecret) {
    throw new Error('QF client credentials are not configured. Set them in .env.local');
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const url = `${oauthBase.replace(/\/$/, '')}/oauth2/token`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=content',
    // Do not cache tokens via Next cache
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to get QF token: ${res.status} ${text}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  cachedExpiry = now + (Number(data.expires_in || 3600) * 1000);
  return cachedToken;
}

export function _qfTokenDebug() {
  return { hasToken: Boolean(cachedToken), expiresAt: cachedExpiry };
}
