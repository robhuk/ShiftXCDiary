Version 1.3.306 (28 November 2026): Fixed mapping page button initialisation for Nearest Crossings, Nearest Stations and Nearest Access Points. Removed a stale reference to a deleted crossing-status binding that stopped the shared map-control setup from completing. Close, fullscreen and zoom buttons now bind independently per page and act only on the active page map. Added mobile touch-target handling.
Version 1.3.305 (28 November 2026): Fixed full-screen map interaction by expanding the map surface within its modal dialog instead of clipping it inside the scrollable page. Improved map touch/pointer handling. Repaired Nearest Access Points data loading using the current National Hazard Directory region list, current and legacy data-file names, flexible CSV/JSON coordinate parsing, and all locally cached regions. Existing local shift data and other features are preserved.

Version 1.3.304 (28 November 2026): Enlarged the map type dropdown. Combined OpenRailwayMap layers and the Crossing status toggle in one options box on Nearest Crossings. When enabled, the numbered crossing pins are green for open, red for closed and grey for unknown, using live Mind the Gates status data.

Version 1.3.303 (28 November 2026): Removed individual Mind the Gates links from crossing cards and detail panels. Added an optional Crossing status map layer to Nearest Crossings, showing green dots for open, red dots for closed and grey dots for unknown live status. The layer can be toggled on/off and remembers the selection.

Version 1.3.302 (28 November 2026): Added live nearby level-crossing status from Mind the Gates to the Nearest Crossings page, including open/closed/unknown state, confirmation status, estimated next closure, and on-demand forecast timeline and approaching train details. Added source credit and safety disclaimer. Live information requires an internet connection and GPS.

Version 1.3.301 (28 November 2026): Removed the Light map type and removed Signals and Electrification from the optional OpenRailwayMap layers. Previously saved selections for removed options are ignored.

Version 1.3.300 (28 November 2026): Moved all map controls and filters below the map frame on Nearest Crossings, Nearest Stations and Nearest Access Points. Added full-screen map mode with an on-map close button. Existing map types, optional OpenRailwayMap overlays, GPS, pins, dragging and + / − zoom controls are retained.


Version 1.3.298 (28 November 2026): Added a map-type dropdown at the bottom-right of Nearest Crossings, Nearest Stations and Nearest Access Points maps. Select Street (OpenStreetMap), Satellite (Esri imagery) or Terrain (OpenTopoMap). The selection is remembered on the device and applies across all three location maps. Existing +/− zoom controls remain the only zoom controls; wheel, pinch and double-click zoom remain disabled, while map dragging remains enabled. Alternative basemaps require an internet connection; Street remains the default.

Version 1.3.297 (28 November 2026): Location maps now zoom only with the on-map + and − controls. Scroll-wheel, pinch, double-click and automatic zoom-on-result selection are disabled; map dragging remains available.

Version 1.3.281 (27 November 2026): Customer Service Issues / Diary now uses DDMMYY-000-XCCS references, supports export to the main daily log as Customer service issue, groups edit/share/export/delete actions under the three-dot menu, and opens full records in a custom pop-up with an X close button.

VERSION 1.3.275 – REMOVE GRID REFERENCES FROM LOCATION TOOLS

- Removed OS grid reference fields from access point results and search matching in the location tools.
- Easting/northing source coordinates remain internal for converting access point locations to map coordinates; they are not displayed as grid references.
- App ID and local shift-data storage key retained.

VERSION 1.3.221 – SPARE IS A/R

A/R is the spare shift category. When A/R is entered, the app asks for the original rostered shift length, pre-filled with the configurable average A/R (spare) length (default 08:40). SB (Safety Brief) automatically uses the same configurable length. Legacy SPARE entries remain recognised for pay calculations.

VERSION 1.3.217 – COMMISSION STATEMENT PDF EXPORT

- Added PDF statement export for current pay period, previous pay period and custom date ranges.
- Statements include date range, payday where applicable, ticket scans, ticket sales, total commission, and itemised commission entries by shift date / job number.
- Uses the device browser Print / Save as PDF workflow, including iPhone print/share support.
- App identity and storage key retained. Cloudflare Worker and background service worker files unchanged.

VERSION 1.3.148 – DELAY EMAIL NOTES AT BOTTOM

