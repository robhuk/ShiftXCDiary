# XC ShiftApp – Cloudflare Worker setup

This Worker provides server-side Google OAuth offline access for XC ShiftApp. It stores Google refresh tokens encrypted in Cloudflare KV, renews short-lived access tokens when needed, and writes the complete shift diary JSON to the user's Google Drive. The PWA keeps only an opaque revocable session token; it never receives or stores Google's refresh token or client secret.

## Before you start

- A Cloudflare account.
- Node.js installed on your computer.
- The Google OAuth **Web application** client already created for XC ShiftApp.
- The Google Drive API enabled in the same Google Cloud project.
- The OAuth Client ID and its **Client Secret**. The Client ID already supplied for the app is `412213969010-51kqg6d5m1vhhv2j9pricn6q86hc4qj0.apps.googleusercontent.com`.
- Your app's GitHub Pages URL. The configuration currently assumes `https://robhuk.github.io/xcstaffinfo/`. If your actual app URL is different, edit `APP_URL` in `wrangler.jsonc` before deployment.

Do not send the Client Secret or encryption key in chat, email, GitHub source, or the PWA. They must be added as Cloudflare Worker secrets.

## 1. Prepare the Worker

Open a terminal in this `cloudflare-worker` folder and run:

```bash
npm install
npx wrangler login
```

Wrangler will open a Cloudflare login page. Approve access to your Cloudflare account.

## 2. Create the private KV namespace

Run:

```bash
npx wrangler kv namespace create TOKENS
```

The command returns an ID. Open `wrangler.jsonc` and replace the `kv_namespaces` section with the ID returned, for example:

```jsonc
"kv_namespaces": [
  { "binding": "TOKENS", "id": "PASTE_YOUR_KV_NAMESPACE_ID_HERE" }
]
```

Keep the ID private to your Cloudflare project; it is not a password, but do not publish it unnecessarily.

## 3. Deploy once to obtain the Worker URL

Run:

```bash
npx wrangler deploy
```

Wrangler prints a URL similar to:

`https://xc-shiftapp-drive-backup.YOUR-ACCOUNT.workers.dev`

Copy that URL. The OAuth callback URL is the same address followed by `/auth/callback`.

## 4. Add the Google OAuth redirect URI

In Google Cloud Console, open **Google Auth Platform → Clients**, select your existing Web application client, and add this exact URI under **Authorized redirect URIs**:

`https://YOUR-WORKER-HOST.workers.dev/auth/callback`

Replace `YOUR-WORKER-HOST` with the actual Worker URL from step 3. Keep the Authorized JavaScript origin `https://robhuk.github.io` as it is. Save the OAuth client.

For initial testing, keep the app in Testing mode and add the Google account you will use under **Audience → Test users**. Important: Google expires authorisations and refresh tokens for External apps in Testing mode after seven days, even when this Worker can refresh hourly access tokens. For continuous long-term backup, set the OAuth app to **In production**. For personal use or a small group (under 100 users), Google says verification may not be mandatory; users can proceed through an unverified-app warning, and the 100-user cap remains. The app requests `drive.file`, a non-sensitive, per-file scope, so it is narrower than full Drive access. If you want to make this available to a wider staff audience, follow Google’s verification process. Publishing in Production removes the seven-day Testing-mode refresh-token expiry. See Google's [publishing status and token lifetime guidance](https://support.google.com/cloud/answer/15549945) and [Drive scope classifications](https://developers.google.com/workspace/drive/api/guides/api-specific-auth).

## 5. Add the secrets to Cloudflare

From this `cloudflare-worker` folder, run each command. Wrangler prompts for the value; paste it into the terminal prompt (not into this guide or GitHub):

```bash
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put TOKEN_ENCRYPTION_KEY
```

For `GOOGLE_CLIENT_ID`, use the Client ID listed above.

For `GOOGLE_CLIENT_SECRET`, copy the secret from Google Cloud Console → Google Auth Platform → Clients → your Web application client. Never put this secret in the PWA.

For `TOKEN_ENCRYPTION_KEY`, generate a new 32-byte key in a terminal:

```bash
openssl rand -base64 32
```

Copy the generated output and paste it into the `TOKEN_ENCRYPTION_KEY` prompt. Keep a secure offline copy of this key. If it is lost, previously encrypted refresh tokens cannot be decrypted and users will need to connect Google Drive again.

## 6. Redeploy

Run:

```bash
npx wrangler deploy
```

The Worker should now be ready. Its Google callback is `/auth/callback`, and its app API is restricted to the configured `ALLOWED_ORIGIN`.

## 7. Connect XC ShiftApp

1. Deploy the updated XC ShiftApp PWA files from version 1.3.44 to your existing GitHub Pages repository. Keep the existing repository and app path.
2. Open the app and choose the small **Backup & restore** link at the bottom.
3. Under Google Drive backup, paste the Worker URL (without a trailing slash) into **Secure backup service URL**.
4. Select **Save service address**, then **Connect Google Drive**.
5. Sign in to the Google account you added as a test user and approve the requested Drive access.
6. Google returns you to XC ShiftApp. The app exchanges a short-lived one-time ticket for a revocable app session and starts the first backup.

The Worker creates `XC ShiftApp Backups/XC-ShiftApp-Backup.json` in that Google account. Later diary changes are saved locally immediately and uploaded after a short debounce. If the device is offline, the latest snapshot stays queued locally and uploads when the app is online again.

## Security and operational notes

- Requested Google scopes: `drive.file`, `openid`, and `email`. The app does not request broad access to the user's entire Drive.
- The Worker stores Google's refresh token encrypted with AES-GCM in the bound KV namespace. The encryption key and OAuth client secret are Cloudflare secrets.
- The PWA stores only an opaque 30-day session token in its own local storage. The token is sent to the Worker over HTTPS and can be revoked with **Disconnect**.
- The Worker refreshes expired Google access tokens server-side, so a user does not need to reconnect every hour.
- The Worker runs only when the app makes a request. It is not a permanent live connection and cannot upload a diary change while the device is offline or the app is closed. It resumes queued changes when the app is opened/online.
- Cloudflare KV is used for session and encrypted token storage. Keep the KV namespace and secrets attached to this Worker; do not delete them while the integration is in use.
- Disconnect revokes the Google refresh token and removes the current stored session. Local shift data is not deleted.
- The app retains its existing local storage key. Updating the PWA does not clear the diary or archive.
