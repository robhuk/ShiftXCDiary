const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const SESSION_TTL = 60 * 60 * 24 * 30;
const STATE_TTL = 600;
const TICKET_TTL = 300;
const BACKUP_NAME = 'XC-ShiftApp-Backup.json';
const BACKUP_FOLDER = 'XC ShiftApp Backups';
const APP_ID = 'uk.co.crosscountry.shiftapp';

function json(data, status = 200, origin = '*') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Vary': 'Origin'
    }
  });
}
function randomHex(bytes = 32) {
  const data = crypto.getRandomValues(new Uint8Array(bytes));
  return [...data].map(x => x.toString(16).padStart(2, '0')).join('');
}
function b64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
function unb64(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}
async function encryptionKey(env) {
  if (!env.TOKEN_ENCRYPTION_KEY) throw new Error('Worker secret TOKEN_ENCRYPTION_KEY is not configured.');
  const raw = unb64(env.TOKEN_ENCRYPTION_KEY.trim());
  if (raw.length !== 32) throw new Error('TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.');
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}
async function encrypt(value, env) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(env);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(value));
  return JSON.stringify({ iv: b64(iv), data: b64(new Uint8Array(ciphertext)) });
}
async function decrypt(value, env) {
  const item = JSON.parse(value);
  const key = await encryptionKey(env);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(item.iv) }, key, unb64(item.data));
  return new TextDecoder().decode(plaintext);
}
function redirect(url) {
  return new Response(null, { status: 302, headers: { Location: url, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
}
function callbackUri(request) {
  return new URL('/auth/callback', new URL(request.url).origin).toString();
}
function appReturnUrl(env, params) {
  const target = new URL(env.APP_URL);
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== null) target.searchParams.set(key, value);
  return target.toString();
}
async function tokenPost(body) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error || 'Google token request failed.');
  return data;
}
async function googleIdentity(idToken, env) {
  const response = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken));
  if (!response.ok) throw new Error('Google identity token could not be validated.');
  const info = await response.json();
  if (info.aud !== env.GOOGLE_CLIENT_ID || !info.sub || info.email_verified !== 'true') throw new Error('Google identity validation failed.');
  return info.sub;
}
async function hash(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, '0')).join('');
}
async function sessionUser(request, env) {
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) throw new Error('Session missing. Reconnect Google Drive.');
  const key = 'session:' + await hash(token);
  const sub = await env.TOKENS.get(key);
  if (!sub) throw new Error('Session expired. Reconnect Google Drive.');
  await env.TOKENS.put(key, sub, { expirationTtl: SESSION_TTL });
  return sub;
}
async function getGoogleAccessToken(sub, env) {
  const cacheKey = 'access:' + sub;
  const cached = await env.TOKENS.get(cacheKey, 'json');
  if (cached?.accessToken && cached.expiresAt > Date.now() + 60000) return cached.accessToken;
  const encrypted = await env.TOKENS.get('refresh:' + sub);
  if (!encrypted) throw new Error('Google authorisation is no longer available. Reconnect Google Drive.');
  const refreshToken = await decrypt(encrypted, env);
  const tokens = await tokenPost({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  });
  const expiresIn = Number(tokens.expires_in || 3600);
  await env.TOKENS.put(cacheKey, JSON.stringify({ accessToken: tokens.access_token, expiresAt: Date.now() + expiresIn * 1000 }), { expirationTtl: Math.max(60, expiresIn - 30) });
  return tokens.access_token;
}
async function driveRequest(accessToken, url, options = {}) {
  const response = await fetch(url, { ...options, headers: { Authorization: 'Bearer ' + accessToken, ...(options.headers || {}) } });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text.slice(0, 500) }; }
  if (!response.ok) throw new Error(data.error?.message || data.message || ('Google Drive returned ' + response.status));
  return data;
}
async function findOrCreateFolder(accessToken) {
  const q = `name = '${BACKUP_FOLDER}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const found = await driveRequest(accessToken, 'https://www.googleapis.com/drive/v3/files?q=' + encodeURIComponent(q) + '&fields=files(id,name)&pageSize=10');
  if (found.files?.length) return found.files[0].id;
  const made = await driveRequest(accessToken, 'https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: BACKUP_FOLDER, mimeType: 'application/vnd.google-apps.folder' })
  });
  return made.id;
}
async function uploadBackup(accessToken, payload) {
  const folder = await findOrCreateFolder(accessToken);
  const q = `name = '${BACKUP_NAME}' and '${folder}' in parents and trashed = false`;
  const found = await driveRequest(accessToken, 'https://www.googleapis.com/drive/v3/files?q=' + encodeURIComponent(q) + '&fields=files(id,name)&pageSize=10');
  const existing = found.files?.[0]?.id || '';
  const boundary = 'xcshiftapp' + randomHex(12);
  const metadata = { name: BACKUP_NAME, mimeType: 'application/json', ...(existing ? {} : { parents: [folder] }) };
  const body = '--' + boundary + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata) + '\r\n--' + boundary + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify({ ...payload, cloudBackupAt: new Date().toISOString(), backupFormat: 1 }) + '\r\n--' + boundary + '--';
  const endpoint = existing
    ? 'https://www.googleapis.com/upload/drive/v3/files/' + existing + '?uploadType=multipart&fields=id,name,modifiedTime'
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime';
  return driveRequest(accessToken, endpoint, { method: existing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + boundary }, body });
}

async function downloadBackup(accessToken) {
  const q = `name = '${BACKUP_NAME}' and trashed = false`;
  const found = await driveRequest(accessToken, 'https://www.googleapis.com/drive/v3/files?q=' + encodeURIComponent(q) + '&fields=files(id,name,modifiedTime)&pageSize=10&orderBy=modifiedTime desc');
  const file = found.files?.[0];
  if (!file) throw new Error('No XC ShiftApp cloud backup was found in this Google Drive account.');
  const payload = await driveRequest(accessToken, 'https://www.googleapis.com/drive/v3/files/' + file.id + '?alt=media');
  if (!payload || payload.appId !== APP_ID || !payload.shift || !Array.isArray(payload.entries) || !Array.isArray(payload.trains)) throw new Error('The Google Drive file is not a valid XC ShiftApp diary backup.');
  return { backup: payload, modifiedTime: file.modifiedTime || payload.cloudBackupAt || null };
}

function requireAppOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (origin !== env.ALLOWED_ORIGIN) return false;
  return true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';
    if (request.method === 'OPTIONS') {
      if (origin !== env.ALLOWED_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: {
        'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Max-Age': '86400', Vary: 'Origin'
      }});
    }

    if (url.pathname === '/auth/start' && request.method === 'GET') {
      try {
        if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.APP_URL) throw new Error('Worker configuration is incomplete.');
        const state = randomHex(32);
        await env.TOKENS.put('state:' + state, '1', { expirationTtl: STATE_TTL });
        const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        auth.search = new URLSearchParams({
          client_id: env.GOOGLE_CLIENT_ID,
          redirect_uri: callbackUri(request),
          response_type: 'code',
          scope: DRIVE_SCOPE + ' openid email',
          access_type: 'offline',
          prompt: 'consent',
          include_granted_scopes: 'true',
          state
        }).toString();
        return redirect(auth.toString());
      } catch (error) { return new Response('Could not start Google authorisation: ' + error.message, { status: 500 }); }
    }

    if (url.pathname === '/auth/callback' && request.method === 'GET') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      if (url.searchParams.get('error')) return redirect(appReturnUrl(env, { drive_auth: 'error' }));
      if (!code || !state || !(await env.TOKENS.get('state:' + state))) return new Response('Invalid or expired authorisation state. Please return to XC ShiftApp and try again.', { status: 400 });
      await env.TOKENS.delete('state:' + state);
      try {
        const tokens = await tokenPost({
          code,
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          redirect_uri: callbackUri(request),
          grant_type: 'authorization_code'
        });
        if (!tokens.id_token) throw new Error('Google did not return an identity token.');
        const sub = await googleIdentity(tokens.id_token, env);
        let refreshToken = tokens.refresh_token;
        if (!refreshToken) {
          const old = await env.TOKENS.get('refresh:' + sub);
          if (old) refreshToken = await decrypt(old, env);
        }
        if (!refreshToken) throw new Error('Google did not issue a refresh token. Revoke the app in your Google Account permissions and connect again.');
        await env.TOKENS.put('refresh:' + sub, await encrypt(refreshToken, env));
        const ticket = randomHex(32);
        await env.TOKENS.put('ticket:' + ticket, sub, { expirationTtl: TICKET_TTL });
        return redirect(appReturnUrl(env, { drive_auth: 'success', drive_ticket: ticket }));
      } catch (error) {
        return redirect(appReturnUrl(env, { drive_auth: 'error', drive_reason: error.message.slice(0, 160) }));
      }
    }

    if (url.pathname.startsWith('/auth/') || ['/auth/exchange', '/backup', '/restore', '/status', '/disconnect'].includes(url.pathname)) {
      if (!requireAppOrigin(request, env)) return json({ error: 'Origin not allowed.' }, 403, env.ALLOWED_ORIGIN || '*');
    }

    if (url.pathname === '/auth/exchange' && request.method === 'POST') {
      try {
        const { ticket } = await request.json();
        if (!ticket || typeof ticket !== 'string' || ticket.length > 200) throw new Error('Authorisation ticket is missing.');
        const key = 'ticket:' + ticket;
        const sub = await env.TOKENS.get(key);
        if (!sub) throw new Error('Authorisation ticket expired. Connect Google Drive again.');
        await env.TOKENS.delete(key);
        const sessionToken = randomHex(32);
        await env.TOKENS.put('session:' + await hash(sessionToken), sub, { expirationTtl: SESSION_TTL });
        return json({ sessionToken, expiresIn: SESSION_TTL }, 200, env.ALLOWED_ORIGIN);
      } catch (error) { return json({ error: error.message }, 400, env.ALLOWED_ORIGIN); }
    }

    if (url.pathname === '/status' && request.method === 'GET') {
      try {
        const sub = await sessionUser(request, env);
        const lastBackupAt = await env.TOKENS.get('lastBackup:' + sub);
        return json({ connected: true, lastBackupAt }, 200, env.ALLOWED_ORIGIN);
      } catch (error) { return json({ error: error.message }, 401, env.ALLOWED_ORIGIN); }
    }

    if (url.pathname === '/backup' && request.method === 'POST') {
      try {
        const sub = await sessionUser(request, env);
        const length = Number(request.headers.get('Content-Length') || 0);
        if (length > 20 * 1024 * 1024) throw new Error('Backup is larger than the 20 MB upload limit. Export a local JSON copy and remove large photos if necessary.');
        const payload = await request.json();
        if (!payload || payload.appId !== APP_ID || !payload.shift || !Array.isArray(payload.entries) || !Array.isArray(payload.trains)) throw new Error('The submitted file is not a valid XC ShiftApp diary backup.');
        const accessToken = await getGoogleAccessToken(sub, env);
        await uploadBackup(accessToken, payload);
        const lastBackupAt = new Date().toISOString();
        await env.TOKENS.put('lastBackup:' + sub, lastBackupAt);
        return json({ ok: true, lastBackupAt }, 200, env.ALLOWED_ORIGIN);
      } catch (error) {
        const message = error.message || 'Backup failed.';
        const authFailure = /authorisation|refresh token|invalid_grant|session expired/i.test(message);
        return json({ error: message }, authFailure ? 401 : 500, env.ALLOWED_ORIGIN);
      }
    }

    if (url.pathname === '/restore' && request.method === 'GET') {
      try {
        const sub = await sessionUser(request, env);
        const accessToken = await getGoogleAccessToken(sub, env);
        const result = await downloadBackup(accessToken);
        return json(result, 200, env.ALLOWED_ORIGIN);
      } catch (error) {
        const message = error.message || 'Cloud restore failed.';
        const authFailure = /authorisation|refresh token|invalid_grant|session expired/i.test(message);
        return json({ error: message }, authFailure ? 401 : 500, env.ALLOWED_ORIGIN);
      }
    }

    if (url.pathname === '/disconnect' && request.method === 'POST') {
      try {
        const sub = await sessionUser(request, env);
        const encrypted = await env.TOKENS.get('refresh:' + sub);
        if (encrypted) {
          try {
            const refreshToken = await decrypt(encrypted, env);
            await fetch('https://oauth2.googleapis.com/revoke', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ token: refreshToken }) });
          } catch (e) { console.warn('Google token revocation failed', e); }
        }
        await env.TOKENS.delete('refresh:' + sub);
        await env.TOKENS.delete('access:' + sub);
        await env.TOKENS.delete('lastBackup:' + sub);
        await env.TOKENS.delete('session:' + await hash((request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim()));
        return json({ ok: true }, 200, env.ALLOWED_ORIGIN);
      } catch (error) { return json({ error: error.message }, 401, env.ALLOWED_ORIGIN); }
    }

    return json({ error: 'Not found.' }, 404, origin);
  }
};