- Tap the station name in a passenger-count table to toggle a green tick. The checked state saves with the passenger-count entry and is reflected in copied tables and PDF exports.
- Existing local data and storage key are retained; service-worker cache version incremented.
- Consolidates every passenger-count entry for the same normalized headcode into one table.
- Resolves the headcode consistently from the selected train link, legacy headcode fields, related train IDs, or saved entry text.
- The same grouping is used by the on-screen operational log and report/PDF exports.
- Preserves existing shift data and storage identity.

XC ShiftApp – Progressive Web App
Version: 1.3.54
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
Service worker cache: xc-shiftapp-cache-v1.3.40-build-2026.11.15-001

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

Version 1.3.2: Added a per-entry clipboard copy button (🗒️) and replaced the individual log entry Delete text button with an icon-only 🗑️ button. The delete action retains the custom confirmation dialog.

Version 1.3.2: PASS and TAXI activities request free-text FROM and TO locations. These route details are saved with the train and included in the on-screen train list, copy log, email and PDF exports. Unit numbers remain not required for PASS and TAXI.


Version 1.3.2: Copy and delete controls are compact and displayed inline beside each operational log entry heading and timestamp.


v1.3.2 repair: Restored the PASS/TAXI FROM and TO input container expected by the Add Train dialog logic. This fixes the Add Train button failing before the dialog opens. App ID and local storage key remain unchanged.


v1.3.2: PASS and TAXI activities now prompt for Headcode or Reference, allowing free-text reference values up to 40 characters. Other activities retain the four-character headcode validation.


v1.3.2: Lost Property now omits Person details from the report when blank, records a selected item condition, and supports an optional compressed item photograph. Photographs are retained in local shift data and embedded in PDF print preview and HTML email export. Images are resized to a maximum 1280px edge and JPEG-compressed before storage.


v1.3.2: Added an optional Related train selector to the Add log entry dialog. The selector appears when one or more trains have been entered. Selected train activity, headcode/reference and route or unit details are included with the log entry in copy, email and PDF exports. Incident updates can also be linked to a train and retain that association within the original incident.


Version 1.3.5: Removed the log-number prompt from Add incident. Log / reference numbers can now be added later to any live incident using the optional “Add log / reference number” subsection under Incident Update. A reference-only save is supported without requiring an incident narrative update. Existing incident records and saved shift data remain compatible.

Version 1.3.5: Operational log entries display an associated train only as a bold headcode in square brackets (for example [1S51]); activity, unit numbers and the Related train label are omitted.


Version 1.3.6 changes:
- Updated the Train Diversion dropdown with the current routes: Adwick; Barnsley; Beighton; Erewash; Lichfield (Cross City); Newcastle HLB; Newcastle Forth Banks; Newcastle Bridges Loop; Rotherham; S&K (Swinton & Knottingley); Whitacre / Coleshill PW / Kingsbury Slow. Other remains available for custom route entry. Previous built-in Newcastle Bridges – KEB East to South Jn option is removed; user-added custom routes are retained.

Version 1.3.5 changes:
- PDF layout reduces forced page breaks between Trains and the Operational Log.
- Added Train Diversion entry type with a custom route-selection popup.
- Choose a listed diversion or select Other to enter a route; optionally save new routes to the dropdown for future shifts.

Version 1.3.7 changes:
- Added inline edit controls for operational log entries and train records.
- Made Shift details, Trains and Operational log collapsible sections (expanded by default).
- Preserved the existing app ID and local storage key.

Version 1.3.11: Renamed the Operational log section to Operational Log / Occurrences, including exported log headings.

Version 1.3.11 changes:
- Lost Property opens its dedicated capture form and no longer leaves or resets to a visible General Note entry form.
- Train Diversion popup now contains both the diversionary route selector and optional train selector on the same screen.

Version 1.3.11: Added a dedicated Full and standing entry with a custom popup, multi-select operational categories, and required last/current station field.


Version 1.3.13 changes:
- Train Diversion is now captured on one Add log entry screen. Select the train/headcode and diversionary route together; custom routes can still be saved for future use.
- Linked headcodes are displayed in bold red square brackets on screen and in formatted reports for every applicable operational log entry.
- Preserves the existing local storage key and saved shift data.

