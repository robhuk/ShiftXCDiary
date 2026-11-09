XC ShiftApp – Progressive Web App
Version: 1.0.7
Unique app ID: uk.co.crosscountry.shiftapp

CONTENTS (all files are in the application root)
- index.html: app interface
- style.css: responsive XC-inspired styling
- app.js: shift logging, autosave, clipboard/email-copy and print preview
- manifest.json: PWA installation identity and metadata
- app-identity.json: explicit app/build/storage/cache identification
- service-worker.js: offline cache and versioned update checks
- icon-*.png and shiftapp-logo.png: app image assets

INSTALL / RUN
1. Extract the ZIP package.
2. Host the files on an HTTPS static host (for example GitHub Pages), or use localhost for testing.
3. Open the hosted HTTPS address.
4. Use the browser's Install / Add to Home Screen option.

LOCAL DATA
Shift date, headcode, shift notes, trains and timestamped log entries are automatically saved in this browser's localStorage as fields change and when the app is backgrounded or closed. The Save button remains available for manual saving. Data remains on this device/browser and is not uploaded to a server. Clearing browser/site data may remove it; export important records regularly.

PRINT PREVIEW
Export PDF opens a separate print-preview tab with a Close Preview button and a Print / Save PDF button. Closing the preview returns to the shift app. The browser print dialog can also be cancelled normally.

UPDATES
The app checks for a new service-worker build on launch and no more than once every 24 hours while open, including when returning to the foreground after the interval. The cache version changes with each build. App updates do not delete the local shift-data key.

EMAIL
Copy to Email copies the report text for pasting into an email. No email account connection or automatic sending is configured.

IDENTITY
App ID: uk.co.crosscountry.shiftapp
Storage key: uk.co.crosscountry.shiftapp.shiftdata.v1
Service worker cache: xc-shiftapp-cache-v1.0.8-build-2026.11.09-001

Build 1.0.6: added closable print preview, reinforced local autosaving, and 24-hour update checks. All image assets remain in the application root directory.

Build 1.0.7: added a Full and standing checkbox to Passenger Counts entries; selection is included in saved log text and exports.

Copy to email: copies rich HTML tables (with plain-text fallback) and opens the device default email handler with a plain-text table-formatted report.
