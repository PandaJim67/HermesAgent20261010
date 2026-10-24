// ============================================================
//  Shared site config for Johnny Education apps.
//  Referenced by /signup/ and /admin/ as  ../site-config.js
//
//  Google Apps Script Web App endpoint:
//   - Leave empty ""  -> apps fall back to browser LocalStorage only
//     (data is device-only; a different phone/PC won't see it).
//   - Paste your deployed Apps Script Web App URL to enable real
//     cross-device Google Sheets storage.
//
//  How to get the URL: see google-apps-script.gs in this repo,
//  or ask JimHermes to walk you through it (5 steps).
// ============================================================
window.APPS = {
  // Example shape: "https://script.google.com/macros/s/AKf.../exec"
  googleEndpoint: ""
};