Version 1.3.15: Fixed headcode colour rendering. Bracketed headcodes are now wrapped in a dedicated style with forced bold CrossCountry red formatting in the on-screen Operational Log / Occurrences and HTML-based exports.


Version 1.3.26 (14/11/2026)

Version 1.3.26 changes:
- Removed the separate red “DELAY OVER 10 MINUTES” warning text from delay entries. The bold red border remains in HTML and PDF reports. Plain-text reports no longer add a warning marker.
- Ticket acceptance entries are highlighted in pale pink in the on-screen chronological log and exported HTML reports.
- Existing local storage key retained; service worker cache version incremented.

Version 1.3.25 changes:
- Delay entries exceeding 10 minutes are highlighted with a bold red border in the HTML and PDF reports. Plain-text reports include a prominent warning marker.

Version 1.3.27: Defect entries now support optional six-digit PVN and unit number. A linked single-set train automatically supplies its unit number; a linked double-set train requires selection of the affected unit.


Version 1.3.28 changes:
- Defect entries sharing the same linked headcode, unit number and PVN are grouped into one item in the on-screen chronological log and in plain-text, email/HTML and print/PDF reports. Each defect retains its own timestamp and its own edit/copy/delete menu action. Underlying defect records are not merged or deleted.


Version 1.3.30 changes:
- PDF print preview document title is set to DDMMYYYY_TurnNumber so Save as PDF defaults to the requested filename format (for example 14122026_NES604.pdf).
- Existing local storage key and saved shift data are unchanged.


VERSION 1.3.30 – SHIFT DIARY ARCHIVE
- Archive completed shift diaries locally and start a fresh active diary.
- Browse archived shifts in a collapsible panel at the bottom of the app.
- Restore an archived shift as the active diary; any current unsaved diary is archived first.
- Delete archived records after confirmation.
- Export/import a JSON backup containing the active diary and archived shifts.
- Clearing the active shift no longer removes archived records.


VERSION 1.3.32 – ARCHIVE CONFIRMATION
- Archiving a shift now asks “Are you sure you want to archive this shift?” and clearly explains that a complete copy is saved while the active diary is cleared.
- The action proceeds only after the user selects “Yes, archive shift”; cancelling leaves the active diary unchanged.
- Existing local storage key retained; service worker cache version incremented.

PDF exports now include the supplied CrossCountry Voyager header image and a Page X of Y footer on every page.

Version 1.3.36 (2026-11-14)
PDF header updated to the supplied CrossCountry Voyager banner, printed 10mm (1cm) high across the page on every page. Automatic page-number footer retained.


Version 1.3.36 update: PDF Voyager header remains 10mm high and is centered at 60% of page width, leaving 20% margins on both sides. The image preserves its aspect ratio.

Version 1.3.40 – Google Drive automatic backup
- Added an optional Google Drive backup panel.
- After every diary change, saves locally immediately and queues a cloud backup.
- Uploads the full current shift and archived records as XC-ShiftApp-Backup.json in an XC ShiftApp Backups folder.
- Offline changes are queued and uploaded when the app reconnects, provided Google Drive authorisation is still active.
- Uses the Google Identity Services browser OAuth flow and the limited drive.file scope; it does not request access to all Drive files.
- Access tokens are held in memory and are not written to local storage. Reconnect after token expiry or revocation.
- Google Cloud setup is required: enable Google Drive API, create a Web application OAuth client, and add the hosted app origin under Authorized JavaScript origins. Enter the resulting Client ID in the app and select Connect Google Drive.
- Existing local data key and archive records are preserved. Cloud backup is optional and never blocks local saving.


Version 1.3.42 – Google OAuth Client ID preconfigured
- Pre-filled the Google Drive backup setup with the OAuth Web Client ID supplied by the user.
- The Client ID remains editable in the Google Drive backup panel.
- All local saving, offline queueing and existing diary/archive features remain unchanged.

Version 1.3.43: Combined local JSON export/import backup controls with the discreet footer Backup & restore popup alongside Google Drive backup settings. Local autosave remains active.


