# Update Details

This file records the version history for the project so changes can be tracked easily.

## Version 1.0.0
- Date: 2026-10-05
- Summary: Converted the static birthday page into a minimal web app base so it can run as a local web application.
- Updated files:
  - app.py
  - requirements.txt
  - README.md
  - .gitignore
- Notes:
  - Added a Flask server to serve the project locally.
  - Kept the original birthday flipbook page intact.
  - Confirmed the app responds successfully at http://localhost:5000.

## Version 1.1.0
- Date: 2026-10-05
- Summary: Verified the web app runs successfully in the local environment and documented the final run steps.
- Updated files:
  - updatedetails.md
  - README.md
- Notes:
  - Installed Flask dependency successfully.
  - Confirmed the app responds with HTTP 200 OK at http://localhost:5000.
  - The project is now ready for local browser preview.

## Version 2.0.0
- Date: 2026-10-05
- Summary: Redesigned the birthday page into a more modern, interactive experience with glassmorphism styling, section navigation, and celebratory effects.
- Updated files:
  - index.html
  - style.css
  - script.js
  - updatedetails.md
- Notes:
  - Improved usability with clickable navigation and previous/next controls.
  - Added smoother modern visual design and mobile-friendly layout.
  - Kept the birthday message and music embed while increasing user interaction.

## Version 2.1.0
- Date: 2026-10-05
- Summary: Updated the color theme to a warmer, classy brown palette for easier readability and better mobile viewing.
- Updated files:
  - style.css
  - updatedetails.md
- Notes:
  - Shifted the interface to warm cream, caramel, and brown tones.
  - Improved text contrast and button readability for phone screens.
  - Kept the interactive birthday layout intact while making it more elegant and comfortable to read.

## Version 2.2.0
- Date: 2026-10-05
- Summary: Darkened only the Home card when dark mode is enabled.
- Updated files:
  - style.css
  - updatedetails.md
- Notes:
  - Reused the existing dark theme surface color for the Home card.
  - Kept the light-mode Home card and the Letter card unchanged.

## Version 2.3.0
- Date: 2026-10-05
- Summary: Replaced the Spotify embed with a custom player for the local song file.
- Updated files:
  - index.html
  - style.css
  - script.js
  - updatedetails.md
- Notes:
  - Added play/pause, seek, elapsed time, and duration controls.
  - Playback starts at the beginning when Play is pressed.

## Version 2.4.0
- Date: 2026-10-05
- Summary: Added a compact song player that stays available across sections.
- Updated files:
  - index.html
  - style.css
  - script.js
  - updatedetails.md
- Notes:
  - Kept the mini player synchronized with the full Song section controls.
  - Made the player responsive for mobile screens.

## Version 2.5.0
- Date: 2026-10-05
- Summary: Removed the standalone Song section and aligned the persistent player with the site cards.
- Updated files:
  - index.html
  - style.css
  - script.js
  - updatedetails.md
- Notes:
  - Kept playback and seeking available in the player across the remaining sections.
  - Connected the Home Play song button to the persistent player.

## Version 2.6.0
- Date: 2026-10-05
- Summary: Improved celebration confetti visibility in light and dark modes.
- Updated files:
  - style.css
  - script.js
  - updatedetails.md
- Notes:
  - Added separate warm, higher-contrast confetti palettes for each theme.

## Version 2.7.0
- Date: 2026-10-05
- Summary: Made the Celebrate animation larger and more expressive.
- Updated files:
  - script.js
  - style.css
  - updatedetails.md
- Notes:
  - Increased the burst to 90 mixed-shape pieces and launched it from the Celebrate button.
  - Extended the animation and added staggered timing.

## Version 2.8.0
- Date: 2026-10-05
- Summary: Documented same-network access and disabled Flask debug mode.
- Updated files:
  - app.py
  - README.md
  - updatedetails.md
- Notes:
  - Documented how to open the site from another device on the same Wi-Fi network.
  - Verified the app responds at the PC's LAN address.

## Update rules
- Every meaningful change to the project should add a new version entry here.
- Add the date, summary, files changed, and what was verified.
- Keep entries short, clear, and in chronological order.
