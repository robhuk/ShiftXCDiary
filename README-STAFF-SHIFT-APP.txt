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