Version 1.3.44 – Secure Google Drive background backup
- Replaced browser-only Google access tokens with a Cloudflare Worker OAuth authorization-code flow.
- The Worker requests offline access and securely stores the Google refresh token encrypted in Cloudflare KV.
- Expired Google access tokens are renewed server-side; the PWA stores only a revocable opaque session token.
- Backup requests continue to run after diary changes, with local-first saving and offline queueing.
- Added Cloudflare Worker source, Wrangler configuration and SETUP-GUIDE.md in the cloudflare-worker folder.
- The Worker must be deployed and configured with the Google OAuth client ID, client secret and a private encryption key before cloud backup can connect.
- The app's secure backup service URL is configured in the bottom Backup & restore popup.
- Existing local storage key and shift/archive data are preserved.

Version 1.3.47 – Hidden default Cloudflare backup URL
- Cloudflare backup service URL is preconfigured and used automatically when no saved custom URL exists.
- Service URL field is hidden behind an Edit service URL link and remains editable.
- Custom URL remains saved in localStorage across app updates.
- Existing diary storage key and records are unchanged.

Version 1.3.47: Added a monthly archive calendar with red highlights for dates containing archived shift content. Shift headcode/activity field accepts REFRESH, ROUTES and OTHER as well as train headcodes.


Version 1.3.48: Archived shift list is collapsed by default and shows only records for the selected red-highlighted calendar date. Selecting a highlighted day opens the day list.


Version 1.3.49: Archive calendar dates for shifts with job number REFRESH or ROUTES are highlighted yellow. Other archived dates with content remain CrossCountry red. The calendar legend explains both colours.


Version 1.3.51
- Archived calendar dates for shifts with job number OTHER are highlighted light blue. REFRESH and ROUTES remain yellow; other archived content remains red.
- Calendar legend updated to explain all three colours.


Version 1.3.52: Fixed the PDF Preview Print / Save PDF control using explicit preview-window event handlers.


Version 1.3.53: Changed the on-screen “Headcode / activity” field label to “Job Number”. The underlying field, activity suggestions, stored data and exports are unchanged.


Version 1.3.54: Changed the Job Number field placeholder prompt to “Job #”.

Version 1.3.56: For Job Numbers REFRESH, ROUTES and OTHER, Add train no longer requires a headcode and records the headcode as N/A. Normal train jobs retain mandatory headcode validation.

Version 1.3.59: Incident entries now capture a user-defined incident name / description. The custom name is shown in the operational log, incident update selector, copied entry and shift exports. Older incident records remain supported with their previous numbering.

Version 1.3.69: Added Book on and Book off time fields to shift details, with automatic shift-length calculation (including shifts crossing midnight). Added the Late book off operational log type; it records delay minutes and the new book-off time calculated from the original Book off time.

Version 1.3.73: Added daily ticket scans and ticket sales commission logging (default £0.02 per scan and 6% of sales; editable rates persist on device), plus shift equipment logging for BWV camera and ticket machine set numbers.


Version 1.3.74: Ticket commission and shift equipment entries are shift-wide and no longer display or store a related train. Renamed Backup & restore to App Settings. Commission rates are edited in App Settings and included in local JSON and Google Drive backup/restore.

Version 1.3.78: Fixed commission report totals showing zero. Report aggregation now reads structured commission fields, supports older text-only log entries and derives totals from stored commission components/rates when needed.

Version 1.3.79: Added Generate incident report to each incident entry menu. Uses the supplied two-page XC Report Writing Template, prepopulates available shift / incident / train details, prompts for missing red-highlighted information, saves completed report details with the incident, and offers copy and print / PDF output.

Version 1.3.80: Passenger count entries are grouped by headcode across the operational log and reports. Incident report fields are optional and blank sections are omitted; ADVOKATE is removed from the generator.

Version 1.3.82: Removed passenger count totals. Passenger count tables now show Station, First Class and Standard Class only.

Version 1.3.84: Passenger count entries now record a note with timestamp and headcode, include front set/back set/whole train in the station table, and highlight full-and-standing rows red with a timestamped headcode note below the table.

Version 1.3.86: Passenger count notes are now displayed visibly underneath the passenger table for the matching train, with timestamp and headcode, rather than only being available inside each entry's expandable details.

