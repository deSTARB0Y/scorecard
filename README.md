# Cricket Broadcast Scorecard Overlay

A professional-grade cricket scorecard overlay system for live streaming (OBS, vMix, etc.).

## Features
- **Real-time Synchronization:** Control everything from an Admin panel and see updates instantly on the Broadcast view.
- **Cricinfo Data Parser:** Simply copy-paste raw text from ESPNcricinfo Live/Scorecard/Playing XI tabs to populate stats.
- **Multiple Scenes:**
  - Mini Scorecard (Bottom-third)
  - Full Scorecard (Stats overview)
  - Playing XI (Team lists)
  - Manhattan Graph (Runs per over)
- **Celebration Animations:** Trigger full-screen "FOUR", "SIX", or "WICKET" banners.
- **Customization:** Change team colors, names, and background images.

## How to Use

1. **Open the Admin Panel:**
   Navigate to `/admin` in your browser. This is your control center.

2. **Open the Broadcast View:**
   Navigate to `/view` in a **new tab** or as a **Browser Source in OBS**.

3. **Populate Data:**
   - Go to an ESPNcricinfo live match.
   - Select all text on the page (Ctrl+A) and copy (Ctrl+C).
   - Paste it into the "Raw Data Input" box in the Admin panel.
   - Click **"Parse & Update Match State"**.

4. **Go Live:**
   - Use the buttons in the "Active Overlays" section to toggle different views on the broadcast.
   - Trigger celebrations manually when major events happen.
   - Customize colors to match the competing teams.

## OBS Setup
1. Add a new **Browser Source** in OBS.
2. Set the URL to your broadcast view (e.g., `http://localhost:3000/view`).
3. Set the Width to `1920` and Height to `1080`.
4. Ensure "Transparent" mode is checked in the Admin panel if you want the overlay to sit on top of your video.
