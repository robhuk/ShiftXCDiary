XC ShiftApp – Progressive Web App
Version: 1.0.0
Unique app ID: uk.co.crosscountry.shiftapp

CONTENTS
- index.html: app interface
- style.css: responsive XC-inspired styling and print layout
- app.js: shift logging, local saving, clipboard, email-copy and PDF print/export
- manifest.json: PWA installation identity and metadata
- app-identity.json: explicit app/build/storage/cache identification
- service-worker.js: offline cache and versioned updates
- icons/: generated app icons
- shiftapp-logo.png: 512 x 512 app logo

INSTALL / RUN
1. Extract this folder.
2. Host the folder on an HTTPS static host (for example GitHub Pages), or use localhost for testing.
3. Open index.html through the hosted HTTPS address.
4. Use the browser's Install / Add to Home Screen option.

The app is designed to work offline after the first successful load. The browser's localStorage holds shift records on that device. Save is also available as a manual save action. Export PDF opens the print dialog; select Save as PDF.

DATA NOTE
No server, cloud sync, or email sending is configured. Copy to Email copies the complete log so it can be pasted into an email. Local browser data can be lost if site data is cleared or the app is removed with browser storage cleared; export important records regularly.

IDENTITY
App ID: uk.co.crosscountry.shiftapp
Storage key: uk.co.crosscountry.shiftapp.shiftdata.v1
Service worker cache: xc-shiftapp-cache-v1.0.2-build-2026.11.08-003

Build 1.0.2: screenshot-inspired dark burgundy/magenta styling. All PNG image assets are in the application root directory; no images subfolder is used.

Build 1.0.2: removed the footer text requested; local storage key remains unchanged.