Version 1.3.87: Passenger count entries sharing the same linked headcode are grouped into one report section and one table. The report table includes station, first class, standard class and train portion, with notes and full-and-standing markers underneath.
\nVersion 1.3.88: Passenger count entries can be edited from the entry options menu, including first and standard class counts, location, train portion, full-and-standing status and notes.\n
Version 1.3.89: Generated incident reports can now be saved to the active daily / operational log. Saving again updates the existing report for that incident instead of creating a duplicate.

Version 1.3.90: Added a direct pencil edit button to each passenger count entry in the grouped operational log. Tapping it opens the passenger count editor immediately, without the entry options menu.

Version 1.3.91: Passenger count tables now display the station name only, stripping a trailing three-letter CRS code in brackets.

Version 1.3.93: Passenger count entries can be deleted individually or all together for a selected headcode from the passenger count group. Both actions require confirmation.

Version 1.3.94: Removed the legacy “Applies to” wording from passenger count entries. New and edited counts use “Train portion”; existing active-shift entries are automatically normalised when loaded.

Version 1.3.95: Passenger count table column heading changed from “Train portion” to “Train” in on-screen grouped tables and plain-text reports. The recorded formation value is retained.

Version 1.3.96: Removed the Train column and Train portion / formation text from grouped passenger count tables and plain-text reports. Station name is shown with First Class and Standard Class counts; underlying formation metadata remains available for editing and other operational notes.

Version 1.3.98: Removed Train portion / Applies to text from passenger count station cells and rows, including full-and-standing row annotations. Station cells now contain only the station name.

Version 1.3.98: Passenger count PDF output now uses a clean table layout without emojis or action icons; notes and full-and-standing status are shown as plain text.

Version 1.3.99: Defect PVN accepts numeric characters only with no maximum length. PVN grouping and report parsing now support PVNs of any length; the field remains optional.

Version 1.3.100: Defect PVN is optional, numeric only, and accepts between one and six digits (maximum six). Unit number remains exactly six digits.

VERSION 1.3.101 – CLOCK SECONDS COLOUR INDICATION
- Seconds display fades smoothly between red (00–10), orange (11–19) and green (20–59).
- Hours and minutes retain their existing appearance.
- The colour transition uses a 1.1-second CSS fade.
- This is a visual timing aid only; operational dispatch must follow current CrossCountry procedures and local instructions.


VERSION 1.3.102 – MULTIPLE OPERATORS FOR TICKET ACCEPTANCE
Ticket acceptance now supports selecting multiple train operators when “Multiple” is selected. The entry records and displays all selected operators together. Selecting “Multiple” requires at least one operator to be ticked. Single-operator and custom “Other” selections remain available.

Version 1.3.105: Related train selection now supports multiple trains/headcodes on operational log entries. All selected headcodes are retained in the saved entry and shown in the operational log and exports. Train Diversion still requires exactly one train; Defect entries retain a single-train selection for unit-specific validation.

Version 1.3.106: Added a floating + shortcut on the diary screen to open Add issue / log entry. The shortcut is excluded from print and report output.


Version 1.3.108: Fixed archived-shift persistence. Changes to archived entries and newly added entries are written into the matching archive record, saved to local storage, and read back for verification before the app reports success. The active shift remains separate.

Version 1.3.115: Fixed archive-edit persistence isolation. While editing an archived shift, autosaves and cloud-backup payloads now retain the active shift's own trains and operational log entries; archived edits are saved only to the selected archived record. The current shift is not replaced by archived shift contents.

Version 1.3.116: When generating a Late Book Off email and no headcode is already linked to the entry, the email dialog now offers a dropdown of valid headcodes from the trains recorded on that shift. Selecting a train fills the headcode field and updates the email subject and body. Manual headcode entry remains available.

Version 1.3.117: Archive calendar now starts on Sunday, with date alignment adjusted accordingly. Late Book Off email subject now states '[HEADCODE] delayed by [XX] minutes'.

Version 1.3.118: Add log entry category menu is alphabetically ordered; Reminder option highlighted yellow and Add incident option highlighted light red.

Version 1.3.120: Entry type picker now starts with General Note, applies a light red background to Add incident and Update existing incident, and a yellow background to Reminder. Entry detail fields and text boxes remain hidden until an entry type is selected.


Version 1.3.151: Updated the Lost Property three-dots email action. Subject now uses the format "lost property - HEADCODE - DD/MM/YY". The full report text is copied before the native email target opens; when a photo is present, the native share sheet is used where supported so the image can be attached to the email.


