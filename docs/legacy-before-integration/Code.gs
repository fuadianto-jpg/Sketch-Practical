/**
 * ==========================================================================
 * SISTEM EVALUASI PRAKTIKUM NDT (MAGNETIC & PENETRANT TESTING)
 * Google Apps Script Backend (Code.gs)
 * ==========================================================================
 * PRD Compliance:
 * - 100% Google Apps Script Web App
 * - Google Sheets as Database (Master_Akun, Data_Header, Data_Detail)
 * - Google Drive as Storage ([Root] > [Metode MT/PT] > [Test_Piece_ID])
 * - Role-Based Auth: Penguji (ID + PIN), Peserta (Hanya ID)
 * - Universal Form, Single-Stroke Indication, Auto-Numbering by From Y
 * - Desktop-First Side-by-Side Comparison & Text Feedback (No numeric score)
 */

// ==========================================================================
// KONFIGURASI GLOBAL
// ==========================================================================
// Masukkan ID Folder Google Drive utama untuk menyimpan dokumen/sketsa NDT
// Jika dibiarkan kosong, sistem otomatis membuat folder "NDT_Praktikum_Storage" di Root Drive Anda.
var ROOT_FOLDER_ID = ""; 

// ID Spreadsheet Utama (Container Bound / Database)
var SPREADSHEET_ID = "1VNWOKMHjUXBC-_8subExk3fOyzbwlw_kBqkZ6YqlR0Q";

