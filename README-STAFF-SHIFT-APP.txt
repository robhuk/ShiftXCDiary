Version 1.3.302 (28 November 2026): Added live nearby level-crossing status from Mind the Gates to the Nearest Crossings page, including open/closed/unknown state, confirmation status, estimated next closure, and on-demand forecast timeline and approaching train details. Added source credit and safety disclaimer. Live information requires an internet connection and GPS.

Version 1.3.301 (28 November 2026): Removed the Light map type and removed Signals and Electrification from the optional OpenRailwayMap layers. Previously saved selections for removed options are ignored.

Version 1.3.300 (28 November 2026): Moved all map controls and filters below the map frame on Nearest Crossings, Nearest Stations and Nearest Access Points. Added full-screen map mode with an on-map close button. Existing map types, optional OpenRailwayMap overlays, GPS, pins, dragging and + / − zoom controls are retained.


Version 1.3.298 (28 November 2026): Added a map-type dropdown at the bottom-right of Nearest Crossings, Nearest Stations and Nearest Access Points maps. Select Street (OpenStreetMap), Satellite (Esri imagery) or Terrain (OpenTopoMap). The selection is remembered on the device and applies across all three location maps. Existing +/− zoom controls remain the only zoom controls; wheel, pinch and double-click zoom remain disabled, while map dragging remains enabled. Alternative basemaps require an internet connection; Street remains the default.

Version 1.3.297 (28 November 2026): Location maps now zoom only with the on-map + and − controls. Scroll-wheel, pinch, double-click and automatic zoom-on-result selection are disabled; map dragging remains available.

Version 1.3.281 (27 November 2026): Customer Service Issues / Diary now uses DDMMYY-000-XCCS references, supports export to the main daily log as Customer service issue, groups edit/share/export/delete actions under the three-dot menu, and opens full records in a custom pop-up with an X close button.

Staff Shift App v1.3.65

Upload the CONTENTS of this folder to the existing GitHub Pages repository to retain the same app URL and locally saved shift records. The application retains its original APP_ID and local storage keys intentionally for data compatibility. Existing Cloudflare Worker and Google Drive settings are unchanged.

New branding: Staff Shift App icon, banner, navy/blue/red styling.

Back up shift records before replacing deployed files. On an installed PWA, reopen or reload to allow the new service worker to update cached assets.


Version 1.3.66: Removed the large top branding header and banner for a cleaner, more compact app layout. The PWA install action is retained in the footer.

Version 1.3.71: Defect entries are grouped together by six-digit unit number and separated into PVN subgroups. Grouping is reflected in the live log, copy, email and PDF reports. Individual defect edit controls remain available.

Version 1.3.72: Added Cosmetic, Minor and Other to the defect category selector. Existing defect categories and unit/PVN grouping remain unchanged.
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

Version 1.3.102: Ticket acceptance supports multiple operator selection when “Multiple” is chosen.

Version 1.3.103: Delay entries now show a custom classification prompt at submission. NEW adds “New Delay:” to the report, EXISTING adds “Existing delay”, and N/A adds no classification text. Cancelling the prompt leaves the delay unsubmitted.
\nVersion 1.3.104: Added a 📋 copy control to each passenger count group in the operational log. It copies the complete grouped table as plain text, including station, first class, standard class and full-and-standing markers. The copy icon is only a screen control and is not included in exported reports.\n
Version 1.3.105: Related train selection now supports multiple trains/headcodes on operational log entries. All selected headcodes are retained in the saved entry and shown in the operational log and exports. Train Diversion still requires exactly one train; Defect entries retain a single-train selection for unit-specific validation.

Version 1.3.106: Added a floating + shortcut on the diary screen to open Add issue / log entry. The shortcut is excluded from print and report output.

Version 1.3.107: Archived shifts now support editing existing operational log entries and adding new issue / log entries directly to the selected archive. Changes are saved back to that archive without replacing the active shift; cancelling an edit leaves the archive unchanged.


Version 1.3.108: Fixed archived-shift persistence. Changes to archived entries and newly added entries are written into the matching archive record, saved to local storage, and read back for verification before the app reports success. The active shift remains separate.

Version 1.3.110: Late Book Off email generation is now available from the relevant Daily Log entry three-dot menu. Saving a Late Book Off no longer opens the email dialog automatically.

Version 1.3.111: Late Book Off email reason now uses a predefined delay-reason dropdown. Selecting Other reveals a free-text field. Existing custom reasons are preserved as Other, and copy/share actions require a headcode and a selected or entered reason.

Version 1.3.112: Email reports preserve passenger-count tables as nested HTML tables and render grouped defects in a structured table, rather than flattening these groups into text. PDF/print passenger-count tables remain formatted as tables.

Version 1.3.113: Initial Late book off log-entry form now requires a delay reason dropdown with an Other free-text option. The selected reason is saved with the entry, appears in the log and prepopulates the Late Book Off email.

