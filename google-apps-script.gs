/**
 * Johnny Education — enrollment store on Google Sheets
 * ----------------------------------------------------
 * 1. Create a Google Sheet (e.g. "Johnny Signups"), open Extensions > Apps Script.
 * 2. Paste this entire file, save.
 * 3. Deploy > New deployment > type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the Web app URL and paste it into site-config.js (googleEndpoint).
 * 5. First POST/GET auto-creates the "Applications" tab with headers.
 *
 * API:
 *   GET  ?op=health        -> { ok: true }
 *   GET  ?op=list          -> [ {ref, parent, phone, email, child, dob, grade, course, note, submittedAt}, ... ]
 *   POST ?op=add  (JSON body, Content-Type: text/plain)  -> { ok: true, ref: "JS26XXXX" }
 */

var SHEET_NAME = 'Applications';
var HEADER = ['ref','parent','phone','email','child','dob','grade','course','note','submittedAt'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(HEADER);
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
      .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var op = (e && e.parameter && e.parameter.op) || 'list';
  if (op === 'health') return json_({ ok: true });
  if (op === 'list') {
    var sh = getSheet_();
    var last = sh.getLastRow();
    var out = [];
    if (last > 1) {
      var rows = sh.getRange(2, 1, last - 1, HEADER.length).getValues();
      rows.forEach(function (r) {
        var o = {};
        HEADER.forEach(function (h, i) { o[h] = (r[i] === '' || r[i] == null) ? '' : String(r[i]); });
        out.push(o);
      });
    }
    return json_(out);
  }
  return json_({ error: 'unknown op: ' + op });
}

function doPost(e) {
  var op = (e && e.parameter && e.parameter.op) || 'add';
  if (op === 'add') {
    var rec;
    try { rec = JSON.parse(e.postData.contents); }
    catch (_) { return json_({ ok: false, error: 'invalid JSON body' }); }
    if (!rec || !String(rec.parent || '').trim()) return json_({ ok: false, error: 'missing parent name' });
    var sh = getSheet_();
    var row = HEADER.map(function (h) { return rec[h] == null ? '' : String(rec[h]); });
    sh.appendRow(row);
    return json_({ ok: true, ref: rec.ref || '', rows: sh.getLastRow() - 1 });
  }
  return json_({ ok: false, error: 'unknown op: ' + op });
}