// Helper Pengambil Spreadsheet yang Aman untuk Web App
function getAppSpreadsheet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {}
  if (SPREADSHEET_ID && SPREADSHEET_ID !== "") {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {}
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

// Nama-nama Sheet Database
var SHEETS = {
  AKUN: "Master_Akun",
  HEADER: "Data_Header",
  DETAIL: "Data_Detail"
};

// ==========================================================================
// WEB APP ENTRY POINTS (doGet & doPost)
// ==========================================================================
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Aplikasi Evaluasi Praktikum NDT (MT & PT)")
    .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000); // Mencegah race condition saat multi-submit
  
  try {
    var requestData = JSON.parse(e.postData.contents);
    var action = requestData.action;
    var result = {};
    
    switch (action) {
      case "login":
        result = handleLogin(requestData.payload);
        break;
      case "submitReport":
        result = handleSubmitReport(requestData.payload);
        break;
      case "getParticipantSubmissions":
        result = handleGetParticipantSubmissions(requestData.payload);
        break;
      case "getEvaluatorSubmissions":
        result = handleGetEvaluatorSubmissions(requestData.payload);
        break;
      case "getComparisonData":
        result = handleGetComparisonData(requestData.payload);
        break;
      case "saveEvaluation":
        result = handleSaveEvaluation(requestData.payload);
        break;
      case "setupDatabase":
        result = setupInitialDatabase();
        break;
      default:
        result = { success: false, message: "Aksi tidak dikenal: " + action };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Terjadi kesalahan server: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ==========================================================================
// CLIENT-CALLABLE FUNCTIONS VIA google.script.run (Untuk integrasi native GAS)
// ==========================================================================
function apiLogin(payload) { return handleLogin(payload); }
function apiSubmitReport(payload) { return handleSubmitReport(payload); }
function apiGetParticipantSubmissions(payload) { return handleGetParticipantSubmissions(payload); }
function apiGetEvaluatorSubmissions(payload) { return handleGetEvaluatorSubmissions(payload); }
function apiGetComparisonData(payload) { return handleGetComparisonData(payload); }
function apiSaveEvaluation(payload) { return handleSaveEvaluation(payload); }
function apiSetupInitialDatabase() { return setupInitialDatabase(); }

// Helper untuk include file modular di HTML
function include(filename) {
  try {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  } catch (e) {
    Logger.log("Error including " + filename + ": " + e);
    return "";
  }
}

// ==========================================================================
// 1. AUTENTIKASI & HAK AKSES
// ==========================================================================
/**
 * Login Handler:
 * - Penguji: Membutuhkan ID_Penguji dan PIN
 * - Peserta: HANYA membutuhkan ID_Peserta (tanpa PIN)
 */
function handleLogin(payload) {
  var role = (payload.role || "").trim();
  var userId = (payload.userId || "").trim();
  var pin = (payload.pin || "").trim();
  
  if (!userId) {
    return { success: false, message: "ID Pengguna wajib diisi." };
  }
  
  var ss = getAppSpreadsheet();
  var sheet = ss.getSheetByName(SHEETS.AKUN);
  
  if (!sheet) {
    setupInitialDatabase();
    sheet = ss.getSheetByName(SHEETS.AKUN);
  }
  
  var data = sheet.getDataRange().getValues();
  // Header: Role | ID_Pengguna | PIN | Nama
  for (var i = 1; i < data.length; i++) {
    var dbRole = String(data[i][0]).trim();
    var dbId = String(data[i][1]).trim();
    var dbPin = String(data[i][2]).trim();
    var dbNama = String(data[i][3]).trim();
    
    if (dbId.toLowerCase() === userId.toLowerCase() && dbRole.toLowerCase() === role.toLowerCase()) {
      if (role.toLowerCase() === "penguji") {
        if (dbPin !== pin) {
          return { success: false, message: "PIN Penguji salah. Silakan coba lagi." };
        }
      }
      
      return {
        success: true,
        user: {
          role: dbRole,
          userId: dbId,
          nama: dbNama
        }
      };
    }
  }
  
  // Jika peserta belum terdaftar di database, daftarkan secara otomatis agar cepat di lapangan
  if (role.toLowerCase() === "peserta") {
    var defaultName = payload.nama ? payload.nama.trim() : "Peserta " + userId;
    sheet.appendRow(["Peserta", userId, "", defaultName]);
    return {
      success: true,
      user: {
        role: "Peserta",
        userId: userId,
        nama: defaultName
      }
    };
  }
  
  return { success: false, message: "Akun Penguji dengan ID '" + userId + "' tidak ditemukan." };
}

// ==========================================================================
// 2. MANAJEMEN FOLDER GOOGLE DRIVE
// ==========================================================================
/**
 * Membuat/Mengambil struktur hierarki folder:
 * Root Folder -> Metode (MT / PT) -> Test Piece ID
 */
function getOrCreateFolderHierarchy(metode, testPieceId) {
  var rootFolder;
  if (ROOT_FOLDER_ID && ROOT_FOLDER_ID.trim() !== "") {
    try {
      rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID.trim());
    } catch (e) {
      rootFolder = getOrCreateRootFolder();
    }
  } else {
    rootFolder = getOrCreateRootFolder();
  }
  
  // Sub-folder 1: Metode (MT / PT)
  var cleanMetode = (metode || "NDT_General").toUpperCase().replace(/[^A-Z0-9_-]/g, "_");
  var metodeFolder = getOrCreateChildFolder(rootFolder, cleanMetode);
  
  // Sub-folder 2: Test Piece ID
  var cleanPieceId = (testPieceId || "Unassigned").toUpperCase().replace(/[^A-Z0-9_-]/g, "_");
  var testPieceFolder = getOrCreateChildFolder(metodeFolder, cleanPieceId);
  
  return testPieceFolder;
}

function getOrCreateRootFolder() {
  var folderName = "NDT_Praktikum_Storage";
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

function getOrCreateChildFolder(parentFolder, childName) {
  var folders = parentFolder.getFoldersByName(childName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parentFolder.createFolder(childName);
}

/**
 * Menyimpan Base64 DataURI langsung ke Drive Folder
 */
function saveBase64Image(folder, base64Data, filename) {
  try {
    if (!base64Data || base64Data.indexOf("data:") !== 0) {
      return "";
    }
    var parts = base64Data.split(",");
    var mimeMatch = parts[0].match(/:(.*?);/);
    var mimeType = mimeMatch ? mimeMatch[1] : "image/png";
    var decoded = Utilities.base64Decode(parts[1]);
    var blob = Utilities.newBlob(decoded, mimeType, filename);
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    Logger.log("Error saveBase64Image: " + err.toString());
    return "";
  }
}

// ==========================================================================
// 3. SUBMISI LAPORAN (PENGUJI MASTER & PESERTA)
// ==========================================================================
/**
 * Menyimpan laporan header & detail indikasi:
 * - Auto-sort indikasi berdasarkan From_Y dari terkecil ke terbesar (Urut Kiri ke Kanan)
 * - Auto-numbering 1, 2, 3...
 * - Upload Foto Keseluruhan & Sketsa ke Google Drive
 */
function handleSubmitReport(payload) {
  var ss = getAppSpreadsheet();
  var sheetHeader = ss.getSheetByName(SHEETS.HEADER);
  var sheetDetail = ss.getSheetByName(SHEETS.DETAIL);
  
  if (!sheetHeader || !sheetDetail) {
    setupInitialDatabase();
    sheetHeader = ss.getSheetByName(SHEETS.HEADER);
    sheetDetail = ss.getSheetByName(SHEETS.DETAIL);
  }
  
  var role = payload.role; // "Penguji" atau "Peserta"
  var nama = payload.nama;
  var metode = payload.metode; // "Magnetic Particle" atau "Penetrant Testing"
  var testPieceId = (payload.testPieceId || "").trim().toUpperCase();
  var dimPanjang = Number(payload.dimPanjang) || 0;
  var dimLebar = Number(payload.dimLebar) || 0;
  var isMaster = !!payload.isMaster; // Boolean Khusus Penguji
  var isZonk = !!payload.isZonk;     // Boolean Khusus Penguji
  var overallPhotoBase64 = payload.overallPhotoBase64;
  var indications = payload.indications || [];
  
  // Status Benda
  var statusBenda = "Normal";
  if (isZonk) {
    statusBenda = "ZONK (Bersih Tanpa Cacat)";
  } else if (isMaster) {
    statusBenda = "KUNCI JAWABAN (MASTER)";
  }
  
  // Status Evaluasi
  var statusEvaluasi = isMaster ? "MASTER_REF" : "Menunggu Evaluasi";
  
  // Buat ID unik submisi
  var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss");
  var rolePrefix = isMaster ? "MSTR" : "PST";
  var cleanIdPart = testPieceId.replace(/[^A-Z0-9]/g, "");
  var submissionId = rolePrefix + "_" + cleanIdPart + "_" + timestamp;
  
  // Ambil folder Drive
  var targetFolder = getOrCreateFolderHierarchy(metode, testPieceId);
  
  // Simpan Foto Keseluruhan
  var overallPhotoUrl = "";
  if (overallPhotoBase64) {
    var photoFileName = cleanIdPart + "_" + (isMaster ? "Master" : nama.replace(/\s+/g, "_")) + "_Overall.jpg";
    overallPhotoUrl = saveBase64Image(targetFolder, overallPhotoBase64, photoFileName);
  }
  
  // Auto-Numbering (Urut Kiri ke Kanan berdasarkan nilai From_Y terkecil ke terbesar)
  if (indications && indications.length > 0) {
    indications.sort(function(a, b) {
      return (Number(a.fromY) || 0) - (Number(b.fromY) || 0);
    });
  }
  
  // Simpan data ke Data_Header:
  // Submission_ID, Role, Nama, Metode, Test_Piece_ID, Dim_Panjang, Dim_Lebar, Status_Benda, Overall_Photo_URL, Status_Evaluasi
  sheetHeader.appendRow([
    submissionId,
    role,
    nama,
    metode,
    testPieceId,
    dimPanjang,
    dimLebar,
    statusBenda,
    overallPhotoUrl,
    statusEvaluasi
  ]);
  
  // Simpan data detail indikasi ke Data_Detail:
  // Submission_ID, Indication_No_Auto, Length, Width, From_Y, Type, Decision, Sketch_Image_URL, Catatan_Penguji
  for (var i = 0; i < indications.length; i++) {
    var ind = indications[i];
    var autoNo = i + 1; // Nomor Indikasi terurut
    
    // Simpan gambar sketsa Single-Stroke ke Drive
    var sketchUrl = "";
    if (ind.sketchBase64) {
      var sketchFileName = cleanIdPart + "_" + (isMaster ? "Master" : nama.replace(/\s+/g, "_")) + "_Sketsa" + autoNo + ".png";
      sketchUrl = saveBase64Image(targetFolder, ind.sketchBase64, sketchFileName);
    }
    
    sheetDetail.appendRow([
      submissionId,
      autoNo,
      Number(ind.length) || 0,
      Number(ind.width) || 0,
      Number(ind.fromY) || 0,
      ind.type || "Linear",
      ind.decision || "Reject",
      sketchUrl,
      "" // Catatan_Penguji kosong di awal
    ]);
  }
  
  return {
    success: true,
    submissionId: submissionId,
    message: isMaster 
      ? "Kunci Jawaban (Master) berhasil disimpan untuk Test Piece: " + testPieceId
      : "Laporan praktikum berhasil dikirim! Status: Menunggu Evaluasi."
  };
}

// ==========================================================================
// 4. RIWAYAT LAPORAN PESERTA
// ==========================================================================
function handleGetParticipantSubmissions(payload) {
  var ss = getAppSpreadsheet();
  var sheetHeader = ss.getSheetByName(SHEETS.HEADER);
  var namaPeserta = (payload.nama || "").trim();
  
  if (!sheetHeader) return { success: true, list: [] };
  
  var data = sheetHeader.getDataRange().getValues();
  var list = [];
  
  for (var i = 1; i < data.length; i++) {
    var subRole = String(data[i][1]).trim();
    var subNama = String(data[i][2]).trim();
    
    if (subRole.toLowerCase() === "peserta" && (!namaPeserta || subNama.toLowerCase() === namaPeserta.toLowerCase())) {
      list.push({
        submissionId: data[i][0],
        role: data[i][1],
        nama: data[i][2],
        metode: data[i][3],
        testPieceId: data[i][4],
        dimPanjang: data[i][5],
        dimLebar: data[i][6],
        statusBenda: data[i][7],
        overallPhotoUrl: data[i][8],
        statusEvaluasi: data[i][9] // "Menunggu Evaluasi" / "Sudah Dievaluasi"
      });
    }
  }
  
  // Urutkan dari yang terbaru
  list.reverse();
  return { success: true, list: list };
}

// ==========================================================================
// 5. DATA UNTUK PENGUJI (DAFTAR SUBMISI & MASTER)
// ==========================================================================
function handleGetEvaluatorSubmissions(payload) {
  var ss = getAppSpreadsheet();
  var sheetHeader = ss.getSheetByName(SHEETS.HEADER);
  if (!sheetHeader) return { success: true, list: [], masters: [] };
  
  var data = sheetHeader.getDataRange().getValues();
  var participants = [];
  var masters = {};
  
  for (var i = 1; i < data.length; i++) {
    var row = {
      submissionId: data[i][0],
      role: data[i][1],
      nama: data[i][2],
      metode: data[i][3],
      testPieceId: data[i][4],
      dimPanjang: data[i][5],
      dimLebar: data[i][6],
      statusBenda: data[i][7],
      overallPhotoUrl: data[i][8],
      statusEvaluasi: data[i][9]
    };
    
    if (row.role.toLowerCase() === "penguji" || row.statusBenda.indexOf("MASTER") !== -1) {
      masters[row.testPieceId] = row;
    } else {
      participants.push(row);
    }
  }
  
  participants.reverse();
  return {
    success: true,
    participants: participants,
    masters: masters
  };
}

// ==========================================================================
// 6. KOMPARASI SIDE-BY-SIDE (MASTER VS PESERTA)
// ==========================================================================
function handleGetComparisonData(payload) {
  var participantSubId = payload.submissionId;
  var ss = getAppSpreadsheet();
  var sheetHeader = ss.getSheetByName(SHEETS.HEADER);
  var sheetDetail = ss.getSheetByName(SHEETS.DETAIL);
  
  if (!sheetHeader || !sheetDetail) {
    return { success: false, message: "Sheet data belum tersedia." };
  }
  
  var headers = sheetHeader.getDataRange().getValues();
  var participantHeader = null;
  var masterHeader = null;
  
  // 1. Cari Header Peserta
  for (var i = 1; i < headers.length; i++) {
    if (headers[i][0] === participantSubId) {
      participantHeader = {
        submissionId: headers[i][0],
        role: headers[i][1],
        nama: headers[i][2],
        metode: headers[i][3],
        testPieceId: headers[i][4],
        dimPanjang: headers[i][5],
        dimLebar: headers[i][6],
        statusBenda: headers[i][7],
        overallPhotoUrl: headers[i][8],
        statusEvaluasi: headers[i][9]
      };
      break;
    }
  }
  
  if (!participantHeader) {
    return { success: false, message: "Data submisi tidak ditemukan." };
  }
  
  // 2. Cari Header Master untuk Test Piece ID yang sama
  for (var j = 1; j < headers.length; j++) {
    var role = String(headers[j][1]).toLowerCase();
    var pieceId = String(headers[j][4]).toUpperCase();
    var status = String(headers[j][7]).toUpperCase();
    
    if (pieceId === participantHeader.testPieceId.toUpperCase() && (role === "penguji" || status.indexOf("MASTER") !== -1)) {
      masterHeader = {
        submissionId: headers[j][0],
        role: headers[j][1],
        nama: headers[j][2],
        metode: headers[j][3],
        testPieceId: headers[j][4],
        dimPanjang: headers[j][5],
        dimLebar: headers[j][6],
        statusBenda: headers[j][7],
        overallPhotoUrl: headers[j][8],
        statusEvaluasi: headers[j][9]
      };
      break;
    }
  }
  
  // 3. Ambil Detail Indikasi Peserta & Master
  var details = sheetDetail.getDataRange().getValues();
  var participantDetails = [];
  var masterDetails = [];
  
  for (var k = 1; k < details.length; k++) {
    var subId = details[k][0];
    var item = {
      rowIndex: k + 1,
      submissionId: details[k][0],
      indicationNo: details[k][1],
      length: details[k][2],
      width: details[k][3],
      fromY: details[k][4],
      type: details[k][5],
      decision: details[k][6],
      sketchUrl: details[k][7],
      catatanPenguji: details[k][8] || ""
    };
    
    if (subId === participantSubId) {
      participantDetails.push(item);
    } else if (masterHeader && subId === masterHeader.submissionId) {
      masterDetails.push(item);
    }
  }
  
  return {
    success: true,
    participant: {
      header: participantHeader,
      details: participantDetails
    },
    master: {
      header: masterHeader,
      details: masterDetails
    }
  };
}

// ==========================================================================
// 7. SIMPAN EVALUASI PENGUJI (CATATAN FEEDBACK TANPA ANGKA)
// ==========================================================================
/**
 * Penguji TIDAK memberikan nilai angka/skor.
 * Penguji memberikan Catatan Perbaikan (Feedback) pada kolom teks yang disediakan.
 * Status evaluasi diubah menjadi "Sudah Dievaluasi".
 */
function handleSaveEvaluation(payload) {
  var submissionId = payload.submissionId;
  var generalFeedback = payload.generalFeedback || "";
  var detailNotes = payload.detailNotes || {}; // Map: { indicationNo: "Catatan..." }
  
  var ss = getAppSpreadsheet();
  var sheetHeader = ss.getSheetByName(SHEETS.HEADER);
  var sheetDetail = ss.getSheetByName(SHEETS.DETAIL);
  
  if (!sheetHeader || !sheetDetail) {
    return { success: false, message: "Sheet tidak ditemukan." };
  }
  
  // 1. Update status evaluasi di Data_Header
  var headers = sheetHeader.getDataRange().getValues();
  var updatedHeader = false;
  for (var i = 1; i < headers.length; i++) {
    if (headers[i][0] === submissionId) {
      sheetHeader.getRange(i + 1, 10).setValue("Sudah Dievaluasi"); // Col 10: Status_Evaluasi
      updatedHeader = true;
      break;
    }
  }
  
  // 2. Update Catatan_Penguji di Data_Detail
  var details = sheetDetail.getDataRange().getValues();
  for (var j = 1; j < details.length; j++) {
    if (details[j][0] === submissionId) {
      var indNo = String(details[j][1]);
      var note = detailNotes[indNo] || "";
      // Jika ada general feedback, bisa disematkan di baris pertama jika detail note kosong
      if (j === 1 && generalFeedback && !note) {
        note = generalFeedback;
      } else if (generalFeedback && note) {
        note = note + " | Catatan Umum: " + generalFeedback;
      }
      if (note) {
        sheetDetail.getRange(j + 1, 9).setValue(note); // Col 9: Catatan_Penguji
      }
    }
  }
  
  return {
    success: true,
    message: "Evaluasi dan catatan feedback berhasil disimpan untuk peserta!"
  };
}

// ==========================================================================
// 8. SETUP OTOMATIS STRUKTUR DATABASE (GOOGLE SHEETS)
// ==========================================================================
function setupInitialDatabase() {
  var ss = getAppSpreadsheet();
  
  // 1. Sheet Master_Akun
  var sheetAkun = ss.getSheetByName(SHEETS.AKUN);
  if (!sheetAkun) {
    sheetAkun = ss.insertSheet(SHEETS.AKUN);
    sheetAkun.appendRow(["Role", "ID_Pengguna", "PIN", "Nama"]);
    // Data default instruktur dan peserta contoh
    sheetAkun.appendRow(["Penguji", "INSTRUKTUR01", "1234", "Ir. Bambang Tri, Level III"]);
    sheetAkun.appendRow(["Penguji", "NDT_LEAD", "5678", "Koordinator Laboratorium NDT"]);
    sheetAkun.appendRow(["Peserta", "MHS202401", "", "Ahmad Fauzi"]);
    sheetAkun.appendRow(["Peserta", "MHS202402", "", "Dewi Lestari"]);
    formatHeaderRow(sheetAkun, "#1e3a8a");
  }
  
  // 2. Sheet Data_Header
  var sheetHeader = ss.getSheetByName(SHEETS.HEADER);
  if (!sheetHeader) {
    sheetHeader = ss.insertSheet(SHEETS.HEADER);
    sheetHeader.appendRow([
      "Submission_ID",
      "Role",
      "Nama",
      "Metode",
      "Test_Piece_ID",
      "Dim_Panjang",
      "Dim_Lebar",
      "Status_Benda",
      "Overall_Photo_URL",
      "Status_Evaluasi"
    ]);
    formatHeaderRow(sheetHeader, "#0f766e");
  }
  
  // 3. Sheet Data_Detail
  var sheetDetail = ss.getSheetByName(SHEETS.DETAIL);
  if (!sheetDetail) {
    sheetDetail = ss.insertSheet(SHEETS.DETAIL);
    sheetDetail.appendRow([
      "Submission_ID",
      "Indication_No_Auto",
      "Length",
      "Width",
      "From_Y",
      "Type",
      "Decision",
      "Sketch_Image_URL",
      "Catatan_Penguji"
    ]);
    formatHeaderRow(sheetDetail, "#b45309");
  }
  
  return {
    success: true,
    message: "3 Sheet Database (" + SHEETS.AKUN + ", " + SHEETS.HEADER + ", " + SHEETS.DETAIL + ") berhasil disiapkan!"
  };
}

function formatHeaderRow(sheet, hexColor) {
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  range.setBackground(hexColor)
       .setFontColor("#FFFFFF")
       .setFontWeight("bold")
       .setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}