Version 1.3.114: Archived shift view now allows individual operational log entries to be deleted with confirmation. New entries and incident updates created while editing an archived shift retain the original archived shift/log date instead of being dated with the current day. Editing an existing archived entry preserves its original timestamp date.

Version 1.3.115: Fixed archive-edit persistence isolation. While editing an archived shift, autosaves and cloud-backup payloads now retain the active shift's own trains and operational log entries; archived edits are saved only to the selected archived record. The current shift is not replaced by archived shift contents.

Version 1.3.116: When generating a Late Book Off email and no headcode is already linked to the entry, the email dialog now offers a dropdown of valid headcodes from the trains recorded on that shift. Selecting a train fills the headcode field and updates the email subject and body. Manual headcode entry remains available.

Version 1.3.117: Archive calendar now starts on Sunday, with date alignment adjusted accordingly. Late Book Off email subject now states '[HEADCODE] delayed by [XX] minutes'.

Google Drive daily backup update: deploy the updated contents of cloudflare-worker/src/index.js to the existing Cloudflare Worker. Daily backups are stored under XC ShiftApp Backups/YYYY/MM/ with one dated JSON file per day.

Version 1.3.174: Added a “✕ Close menu” option at the bottom of the Archive Search entry-type picker. Selecting it closes the picker while retaining the current filter.

Version 1.3.175: Incident reports now automatically prefill the BWV camera number from the latest Shift equipment entry in the main daily log, when a camera number has been entered. An existing non-empty BWV camera value saved on the incident report remains unchanged.


Version 1.3.176: Incident report activity is a dropdown with Assist (ACC or ASST), Passing (PASS) and Working, populated from the linked train activity. Unit number(s) are taken from Trains Worked; one unit is identified as a Single set and two units as a Double set. The incident log / reference number is carried into the report when present. Main app text highlighting and pinch / double-tap zoom are disabled; text fields remain editable and selectable.

Version 1.3.180: Changed the Passenger Counts option in the Archive Search entry-type picker to a light brown highlight.

Version 1.3.211: Renamed the archive panel heading to “Archive Shifts / Calendar / search”. No archive, calendar, search, or saved-data behaviour changed.


SHIFT TOOLS / REFERENCE (v1.3.255)
A collapsed-by-default Shift Tools / Reference menu is positioned at the bottom of the diary page. It contains separate Crossings, Stations and Access points buttons. Each button opens the location finder directly in the selected category using phone GPS, distance sorting, radius filters, an interactive map and directions. Access point records are downloaded by region and saved locally in IndexedDB for subsequent offline searches. Map tiles and directions require an internet connection; GPS requires location permission and a secure HTTPS origin. Access point records are reference information only and are not permission to access railway infrastructure. Verify information through authorised railway systems and applicable safety arrangements.

Version 1.3.272: Button reliability pass. Corrected the main application version and manifest version to match the package and service-worker cache. Added explicit button types to prevent accidental form submissions. Location finder actions now surface asynchronous failures, and crossing / station results refresh automatically when their local datasets finish loading, even if GPS access is denied.


Version 1.3.272: Fixed numbered map pins across Nearest Crossings, Nearest Stations and Nearest Access Points. Map markers now retain the numbered result set when GPS location is acquired or refreshed, rather than being cleared by the subsequent map redraw.

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


Version 1.3.285 – Customer Service daily-log export cleanup
When exporting a Customer Service diary entry to the main daily log, the export now excludes the diary-only tracking fields: Complaint / please explain received, Account response sent, and Sent to line manager. These fields remain available in the Customer Service diary itself.

Version 1.3.286: Customer Service Issues / Diary records are now included in the same Google Drive cloud backup and manual JSON backup as the main Staff Shift App. Diary edits queue the next cloud backup; restoring a backup restores the diary records too.

Version 1.3.286: Customer Service Issues / Diary records are now included in the same Google Drive cloud backup and manual JSON backup as the main Staff Shift App. Diary edits queue the next cloud backup; restoring a backup restores the diary records too.

Version 1.3.287: Access-point results now show one Open in Maps action. On iPhone/iPad it opens Apple Maps; on Android it uses a geo: link to open an available mapping app. The embedded access-point map and separate Google/Apple links are hidden for access points only; crossing and station map behaviour is unchanged.

Version 1.3.290 – Fixed location maps
- Nearest Access Points now displays an embedded reference map with numbered markers.
- Access point, crossing and station maps use a fixed zoom level and do not support map zooming, dragging, or scrolling gestures.
- Map zoom controls are hidden; result lists and Open in Maps links remain available.


Version 1.3.291 – Location map zoom reduced by approximately 25% on access points, level crossings and railway stations. Maps remain fixed and non-interactive.
\nVersion 1.3.292 – Form question and field labels are bold in operational log and report outputs; recorded answers remain standard weight.\n

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
