// ========================================
// FIXED Google Apps Script - Copy this into Apps Script editor
// ========================================

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const sheetName = body.sheet;
    const data = body.data || {};

    if (!sheetName) {
      return corsResponse({ ok: false, message: "Missing sheet name" }, 400);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(sheetName);

    if (!sh) {
      return corsResponse({ ok: false, message: `Sheet not found: ${sheetName}` }, 404);
    }

    // Ensure Date exists
    if (!data.Date) data.Date = new Date().toISOString();

    // Read headers from row 1
    const lastCol = Math.max(sh.getLastColumn(), 1);
    const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].filter(Boolean);

    if (headers.length === 0) {
      return corsResponse({ ok: false, message: "No headers found in row 1" }, 400);
    }

    // Create row array matching header positions
    const row = headers.map((h) => {
      // Try exact match first (your headers are capitalized: Date, Name, Phone, etc.)
      if (data[h] !== undefined && data[h] !== null && data[h] !== "") {
        return data[h];
      }
      return "";
    });

    // Log for debugging
    console.log("Headers:", headers);
    console.log("Data received:", data);
    console.log("Row to append:", row);

    sh.appendRow(row);

    return corsResponse({ 
      ok: true, 
      message: "Saved successfully", 
      sheet: sheetName,
      rowCount: row.length
    }, 200);
    
  } catch (err) {
    console.error("Error:", err);
    return corsResponse({ 
      ok: false, 
      message: String(err && err.message ? err.message : err) 
    }, 500);
  }
}

function doOptions(e) {
  return corsResponse({ ok: true }, 200);
}

function corsResponse(obj, statusCode) {
  const output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
    
  // Add CORS headers for browser compatibility
  return output
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    .setHeader("Access-Control-Max-Age", "3600");
}