Version 1.3.168 – Daily Google Drive backup history
- Google Drive backups now use a year/month folder structure: XC ShiftApp Backups/YYYY/MM/.
- A separate XC-ShiftApp-Backup-YYYY-MM-DD.json file is kept for each calendar day. Saves on the same day update that day’s file; previous days are never overwritten.
- When the app opens with Google Drive connected, it checks whether today's backup exists and creates it if needed. Diary changes continue to queue offline and upload when online.
- Restore selects the newest dated backup and retains compatibility with the original single-file backup.
- The Cloudflare Worker source must be redeployed for the new dated-file behavior to take effect.


Version 1.3.168: Added free-text search to Archived shifts & records. Search across archived shift data, operational logs, headcodes, unit and PVN numbers, dates, names and locations. Search results open the matching archived shift.

Version 1.3.172: Added an entry-type dropdown to Archive Search. All entry types is the default; users can filter searches to a specific archived log entry type.

Version 1.3.174: Added a “✕ Close menu” option at the bottom of the Archive Search entry-type picker. Selecting it closes the picker while retaining the current filter.

Version 1.3.175: Incident reports now automatically prefill the BWV camera number from the latest Shift equipment entry in the main daily log, when a camera number has been entered. An existing non-empty BWV camera value saved on the incident report remains unchanged.


Version 1.3.176: Incident report activity is a dropdown with Assist (ACC or ASST), Passing (PASS) and Working, populated from the linked train activity. Unit number(s) are taken from Trains Worked; one unit is identified as a Single set and two units as a Double set. The incident log / reference number is carried into the report when present. Main app text highlighting and pinch / double-tap zoom are disabled; text fields remain editable and selectable.

Version 1.3.180: Changed the Passenger Counts option in the Archive Search entry-type picker to a light brown highlight.


Version 1.3.250: Voice note recording now has a prominent elapsed-time timer and a clear-recording button. A reminder states the two-minute maximum; recording stops automatically at 02:00. Timer text is green through 60 seconds, orange from 61–90 seconds, and red from 91–120 seconds (including the 91-second transition so no second is uncoloured).

Version 1.3.251: Fixed voice-note clearing so an in-progress recorder is invalidated before it can deliver delayed audio data; clearing now reliably removes the preview and resets the recorder. Fixed voice-note attachment so the recording is retained until the shift log save is confirmed, added save-in-progress protection and clearer failure feedback, and reduced recording bitrate to improve local-storage reliability.


Version 1.3.252: Reworked the voice-note Clear recording action to hard-reset the recorder state, invalidate delayed microphone/recording callbacks, stop all microphone tracks, discard buffered audio, revoke the preview URL, detach and reload the audio element, and reset the timer and controls. The clear action is explicitly prevented from triggering form submission. Added a fresh service-worker cache version so installed PWAs receive the corrected files.


VERSION 1.3.260 – FRIENDLIER UK STATION LOOKUP
- Redesigned station results as clear, touch-friendly directory cards with prominent CRS codes.
- Added expandable station details using only the bundled station name, CRS code and coordinates.
- Added direct map links, improved search relevance, a clear-search control and clearer no-results / unavailable states.
- Preserved the existing station dataset, nearest-location tools, local shift storage and app identity.
- Incremented the app and service-worker cache version; saved shift data is not cleared.

VERSION 1.3.272 – NUMBERED PINS PERSISTENCE
- Corrected the main application script and web manifest version so they match the package and service-worker cache version.
- Added explicit button types to avoid accidental form submission from non-submit controls.
- Location finder button actions now report unexpected failures rather than silently stopping.
- Crossing and station result lists now refresh when their bundled data finishes loading; list results do not depend on a successful GPS permission response.
- Preserved the existing local storage key and all saved shift / archive data.

Version 1.3.273: Fixed Station Lookup becoming unresponsive after interacting with a station result. The general station-field autocomplete is now explicitly excluded from the Station Lookup dialog/search field. Station directory cards remain informational only; tapping a card does not launch another search or map. Removed a redundant Station Lookup open-handler definition.

Version 1.3.278: Corrected the Lost Property three-dots menu label from 'Email list property' to 'Email Lost Property'.

