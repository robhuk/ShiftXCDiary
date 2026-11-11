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
Service worker cache: xc-shiftapp-cache-v1.0.9-build-2026.11.09-001

Build 1.0.6: added closable print preview, reinforced local autosaving, and 24-hour update checks. All image assets remain in the application root directory.

Build 1.0.7: added a Full and standing checkbox to Passenger Counts entries; selection is included in saved log text and exports.

Copy to email: copies rich HTML tables (with plain-text fallback) and opens the device default email handler with a plain-text table-formatted report.

Incident logging (v1.0.9): Create a numbered incident with a nature/what happened description. Use Add sequential entry on an incident to attach further timestamped log entries; sequence numbering is retained in the log and exports.

Version 1.1.0 additions:
- Dedicated Lost Property entry button and custom capture dialog.
- Captures found/handed-in source, item, description, location, optional person details and handover/storage destination.
- Automatically timestamped and included in chronological log, local save, PDF, clipboard and email reports.


Version 1.1.1 additions:
- Live CrossCountry station-style digital clock displayed at the top of the app.
- Shows hours, minutes and seconds, UK date and GMT/BST zone.
- Uses the Europe/London time zone so daylight-saving changes are handled automatically.
- Preserves the existing app ID and local shift-data storage key.


Version 1.1.2 (10/11/2026)
- Updated the CrossCountry clock to a brighter LED / seven-segment-inspired display.
- Removed the standalone Create incident button.
- Added 🚨 INCIDENT to Add issue / log entry. Selecting it opens a custom prompt for an optional incident log number before entering incident details.
- Incident records retain sequential follow-up entry support and appear in all exports.


Version 1.1.3
- Updated the live CrossCountry clock to use custom seven-segment LED digits matching the supplied reference image: lime-green hours/minutes, red seconds, dark inactive segments, and illuminated colon dots.
- Preserved app identity and local shift storage.

Version 1.1.4
- Refined clock to match the supplied seven-segment digital display reference.
- Enlarged lime-green hours/minutes, reduced red seconds digits, dark inactive segments, and removed the clock-side wordmark for a clean display.
- Preserved app identity and local shift storage.

Version 1.1.5
- Removed sequential incident follow-up/update workflow.
- Added Update as a standalone entry type in Add issue / log entry.
- Existing incident log-number prompt remains in place.
- Preserved app identity and local shift storage.

Version 1.1.6
- Improved clock legibility with larger, thicker bevelled seven-segment LED numerals and brighter active segments.
- Increased contrast for inactive segments and improved responsive sizing.
- Preserved existing app identity and local shift data.

Version 1.1.7
- Changed clock digits from custom seven-segment shapes to a clear standard system digital font with tabular numerals.
- Retained lime hours/minutes, red seconds, dark display and UK time handling.
- Preserved app identity and local shift data.

Version 1.1.8
- Safety Critical defects display a warning symbol and red highlight.
- Passenger Counts can be saved without additional description text.
- Assist entries are highlighted light blue; Control Message entries light orange.
- Added category icons to General Note, Update, Defect, Passenger Counts, Control Message, Delay, Assist and Reminder entries.
- Preserved app identity and local shift storage.

Version 1.1.9
- Added a From selector to Add train with Working, ASST, ACC and PASS options.
- Selected value is shown in the train list and included in text, email and PDF exports.
- Existing trains without a saved selection default to Working when displayed/exported.
- Preserved app identity and local shift data.

Version 1.2.0
- Renamed the train From selector to Activity.
- Added TAXI as an activity option.
- Activity value continues to appear in the train list and exports.
- Preserved app identity and local shift data.

Version 1.2.5
- Added a confirmation prompt before deleting any Operational Log entry. Cancel leaves the entry untouched.
- Preserved app identity and local shift data.

Version 1.2.5: all confirmation prompts now use the custom CrossCountry modal style.

Version 1.2.5: Improved Copy log and Copy to email readability with clear section headings, spacing, numbered log entries, and formatted HTML email tables.

Version 1.2.5 changes: emoji dropdown categories; Lost Property integrated into Add issue dropdown; incident updates append to original incident and prompt for incident selection only when multiple incidents exist; incident reference field accepts an incident number or headcode; PDF and HTML email exports colour-code operational categories.


Version 1.2.5: PASS and TAXI activities hide unit number fields and do not require unit numbers.

Version 1.2.9: Added a per-entry clipboard copy button (🗒️) and replaced the individual log entry Delete text button with an icon-only 🗑️ button. The delete action retains the custom confirmation dialog.

Version 1.2.9: PASS and TAXI activities request free-text FROM and TO locations. These route details are saved with the train and included in the on-screen train list, copy log, email and PDF exports. Unit numbers remain not required for PASS and TAXI.


Version 1.2.9: Copy and delete controls are compact and displayed inline beside each operational log entry heading and timestamp.


v1.2.9 repair: Restored the PASS/TAXI FROM and TO input container expected by the Add Train dialog logic. This fixes the Add Train button failing before the dialog opens. App ID and local storage key remain unchanged.
