# Oct7

A lightweight web application base for this birthday greeting page.

## Overview
This folder has been updated into a simple app structure so it can be served locally as a web application instead of only opening as a raw HTML file. The project still includes the same festive birthday flipbook experience, but it is now ready to run through a small Python web server.

## Included files

- [app.py](app.py) — Flask application entry point
- [requirements.txt](requirements.txt) — Python dependency list
- [index.html](index.html) — page structure and greeting content
- [style.css](style.css) — visual design and animations
- [script.js](script.js) — flipbook behavior and effects

## Run locally

1. Open a terminal in this folder.
2. Install dependencies:
   python -m pip install -r requirements.txt
3. Start the app:
   python app.py
4. Open the browser to:
   http://localhost:5000

## Open on another device

1. Keep the app running on this PC with `python app.py`.
2. On this PC, run `ipconfig` and find the IPv4 address under the active Wi-Fi adapter.
3. Connect the other device to the same Wi-Fi network and open `http://<PC-IPv4-address>:5000` (for example, `http://172.25.241.50:5000`).
4. If Windows Firewall asks, allow Python on private networks. If the page does not load, allow inbound TCP port 5000 on the Private profile.

This address is for devices on the same local network; it does not publish the site to the internet. The Flask development server is intended for local testing only.

## Notes
This is a minimal web app foundation, which makes it easier to expand with more pages, routes, or backend features later.

## Version tracking
Project changes are recorded in [updatedetails.md](updatedetails.md). Every meaningful update should add a new version entry there so the latest changes and verification notes are easy to follow.