Version 1.3.279: Added the supplied Customer Service Issues / Diary as a separate offline page, launched by a full-width button at the bottom of the main screen. Its records use their own local-storage key and remain separate from shift records. A Back to Staff Shift App link returns to the main screen.

Version 1.3.280: Added “Catering issue” and “Crew/Staffing issue” to the Nature of complaint / incident dropdown on the Customer Service Issues / Diary page. Existing diary entries and stored data are unchanged.


Version 1.3.283: Added an option in the operational log entry three-dot menu to share Incident entries to the Customer Service Issues / Diary. Transfers the incident details, date, linked headcode, incident title, report details and updates, assigns a DDMMYY-000-XCCS diary reference, and prevents duplicate sharing of the same source incident.


Version 1.3.284 – Form prompt formatting
- Form questions and field labels are bold across the main app and Customer Service Issues / Diary.
- Entered values and responses remain standard-weight text.
- Operational log and report field labels are bolded where recognised; response text remains regular.


Version 1.3.284 – Bold form prompts and regular-weight responses
- Question labels are bold across the main Staff Shift App forms and the Customer Service Issues / Diary.
- Text entered into inputs, text areas and selectors remains standard-weight.
- Recognised field labels and report section headings are bold in operational log displays and printed incident reports; response text remains regular-weight.

Version 1.3.286: Customer Service Issues / Diary records are now included in the same Google Drive cloud backup and manual JSON backup as the main Staff Shift App. Diary edits queue the next cloud backup; restoring a backup restores the diary records too.

Version 1.3.286: Customer Service Issues / Diary records are now included in the same Google Drive cloud backup and manual JSON backup as the main Staff Shift App. Diary edits queue the next cloud backup; restoring a backup restores the diary records too.

Version 1.3.287: Access-point results now show one Open in Maps action. On iPhone/iPad it opens Apple Maps; on Android it uses a geo: link to open an available mapping app. The embedded access-point map and separate Google/Apple links are hidden for access points only; crossing and station map behaviour is unchanged.


Version 1.3.289: Access Points now combines records from all saved UK regions instead of filtering by a selected region. Removed the region selector and single-region download control. Kept the Update all access point data button and moved it to the bottom of the Access Points page. Existing per-region IndexedDB caches are retained and loaded together; Update all refreshes each UK region and falls back to saved data where a region cannot be reached.


Version 1.3.291 – Location map zoom reduced by approximately 25% on access points, level crossings and railway stations. Maps remain fixed and non-interactive.


Version 1.3.293 – Passenger Count Station Lookup
- Passenger Counts station/location field now explicitly uses the installed stations.json directory through the shared station autocomplete.
- Search by station name or three-letter CRS code and select a station; between-station locations can still be entered manually.
- The chosen station is stored in the passenger count record as Station Name [CRS].


Version 1.3.294 – Trains unit number keypad
- Replaced device-keyboard entry for Unit number and Second unit number with an in-app numeric keypad.
- Keypad accepts six-digit numeric unit numbers and the special values Cancelled, Set Swap and N/A.
- Added Clear and Backspace controls; second unit remains optional.
- Special values are preserved in the train record and displayed in shift logs and reports.
- Existing shift data and storage keys are unchanged.


v1.3.295: Access Point, Level Crossing and Station maps can now be moved by dragging. Map zoom remains fixed; wheel, pinch and double-click zoom remain disabled.

Version 1.3.297: Nearest Crossings, Nearest Stations and Nearest Access Points now show one ‘Open in Maps’ action for each result. The action opens the device mapping app using the selected location coordinates (iOS Maps URL on Apple devices; geo: intent on Android).


Version 1.3.301 – Map selection cleanup
- Removed the Light basemap option.
- Removed Signals and Electrification from the optional OpenRailwayMap overlays.
- Saved selections for removed options are ignored.

Version 1.3.300 – Location map layout
- Moved zoom buttons, map type selector, OpenRailwayMap layer toggles, search radius, result limit and search field below the map frame.
- Added a full-screen map view with a prominent close button; Escape closes full-screen mode before closing the location page.
- Retained all three location finders, map layers, GPS, numbered pins, drag-to-pan and + / − only zoom controls.
