/**
 * ==========================================================================
 * SISTEM EVALUASI PRAKTIKUM NDT (MT & PT) - CLIENT SCRIPT
 * Single-Stroke Canvas Engine | Auto-Numbering | Side-by-Side Comparison
 * ==========================================================================
 */

// STATE MANAGEMENT
const AppState = {
  currentUser: null,       // { role: 'Penguji' | 'Peserta', userId, nama }
  activeView: 'login',     // 'login', 'pesertaDashboard', 'pengujiDashboard', 'formInput', 'comparison'
  currentMetode: 'Magnetic Particle',
  overallPhotoBase64: '',
  indications: [],         // Array of indications sorted by From Y
  
  // Single-Stroke Canvas State
  canvas: null,
  ctx: null,
  isDrawing: false,
  isStrokeLocked: false,
  strokePoints: [],
  currentStrokeDataUrl: '',
  
  // Evaluation Comparison State
  activeComparison: null,  // { master, participant }
  
  // Storage Key for Local Mock Mode
  LOCAL_STORAGE_KEY: 'NDT_PRAKTIKUM_LOCAL_DATA_V1'
};

// ==========================================================================
// 1. INISIALISASI APLIKASI
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initLocalMockStorage();
  checkSavedSession();
  setupCanvasEvents();
});

function checkSavedSession() {
  const saved = localStorage.getItem('NDT_CURRENT_USER');
  if (saved) {
    try {
      AppState.currentUser = JSON.parse(saved);
      updateHeaderUserUI();
      if (AppState.currentUser.role.toLowerCase() === 'penguji') {
        navigateTo('pengujiDashboard');
      } else {
        navigateTo('pesertaDashboard');
      }
      return;
    } catch (e) {
      localStorage.removeItem('NDT_CURRENT_USER');
    }
  }
  navigateTo('login');
}

function updateHeaderUserUI() {
  const badge = document.getElementById('userBadgeNav');
  if (!badge) return;
  
  if (AppState.currentUser) {
    badge.classList.remove('d-none');
    document.getElementById('navUserName').textContent = AppState.currentUser.nama || AppState.currentUser.userId;
    document.getElementById('navUserRole').textContent = AppState.currentUser.role;
  } else {
    badge.classList.add('d-none');
  }
}

// ==========================================================================
// 2. NAVIGASI ANTAR LAYAR
// ==========================================================================
function navigateTo(viewName) {
  AppState.activeView = viewName;
  
  // Hide all screens
  const screens = ['loginView', 'pesertaView', 'pengujiView', 'formInputView', 'comparisonModal'];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('d-none');
  });

  if (viewName === 'login') {
    document.getElementById('loginView').classList.remove('d-none');
  } else if (viewName === 'pesertaDashboard') {
    document.getElementById('pesertaView').classList.remove('d-none');
    loadPesertaSubmissions();
  } else if (viewName === 'pengujiDashboard') {
    document.getElementById('pengujiView').classList.remove('d-none');
    loadPengujiSubmissions();
  } else if (viewName === 'formInput') {
    document.getElementById('formInputView').classList.remove('d-none');
    resetUniversalForm();
  }
}

function handleLogout() {
  localStorage.removeItem('NDT_CURRENT_USER');
  AppState.currentUser = null;
  updateHeaderUserUI();
  showToast('Berhasil keluar dari akun.', 'warning');
  navigateTo('login');
}

// ==========================================================================
// 3. AUTENTIKASI (PENGUJI DENGAN PIN, PESERTA TANPA PIN)
// ==========================================================================
function switchLoginRole(role) {
  const tabPeserta = document.getElementById('tabRolePeserta');
  const tabPenguji = document.getElementById('tabRolePenguji');
  const pinGroup = document.getElementById('pinInputGroup');
  const idLabel = document.getElementById('loginIdLabel');
  const idInput = document.getElementById('loginUserId');

  if (role === 'Penguji') {
    tabPenguji.classList.add('active');
    tabPeserta.classList.remove('active');
    pinGroup.classList.remove('d-none');
    idLabel.textContent = 'ID Penguji (Instruktur):';
    idInput.placeholder = 'Misal: INSTRUKTUR01';
  } else {
    tabPeserta.classList.add('active');
    tabPenguji.classList.remove('active');
    pinGroup.classList.add('d-none');
    idLabel.textContent = 'ID Peserta (NIM / No Peserta):';
    idInput.placeholder = 'Misal: MHS202401';
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const isPenguji = document.getElementById('tabRolePenguji').classList.contains('active');
  const role = isPenguji ? 'Penguji' : 'Peserta';
  const userId = document.getElementById('loginUserId').value.trim();
  const pin = document.getElementById('loginPin') ? document.getElementById('loginPin').value.trim() : '';

  if (!userId) {
    showToast('Silakan isi ID Pengguna.', 'error');
    return;
  }

  if (isPenguji && !pin) {
    showToast('PIN Penguji wajib diisi.', 'error');
    return;
  }

  showSpinner('btnLogin', true);

  const payload = { role, userId, pin };

  try {
    const res = await callBackendApi('login', payload);
    showSpinner('btnLogin', false);

    if (res.success) {
      AppState.currentUser = res.user;
      localStorage.setItem('NDT_CURRENT_USER', JSON.stringify(res.user));
      updateHeaderUserUI();
      showToast(`Selamat datang, ${res.user.nama || res.user.userId}!`, 'success');
      
      if (res.user.role.toLowerCase() === 'penguji') {
        navigateTo('pengujiDashboard');
      } else {
        navigateTo('pesertaDashboard');
      }
    } else {
      showToast(res.message || 'Login gagal.', 'error');
    }
  } catch (err) {
    showSpinner('btnLogin', false);
    showToast('Terjadi gangguan koneksi: ' + err.message, 'error');
  }
}

// ==========================================================================
// 4. KANVAS SKETSA BENDA UJI NDT (SINGLE-STROKE LOCKING ENGINE)
// ==========================================================================
/**
 * Menggambar Template Benda Uji Las NDT sesuai persis gambar referensi:
 * - Plat kiri dengan ukuran proporsional
 * - Kotak tab penanda di pojok kiri atas dan kanan atas
 * - Garis las tengah (Upper weld toe, Centerline strip-titik, Lower weld toe)
 * - Tanda Datum "Y" di ujung kiri garis las atas
 * - Potongan bevel las (Double-V groove) di bagian samping kanan!
 */
function drawSpecimenTemplate(ctx, width, height) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Background engineering paper
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Faint technical grid background
  ctx.strokeStyle = "#f1f5f9";
  ctx.lineWidth = 1;
  const gridSize = 20;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Koordinat Benda Uji
  const leftX = 40;
  const plateWidth = width * 0.72; // Plat las utama
  const rightX = leftX + plateWidth;
  const topY = 30;
  const bottomY = height - 30;
  const plateHeight = bottomY - topY;

  // 1. Kotak Luar Plat Utama (Kiri)
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(leftX, topY, plateWidth, plateHeight);

  // 2. Kotak Tab Penanda Pojok Kiri Atas
  const tabW = 46;
  const tabH = 46;
  ctx.lineWidth = 2;
  ctx.strokeRect(leftX + 25, topY + 15, tabW, tabH);

  // 3. Kotak Tab Penanda Pojok Kanan Atas
  ctx.strokeRect(rightX - 25 - tabW, topY + 15, tabW, tabH);

  // 4. Garis Las Horizontal (Weld Seam)
  const centerY = topY + plateHeight * 0.48; // Garis tengah las
  const weldCapHalfHeight = 44; // Lebar daerah las
  const upperToeY = centerY - weldCapHalfHeight;
  const lowerToeY = centerY + weldCapHalfHeight;

  // Garis Las Atas (Upper Toe Line)
  ctx.beginPath();
  ctx.moveTo(leftX, upperToeY);
  ctx.lineTo(rightX, upperToeY);
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Garis Las Bawah (Lower Toe Line)
  ctx.beginPath();
  ctx.moveTo(leftX, lowerToeY);
  ctx.lineTo(rightX, lowerToeY);
  ctx.stroke();

  // Garis Sumbu Tengah (Centerline - Garis Titik-Strip)
  ctx.beginPath();
  ctx.setLineDash([14, 5, 3, 5]); // Dash-dot pattern
  ctx.moveTo(leftX - 20, centerY);
  ctx.lineTo(width - 15, centerY);
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // 5. Huruf / Datum "Y" di ujung kiri garis las atas
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 18px 'Inter', sans-serif";
  ctx.fillText("Y", leftX + 4, upperToeY - 6);

  // 6. Potongan Melintang Bevel Sambungan Las di Samping Kanan (Double-V Groove)
  const bevLeft = rightX + 26;
  const bevWidth = width - bevLeft - 30;
  const bevRight = bevLeft + bevWidth;
  const bevMidX = bevLeft + (bevWidth * 0.45);

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#0f172a";

  // Garis bevel atas & bawah (Double-V butt joint cross-section)
  // Atas
  ctx.moveTo(bevLeft, topY);
  ctx.lineTo(bevRight, topY);
  ctx.lineTo(bevRight, bottomY);
  ctx.lineTo(bevLeft, bottomY);
  
  // Sisi kiri potongan yang memiliki ceruk bevel V ganda
  ctx.lineTo(bevLeft, centerY + weldCapHalfHeight + 10);
  ctx.lineTo(bevMidX, centerY); // Titik temu akar las (root)
  ctx.lineTo(bevLeft, centerY - weldCapHalfHeight - 10);
  ctx.lineTo(bevLeft, topY);
  ctx.stroke();

  // Garis silang bevel V di sisi berlawanan bila ada
  ctx.beginPath();
  ctx.moveTo(bevMidX, centerY);
  ctx.lineTo(bevRight, centerY - weldCapHalfHeight - 10);
  ctx.moveTo(bevMidX, centerY);
  ctx.lineTo(bevRight, centerY + weldCapHalfHeight + 10);
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Watermark referensi
  ctx.fillStyle = "rgba(148, 163, 184, 0.25)";
  ctx.font = "bold 26px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("NDT TEST SPECIMEN", (leftX + rightX) / 2, centerY + 8);
  ctx.font = "600 13px 'Inter', sans-serif";
  ctx.fillText("WELD JOINT (MT / PT)", (leftX + rightX) / 2, centerY + 28);
  ctx.textAlign = "left";

  ctx.restore();
}

function setupCanvasEvents() {
  const canvas = document.getElementById('sketchCanvas');
  if (!canvas) return;
  
  AppState.canvas = canvas;
  AppState.ctx = canvas.getContext('2d');

  // Set internal resolution
  canvas.width = 820;
  canvas.height = 480;

  // Render initial background template
  drawSpecimenTemplate(AppState.ctx, canvas.width, canvas.height);

  // Pointer event listeners (supports Mouse, Touch, & Stylus seamlessly)
  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('pointercancel', handlePointerUp);
}

function getCanvasCoordinates(e) {
  const rect = AppState.canvas.getBoundingClientRect();
  const scaleX = AppState.canvas.width / rect.width;
  const scaleY = AppState.canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

function handlePointerDown(e) {
  // SINGLE-STROKE LOCK CHECK: Jika kanvas sudah terkunci, abaikan tarikan baru!
  if (AppState.isStrokeLocked) {
    showToast('Kanvas terkunci! Tekan "Clear / Ulangi" jika ingin menggambar ulang.', 'warning');
    return;
  }

  AppState.isDrawing = true;
  AppState.strokePoints = [];
  const coords = getCanvasCoordinates(e);
  AppState.strokePoints.push(coords);

  // Redraw template
  drawSpecimenTemplate(AppState.ctx, AppState.canvas.width, AppState.canvas.height);

  // Draw start dot
  AppState.ctx.beginPath();
  AppState.ctx.arc(coords.x, coords.y, 3, 0, Math.PI * 2);
  AppState.ctx.fillStyle = '#dc2626'; // Red indication stroke
  AppState.ctx.fill();
}

function handlePointerMove(e) {
  if (!AppState.isDrawing || AppState.isStrokeLocked) return;
  
  const coords = getCanvasCoordinates(e);
  AppState.strokePoints.push(coords);

  // Render the ongoing stroke
  AppState.ctx.strokeStyle = '#dc2626'; // High-visibility defect indication red
  AppState.ctx.lineWidth = 4.5;
  AppState.ctx.lineCap = 'round';
  AppState.ctx.lineJoin = 'round';

  const pts = AppState.strokePoints;
  if (pts.length > 1) {
    AppState.ctx.beginPath();
    AppState.ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
    AppState.ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    AppState.ctx.stroke();
  }
}

function handlePointerUp(e) {
  if (!AppState.isDrawing) return;
  AppState.isDrawing = false;

  if (AppState.strokePoints.length < 2) {
    // Terlalu pendek atau hanya klik sekilas
    return;
  }

  // ATURAN SINGLE-STROKE: Begitu mouse/jari dilepas, KANVAS TERKUNCI!
  lockStrokeCanvas();
}

function lockStrokeCanvas() {
  AppState.isStrokeLocked = true;
  
  // Simpan hasil sketsa ke base64
  AppState.currentStrokeDataUrl = AppState.canvas.toDataURL('image/png');

  // UI Updates
  const wrapper = document.getElementById('canvasWrapper');
  if (wrapper) wrapper.classList.add('locked');

  const badge = document.getElementById('canvasLockBadge');
  if (badge) {
    badge.classList.add('active');
    badge.innerHTML = `🔒 1 Tarikan Selesai (Terkunci)`;
  }

  // Tampilkan form dimensi setelah goresan terkunci
  const dimForm = document.getElementById('indicationDimensionForm');
  if (dimForm) dimForm.classList.remove('d-none');

  showToast('Sketsa terkunci (1 tarikan selesai). Silakan lengkapi dimensi indikasi.', 'success');
}

function clearAndResetSketchCanvas() {
  AppState.isDrawing = false;
  AppState.isStrokeLocked = false;
  AppState.strokePoints = [];
  AppState.currentStrokeDataUrl = '';

  const wrapper = document.getElementById('canvasWrapper');
  if (wrapper) wrapper.classList.remove('locked');

  const badge = document.getElementById('canvasLockBadge');
  if (badge) {
    badge.classList.remove('active');
    badge.innerHTML = `✏️ Tarik 1 Garis (Single-Stroke)`;
  }

  // Hide form until stroke is drawn
  const dimForm = document.getElementById('indicationDimensionForm');
  if (dimForm) dimForm.classList.add('d-none');

  // Redraw clean template
  drawSpecimenTemplate(AppState.ctx, AppState.canvas.width, AppState.canvas.height);
}

// ==========================================================================
// 5. MODAL INPUT INDIKASI & AUTO-NUMBERING BERDASARKAN FROM Y
// ==========================================================================
function openAddIndicationModal() {
  clearAndResetSketchCanvas();

  // Reset form dimensi
  document.getElementById('indLength').value = '';
  document.getElementById('indWidth').value = '';
  document.getElementById('indFromY').value = '';
  document.getElementById('indType').value = 'Linear';
  document.getElementById('indDecision').value = 'Reject';

  // Tampilkan modal
  document.getElementById('indicationModal').classList.add('active');
}

function closeAddIndicationModal() {
  document.getElementById('indicationModal').classList.remove('active');
}

function saveCurrentIndication() {
  if (!AppState.isStrokeLocked || !AppState.currentStrokeDataUrl) {
    showToast('Anda harus menggambar 1 goresan sketsa terlebih dahulu.', 'warning');
    return;
  }

  const length = parseFloat(document.getElementById('indLength').value);
  const width = parseFloat(document.getElementById('indWidth').value);
  const fromY = parseFloat(document.getElementById('indFromY').value);
  const type = document.getElementById('indType').value;
  const decision = document.getElementById('indDecision').value;

  if (isNaN(length) || length <= 0) {
    showToast('Panjang indikasi (Length) harus berupa angka positif.', 'error');
    return;
  }
  if (isNaN(width) || width <= 0) {
    showToast('Lebar indikasi (Width) harus berupa angka positif.', 'error');
    return;
  }
  if (isNaN(fromY) || fromY < 0) {
    showToast('Jarak dari Kiri (From Y) harus berupa angka valid (>= 0).', 'error');
    return;
  }

  // Simpan indikasi baru
  const newIndication = {
    length: length,
    width: width,
    fromY: fromY,
    type: type,
    decision: decision,
    sketchBase64: AppState.currentStrokeDataUrl
  };

  AppState.indications.push(newIndication);

  // AUTO-NUMBERING (Urut Kiri ke Kanan berdasarkan nilai "From Y" terkecil ke terbesar)
  AppState.indications.sort((a, b) => a.fromY - b.fromY);

  renderIndicationsList();
  closeAddIndicationModal();
  showToast(`Indikasi tersimpan dan diurutkan otomatis berdasarkan From Y!`, 'success');
}

function removeIndication(index) {
  if (confirm(`Hapus indikasi No. ${index + 1}?`)) {
    AppState.indications.splice(index, 1);
    // Re-sort and re-render
    AppState.indications.sort((a, b) => a.fromY - b.fromY);
    renderIndicationsList();
    showToast('Indikasi dihapus.', 'info');
  }
}

function renderIndicationsList() {
  const container = document.getElementById('indicationsListContainer');
  const emptyState = document.getElementById('indicationsEmptyState');
  const countBadge = document.getElementById('indicationsCountBadge');

  if (!container) return;

  if (AppState.indications.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('d-none');
    if (countBadge) countBadge.textContent = '0 Indikasi';
    return;
  }

  if (emptyState) emptyState.classList.add('d-none');
  if (countBadge) countBadge.textContent = `${AppState.indications.length} Indikasi (Urut Kiri ke Kanan)`;

  container.innerHTML = AppState.indications.map((ind, idx) => {
    const autoNo = idx + 1; // Auto-numbered No. 1, 2, 3...
    const decisionColor = ind.decision === 'Reject' ? 'var(--danger)' : 'var(--success)';
    return `
      <div class="indication-item-card">
        <div class="indication-no-badge">#${autoNo}</div>
        <img src="${ind.sketchBase64}" class="indication-thumb" alt="Sketsa Indikasi ${autoNo}" />
        <div class="indication-details">
          <div class="indication-title">${ind.type} (${ind.decision})</div>
          <div class="indication-sub">
            Dim: <b>${ind.length} mm</b> × <b>${ind.width} mm</b> | 
            From Y: <b style="color:var(--primary);">${ind.fromY} mm</b>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-secondary" onclick="removeIndication(${idx})" title="Hapus Indikasi">
          🗑️
        </button>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// 6. FORM UNIVERSAL SUBMISI (MOBILE-FIRST)
// ==========================================================================
function startNewReport() {
  resetUniversalForm();
  navigateTo('formInput');
}

function resetUniversalForm() {
  document.getElementById('reportMetode').value = 'Magnetic Particle';
  document.getElementById('reportTestPieceId').value = 'MTPT 02 B';
  document.getElementById('reportDimPanjang').value = '300';
  document.getElementById('reportDimLebar').value = '200';
  
  const photoInput = document.getElementById('reportOverallPhoto');
  if (photoInput) photoInput.value = '';
  
  // Auto-load template snapshot as initial reference photo
  useTemplateAsOverallPhoto();
  
  AppState.indications = [];
  renderIndicationsList();

  // Khusus Penguji UI toggles
  const pengujiOptions = document.getElementById('pengujiOnlyOptions');
  const isMasterCheck = document.getElementById('chkIsMaster');
  const isZonkCheck = document.getElementById('chkIsZonk');

  if (AppState.currentUser && AppState.currentUser.role.toLowerCase() === 'penguji') {
    if (pengujiOptions) pengujiOptions.classList.remove('d-none');
    if (isMasterCheck) isMasterCheck.checked = true; // default master for penguji
    if (isZonkCheck) isZonkCheck.checked = false;
    updateCheckboxCardStyle('chkIsMaster');
  } else {
    if (pengujiOptions) pengujiOptions.classList.add('d-none');
    if (isMasterCheck) isMasterCheck.checked = false;
    if (isZonkCheck) isZonkCheck.checked = false;
  }
}

function updateCheckboxCardStyle(checkboxId) {
  const chk = document.getElementById(checkboxId);
  if (!chk) return;
  const parent = chk.closest('.checkbox-card');
  if (parent) {
    if (chk.checked) parent.classList.add('checked');
    else parent.classList.remove('checked');
  }
}

function useTemplateAsOverallPhoto() {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 820;
  tempCanvas.height = 480;
  const tCtx = tempCanvas.getContext('2d');
  drawSpecimenTemplate(tCtx, tempCanvas.width, tempCanvas.height);
  
  // Stamp reference tag
  tCtx.fillStyle = '#0284c7';
  tCtx.font = 'bold 16px Inter, sans-serif';
  tCtx.fillText('📷 FOTO ACUAN BENDA UJI', 50, 440);
  
  AppState.overallPhotoBase64 = tempCanvas.toDataURL('image/jpeg', 0.85);
  const previewBox = document.getElementById('overallPhotoPreviewBox');
  if (previewBox) {
    previewBox.innerHTML = `
      <img src="${AppState.overallPhotoBase64}" alt="Foto Acuan Benda Uji" style="max-height:160px; border-radius:6px;" />
    `;
  }
  showToast('Foto acuan spesimen berhasil digunakan.', 'success');
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    // Compress image to save bandwidth and storage
    compressImage(e.target.result, 1024, 0.75, (compressedBase64) => {
      AppState.overallPhotoBase64 = compressedBase64;
      document.getElementById('overallPhotoPreviewBox').innerHTML = `
        <img src="${compressedBase64}" alt="Foto Keseluruhan Benda Uji" style="max-height:160px; border-radius:6px;" />
      `;
      showToast('Foto berhasil dimuat.', 'info');
    });
  };
  reader.readAsDataURL(file);
}

function compressImage(base64, maxDimension, quality, callback) {
  const img = new Image();
  img.src = base64;
  img.onload = function() {
    let w = img.width;
    let h = img.height;
    if (w > maxDimension || h > maxDimension) {
      if (w > h) {
        h = Math.round((h * maxDimension) / w);
        w = maxDimension;
      } else {
        w = Math.round((w * maxDimension) / h);
        h = maxDimension;
      }
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    callback(canvas.toDataURL('image/jpeg', quality));
  };
}

async function handleUniversalFormSubmit(event) {
  event.preventDefault();

  const metode = document.getElementById('reportMetode').value;
  const testPieceId = document.getElementById('reportTestPieceId').value.trim();
  const dimPanjang = parseFloat(document.getElementById('reportDimPanjang').value);
  const dimLebar = parseFloat(document.getElementById('reportDimLebar').value);

  const isPenguji = AppState.currentUser && AppState.currentUser.role.toLowerCase() === 'penguji';
  const isMaster = isPenguji && document.getElementById('chkIsMaster').checked;
  const isZonk = isPenguji && document.getElementById('chkIsZonk').checked;

  if (!testPieceId) {
    showToast('Test Piece ID wajib diisi (misal: MTPT 02 B).', 'error');
    return;
  }
  if (isNaN(dimPanjang) || dimPanjang <= 0) {
    showToast('Dimensi Panjang harus angka positif.', 'error');
    return;
  }
  if (isNaN(dimLebar) || dimLebar <= 0) {
    showToast('Dimensi Lebar harus angka positif.', 'error');
    return;
  }
  
  // Auto-generate overall photo if not uploaded yet
  if (!AppState.overallPhotoBase64) {
    useTemplateAsOverallPhoto();
  }

  // Jika bukan benda uji Zonk, pastikan ada minimal 1 indikasi
  if (!isZonk && AppState.indications.length === 0) {
    if (!confirm('Perhatian: Belum ada indikasi yang ditambahkan. Lanjutkan submisi tanpa indikasi?')) {
      return;
    }
  }

  showSpinner('btnSubmitReport', true);

  const payload = {
    role: AppState.currentUser.role,
    nama: AppState.currentUser.nama || AppState.currentUser.userId,
    metode: metode,
    testPieceId: testPieceId,
    dimPanjang: dimPanjang,
    dimLebar: dimLebar,
    isMaster: isMaster,
    isZonk: isZonk,
    overallPhotoBase64: AppState.overallPhotoBase64,
    indications: AppState.indications
  };

  try {
    const res = await callBackendApi('submitReport', payload);
    showSpinner('btnSubmitReport', false);

    if (res.success) {
      showToast(res.message || 'Laporan berhasil disimpan!', 'success');
      if (isPenguji) {
        navigateTo('pengujiDashboard');
      } else {
        navigateTo('pesertaDashboard');
      }
    } else {
      showToast(res.message || 'Gagal menyimpan laporan.', 'error');
    }
  } catch (err) {
    showSpinner('btnSubmitReport', false);
    showToast('Terjadi kesalahan pengiriman: ' + err.message, 'error');
  }
}

// ==========================================================================
// 7. DASHBOARD RIWAYAT PESERTA (STATUS TRACKING)
// ==========================================================================
async function loadPesertaSubmissions() {
  const container = document.getElementById('pesertaHistoryContainer');
  if (!container) return;

  container.innerHTML = `<div class="text-center p-4 text-muted"><span class="spinner"></span> Memuat riwayat...</div>`;

  try {
    const res = await callBackendApi('getParticipantSubmissions', {
      nama: AppState.currentUser.nama || AppState.currentUser.userId
    });

    if (res.success && res.list && res.list.length > 0) {
      container.innerHTML = res.list.map(item => {
        const isDone = item.statusEvaluasi === 'Sudah Dievaluasi';
        const statusBadge = isDone
          ? `<span class="status-pill status-done">🟢 Sudah Dievaluasi</span>`
          : `<span class="status-pill status-waiting">🟡 Menunggu Evaluasi</span>`;

        const viewNotesBtn = isDone
          ? `<button class="btn btn-sm btn-primary" onclick="openSideBySideReview('${item.submissionId}')">📋 Lihat Catatan</button>`
          : `<button class="btn btn-sm btn-secondary" disabled>Belum Dievaluasi</button>`;

        return `
          <div class="card mb-3">
            <div class="flex-between mb-2">
              <span style="font-weight:700; font-size:16px;">Test Piece: ${item.testPieceId}</span>
              ${statusBadge}
            </div>
            <div style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">
              Metode: <b>${item.metode}</b> | Dimensi: <b>${item.dimPanjang} × ${item.dimLebar} mm</b>
            </div>
            <div class="flex-between">
              <span style="font-size:12px; color:var(--text-light); font-family:monospace;">ID: ${item.submissionId}</span>
              ${viewNotesBtn}
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = `
        <div class="text-center p-4 text-muted card">
          <p>Belum ada laporan praktikum yang dikirim.</p>
          <button class="btn btn-primary mt-2" onclick="startNewReport()">+ Buat Laporan Praktikum Baru</button>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<div class="text-center text-danger p-4">Gagal memuat riwayat: ${err.message}</div>`;
  }
}

// ==========================================================================
// 8. DASHBOARD PENGUJI (DAFTAR SUBMISI PESERTA & MASTER)
// ==========================================================================
async function loadPengujiSubmissions() {
  const container = document.getElementById('pengujiSubmissionsContainer');
  if (!container) return;

  container.innerHTML = `<div class="text-center p-4 text-muted"><span class="spinner"></span> Memuat daftar submisi peserta...</div>`;

  try {
    const res = await callBackendApi('getEvaluatorSubmissions', {});

    if (res.success) {
      const participants = res.participants || [];
      const masters = res.masters || {};

      if (participants.length === 0) {
        container.innerHTML = `
          <div class="text-center p-4 text-muted card">
            <p>Belum ada submisi laporan praktikum dari peserta.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = participants.map(sub => {
        const hasMaster = !!masters[sub.testPieceId];
        const isDone = sub.statusEvaluasi === 'Sudah Dievaluasi';

        const statusBadge = isDone
          ? `<span class="status-pill status-done">🟢 Sudah Dievaluasi</span>`
          : `<span class="status-pill status-waiting">🟡 Menunggu Evaluasi</span>`;

        const masterBadge = hasMaster
          ? `<span class="status-pill status-master">🔑 Master Tersedia</span>`
          : `<span class="status-pill status-zonk">⚠️ Master Belum Dibuat</span>`;

        return `
          <div class="card mb-3">
            <div class="flex-between mb-2">
              <div>
                <span style="font-weight:700; font-size:16px; color:var(--secondary);">${sub.nama}</span>
                <span style="font-size:13px; color:var(--text-muted); margin-left:8px;">(Piece: ${sub.testPieceId})</span>
              </div>
              <div class="gap-2" style="display:flex;">
                ${masterBadge}
                ${statusBadge}
              </div>
            </div>
            <div style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">
              Metode: <b>${sub.metode}</b> | Dimensi: <b>${sub.dimPanjang} × ${sub.dimLebar} mm</b> | Status: <b>${sub.statusBenda}</b>
            </div>
            <div class="flex-between">
              <span style="font-size:12px; color:var(--text-light); font-family:monospace;">${sub.submissionId}</span>
              <button class="btn btn-sm ${isDone ? 'btn-secondary' : 'btn-primary'}" onclick="openSideBySideReview('${sub.submissionId}')">
                🔍 ${isDone ? 'Buka Ulang Komparasi' : 'Evaluasi & Komparasi'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    container.innerHTML = `<div class="text-center text-danger p-4">Gagal memuat submisi: ${err.message}</div>`;
  }
}

// ==========================================================================
// 9. MODUL 2: DASHBOARD KOMPARASI & EVALUASI (DESKTOP-FIRST SIDE-BY-SIDE)
// ==========================================================================
async function openSideBySideReview(submissionId) {
  const modal = document.getElementById('comparisonModal');
  const content = document.getElementById('comparisonContent');
  modal.classList.add('active');
  content.innerHTML = `<div class="text-center p-5 text-muted"><span class="spinner"></span> Menyiapkan data komparasi visual...</div>`;

  try {
    const res = await callBackendApi('getComparisonData', { submissionId });
    if (!res.success) {
      content.innerHTML = `<div class="text-center text-danger p-5">${res.message}</div>`;
      return;
    }

    AppState.activeComparison = res;
    renderComparisonView(res);
  } catch (err) {
    content.innerHTML = `<div class="text-center text-danger p-5">Gagal membuka komparasi: ${err.message}</div>`;
  }
}

function closeComparisonModal() {
  document.getElementById('comparisonModal').classList.remove('active');
}

function renderComparisonView(data) {
  const content = document.getElementById('comparisonContent');
  const isPenguji = AppState.currentUser && AppState.currentUser.role.toLowerCase() === 'penguji';
  const master = data.master;
  const participant = data.participant;

  let masterPhotoHtml = `<div class="text-muted" style="padding:40px 10px; text-align:center;">Tidak ada foto Master / Master belum dibuat</div>`;
  if (master && master.header && master.header.overallPhotoUrl) {
    masterPhotoHtml = `<img src="${master.header.overallPhotoUrl}" alt="Master Overall Photo" />`;
  }

  let participantPhotoHtml = `<div class="text-muted" style="padding:40px 10px; text-align:center;">Tidak ada foto peserta</div>`;
  if (participant && participant.header && participant.header.overallPhotoUrl) {
    participantPhotoHtml = `<img src="${participant.header.overallPhotoUrl}" alt="Participant Overall Photo" />`;
  }

  // Indikasi Master Table Rows
  const masterDetails = (master && master.details) || [];
  const masterRows = masterDetails.length > 0
    ? masterDetails.map(d => `
        <tr>
          <td><b>#${d.indicationNo}</b></td>
          <td>${d.length} × ${d.width}</td>
          <td style="color:var(--primary); font-weight:700;">${d.fromY} mm</td>
          <td>${d.type}</td>
          <td><span style="color:${d.decision === 'Reject' ? 'red' : 'green'}; font-weight:600;">${d.decision}</span></td>
        </tr>
      `).join('')
    : `<tr><td colspan="5" class="text-muted text-center">Tidak ada cacat (Zonk / Normal)</td></tr>`;

  // Indikasi Peserta Table Rows
  const participantDetails = (participant && participant.details) || [];
  const participantRows = participantDetails.length > 0
    ? participantDetails.map(d => `
        <tr>
          <td><b>#${d.indicationNo}</b></td>
          <td>${d.length} × ${d.width}</td>
          <td style="color:var(--primary); font-weight:700;">${d.fromY} mm</td>
          <td>${d.type}</td>
          <td><span style="color:${d.decision === 'Reject' ? 'red' : 'green'}; font-weight:600;">${d.decision}</span></td>
        </tr>
      `).join('')
    : `<tr><td colspan="5" class="text-muted text-center">Peserta tidak melaporkan indikasi</td></tr>`;

  // Side-by-Side Sketsa Indikasi
  const maxIndications = Math.max(masterDetails.length, participantDetails.length);
  let sketchesComparisonHtml = '';

  for (let i = 0; i < maxIndications; i++) {
    const mInd = masterDetails[i];
    const pInd = participantDetails[i];

    sketchesComparisonHtml += `
      <div style="background:#ffffff; border:1px solid var(--border-color); border-radius:8px; padding:12px; margin-bottom:14px;">
        <div style="font-weight:700; font-size:14px; margin-bottom:8px; color:var(--secondary);">
          Perbandingan Indikasi No. ${i + 1}
        </div>
        <div class="comparison-grid">
          <!-- Sisi Kiri: Master -->
          <div>
            <div style="font-size:12px; font-weight:700; color:#7e22ce; margin-bottom:4px;">KUNCI JAWABAN (MASTER)</div>
            ${mInd && mInd.sketchUrl ? `
              <img src="${mInd.sketchUrl}" style="width:100%; border:1px solid #d8b4fe; border-radius:6px;" alt="Master Sketsa ${i+1}"/>
              <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                From Y: <b>${mInd.fromY} mm</b> | Dim: ${mInd.length} × ${mInd.width} mm | ${mInd.type}
              </div>
            ` : `<div style="font-size:12px; color:var(--text-muted); padding:20px; background:#faf5ff; text-align:center;">Tidak ada sketsa master</div>`}
          </div>

          <!-- Sisi Kanan: Peserta -->
          <div>
            <div style="font-size:12px; font-weight:700; color:#059669; margin-bottom:4px;">HASIL PESERTA (${participant.header.nama})</div>
            ${pInd && pInd.sketchUrl ? `
              <img src="${pInd.sketchUrl}" style="width:100%; border:1px solid #86efac; border-radius:6px;" alt="Peserta Sketsa ${i+1}"/>
              <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                From Y: <b>${pInd.fromY} mm</b> | Dim: ${pInd.length} × ${pInd.width} mm | ${pInd.type}
              </div>
            ` : `<div style="font-size:12px; color:var(--text-muted); padding:20px; background:#f0fdf4; text-align:center;">Peserta tidak menggambar sketsa ini</div>`}
          </div>
        </div>
        
        <!-- Input / Display Catatan Per Indikasi -->
        <div style="margin-top:10px;">
          <label style="font-size:12px; font-weight:600; color:var(--text-muted);">
            Catatan Perbaikan Penguji untuk Indikasi No. ${i + 1}:
          </label>
          ${isPenguji ? `
            <input type="text" class="form-control form-control-sm mt-1 detail-feedback-input" 
              data-ind-no="${i + 1}" 
              placeholder="Misal: Arah goresan terbalik, selisih From Y 4mm..." 
              value="${pInd ? (pInd.catatanPenguji || '') : ''}" />
          ` : `
            <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:13px; color:#1e293b; border:1px solid #e2e8f0; margin-top:4px;">
              ${(pInd && pInd.catatanPenguji) ? pInd.catatanPenguji : '<span class="text-muted">Belum ada catatan perbaikan khusus untuk indikasi ini.</span>'}
            </div>
          `}
        </div>
      </div>
    `;
  }

  // Form Evaluasi Khusus Penguji (Tanpa Angka / Skor)
  const evaluationSectionHtml = isPenguji ? `
    <div class="card mt-4" style="background:#fffbeb; border:1.5px solid #fde68a;">
      <h3 style="font-size:16px; font-weight:700; color:#92400e; margin-bottom:8px;">
        📝 Formulir Evaluasi & Umpan Balik Penguji (Tanpa Nilai Angka)
      </h3>
      <p style="font-size:12px; color:#b45309; margin-bottom:14px;">
        Sesuai PRD, Penguji TIDAK memberikan skor/angka. Berikan catatan kualitatif untuk memperbaiki letak pengukuran, arah sketsa, atau ketelitian peserta.
      </p>
      <div class="form-group">
        <label class="form-label">Catatan Perbaikan Umum (Feedback):</label>
        <textarea id="evalGeneralFeedback" class="form-control" rows="3" 
          placeholder="Tuliskan evaluasi menyeluruh terhadap hasil praktikum peserta..."></textarea>
      </div>
      <div style="text-align:right;">
        <button class="btn btn-success" id="btnSaveEval" onclick="submitEvaluation('${participant.header.submissionId}')">
          💾 Simpan Evaluasi & Tandai Selesai
        </button>
      </div>
    </div>
  ` : `
    <div class="card mt-4" style="background:#ecfdf5; border:1.5px solid #a7f3d0;">
      <h3 style="font-size:16px; font-weight:700; color:#065f46; margin-bottom:8px;">
        📋 Status Evaluasi Praktikum
      </h3>
      <p style="font-size:13px; color:#047857;">
        Status: <b>${participant.header.statusEvaluasi}</b>
      </p>
    </div>
  `;

  content.innerHTML = `
    <!-- Header Ringkasan Komparasi -->
    <div style="background:#f8fafc; padding:14px 18px; border-radius:10px; border:1px solid #e2e8f0; margin-bottom:20px;">
      <div class="flex-between">
        <div>
          <h2 style="font-size:18px; font-weight:800; color:var(--secondary);">
            Komparasi Test Piece: ${participant.header.testPieceId}
          </h2>
          <div style="font-size:13px; color:var(--text-muted); margin-top:2px;">
            Metode: <b>${participant.header.metode}</b> | Peserta: <b>${participant.header.nama}</b>
          </div>
        </div>
        <div>
          <span class="status-pill status-done">Komparasi Visual Aktif</span>
        </div>
      </div>
    </div>

    <!-- 1. CROSSCHECK FOTO KESELURUHAN (SIDE-BY-SIDE) -->
    <h3 class="card-title" style="font-size:16px;">1. Crosscheck Foto Keseluruhan Benda Uji</h3>
    <div class="comparison-grid mb-4">
      <div class="col-master">
        <div class="col-header-tag" style="color:#7e22ce;">
          <span>🔑 KUNCI JAWABAN (MASTER)</span>
        </div>
        <div class="photo-preview-box">
          ${masterPhotoHtml}
        </div>
      </div>
      <div class="col-participant">
        <div class="col-header-tag" style="color:#059669;">
          <span>👤 HASIL PESERTA (${participant.header.nama})</span>
        </div>
        <div class="photo-preview-box">
          ${participantPhotoHtml}
        </div>
      </div>
    </div>

    <!-- 2. KOMPARASI TABEL DIMENSI INDIKASI (SIDE-BY-SIDE) -->
    <h3 class="card-title" style="font-size:16px;">2. Komparasi Tabel Dimensi Indikasi (Urut Kiri ke Kanan)</h3>
    <div class="comparison-grid mb-4">
      <div class="col-master">
        <div class="col-header-tag" style="color:#7e22ce;">
          <span>Tabel Indikasi Master</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>P × L (mm)</th>
                <th>From Y</th>
                <th>Tipe</th>
                <th>Keputusan</th>
              </tr>
            </thead>
            <tbody>${masterRows}</tbody>
          </table>
        </div>
      </div>

      <div class="col-participant">
        <div class="col-header-tag" style="color:#059669;">
          <span>Tabel Indikasi Peserta</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>P × L (mm)</th>
                <th>From Y</th>
                <th>Tipe</th>
                <th>Keputusan</th>
              </tr>
            </thead>
            <tbody>${participantRows}</tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 3. KOMPARASI SKETSA (SIDE-BY-SIDE) -->
    <h3 class="card-title" style="font-size:16px;">3. Komparasi Gambar Sketsa Indikasi</h3>
    ${sketchesComparisonHtml}

    <!-- 4. FEEDBACK EVALUATOR -->
    ${evaluationSectionHtml}
  `;
}

async function submitEvaluation(submissionId) {
  const generalFeedback = (document.getElementById('evalGeneralFeedback') || {}).value || '';
  
  // Ambil catatan per indikasi
  const detailNotes = {};
  const inputs = document.querySelectorAll('.detail-feedback-input');
  inputs.forEach(input => {
    const indNo = input.getAttribute('data-ind-no');
    const val = input.value.trim();
    if (val) {
      detailNotes[indNo] = val;
    }
  });

  showSpinner('btnSaveEval', true);

  try {
    const res = await callBackendApi('saveEvaluation', {
      submissionId,
      generalFeedback,
      detailNotes
    });
    showSpinner('btnSaveEval', false);

    if (res.success) {
      showToast('Evaluasi dan catatan feedback berhasil disimpan!', 'success');
      closeComparisonModal();
      loadPengujiSubmissions();
    } else {
      showToast(res.message || 'Gagal menyimpan evaluasi.', 'error');
    }
  } catch (err) {
    showSpinner('btnSaveEval', false);
    showToast('Terjadi kesalahan: ' + err.message, 'error');
  }
}

// ==========================================================================
// 10. BACKEND API CLIENT (DUAL-MODE: NATIVE GAS & LOCAL PREVIEW/MOCK)
// ==========================================================================
async function callBackendApi(action, payload) {
  // 1. Jika berjalan dalam Google Apps Script Web App
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(res => resolve(res))
        .withFailureHandler(err => reject(err))
        [getGasFunctionName(action)](payload);
    });
  }

  // 2. Mode Standalone / Local Mock Simulation
  return runMockBackend(action, payload);
}

function getGasFunctionName(action) {
  const map = {
    login: 'apiLogin',
    submitReport: 'apiSubmitReport',
    getParticipantSubmissions: 'apiGetParticipantSubmissions',
    getEvaluatorSubmissions: 'apiGetEvaluatorSubmissions',
    getComparisonData: 'apiGetComparisonData',
    saveEvaluation: 'apiSaveEvaluation',
    setupDatabase: 'apiSetupInitialDatabase'
  };
  return map[action] || action;
}

// ==========================================================================
// 11. LOCAL MOCK DATABASE (Untuk pengujian interaktif lokal tanpa GAS)
// ==========================================================================
function initLocalMockStorage() {
  if (!localStorage.getItem(AppState.LOCAL_STORAGE_KEY)) {
    const initialData = {
      accounts: [
        { role: 'Penguji', userId: 'INSTRUKTUR01', pin: '1234', nama: 'Ir. Bambang Tri, Level III' },
        { role: 'Penguji', userId: 'NDT_LEAD', pin: '5678', nama: 'Koordinator Lab NDT' },
        { role: 'Peserta', userId: 'MHS202401', pin: '', nama: 'Ahmad Fauzi' },
        { role: 'Peserta', userId: 'MHS202402', pin: '', nama: 'Dewi Lestari' }
      ],
      headers: [],
      details: []
    };

    // Tambahkan 1 Master sample untuk MTPT 02 B
    const sampleMasterSubId = 'MSTR_MTPT02B_INIT';
    initialData.headers.push({
      submissionId: sampleMasterSubId,
      role: 'Penguji',
      nama: 'Ir. Bambang Tri, Level III',
      metode: 'Magnetic Particle',
      testPieceId: 'MTPT 02 B',
      dimPanjang: 300,
      dimLebar: 200,
      statusBenda: 'KUNCI JAWABAN (MASTER)',
      overallPhotoUrl: '',
      statusEvaluasi: 'MASTER_REF'
    });

    initialData.details.push({
      submissionId: sampleMasterSubId,
      indicationNo: 1,
      length: 18,
      width: 2,
      fromY: 65,
      type: 'Linear (Crack)',
      decision: 'Reject',
      sketchUrl: '',
      catatanPenguji: ''
    });

    initialData.details.push({
      submissionId: sampleMasterSubId,
      indicationNo: 2,
      length: 8,
      width: 4,
      fromY: 190,
      type: 'Rounded (Porosity)',
      decision: 'Accept',
      sketchUrl: '',
      catatanPenguji: ''
    });

    localStorage.setItem(AppState.LOCAL_STORAGE_KEY, JSON.stringify(initialData));
  }
}

function runMockBackend(action, payload) {
  const db = JSON.parse(localStorage.getItem(AppState.LOCAL_STORAGE_KEY));

  return new Promise((resolve) => {
    setTimeout(() => {
      if (action === 'login') {
        const { role, userId, pin } = payload;
        const user = db.accounts.find(a => 
          a.userId.toLowerCase() === userId.toLowerCase() && 
          a.role.toLowerCase() === role.toLowerCase()
        );

        if (user) {
          if (role.toLowerCase() === 'penguji' && user.pin !== pin) {
            resolve({ success: false, message: 'PIN Penguji salah.' });
            return;
          }
          resolve({ success: true, user });
          return;
        }

        if (role.toLowerCase() === 'peserta') {
          const newUser = { role: 'Peserta', userId, pin: '', nama: 'Peserta ' + userId };
          db.accounts.push(newUser);
          localStorage.setItem(AppState.LOCAL_STORAGE_KEY, JSON.stringify(db));
          resolve({ success: true, user: newUser });
          return;
        }

        resolve({ success: false, message: 'Akun Penguji tidak ditemukan.' });
      }

      else if (action === 'submitReport') {
        const isMaster = !!payload.isMaster;
        const subId = (isMaster ? 'MSTR_' : 'PST_') + payload.testPieceId.replace(/\s+/g, '') + '_' + Date.now();

        const newHeader = {
          submissionId: subId,
          role: payload.role,
          nama: payload.nama,
          metode: payload.metode,
          testPieceId: payload.testPieceId,
          dimPanjang: payload.dimPanjang,
          dimLebar: payload.dimLebar,
          statusBenda: payload.isZonk ? 'ZONK' : (isMaster ? 'KUNCI JAWABAN (MASTER)' : 'Normal'),
          overallPhotoUrl: payload.overallPhotoBase64,
          statusEvaluasi: isMaster ? 'MASTER_REF' : 'Menunggu Evaluasi'
        };

        db.headers.push(newHeader);

        // Sort by From Y and insert details
        const sortedInds = [...(payload.indications || [])].sort((a, b) => a.fromY - b.fromY);
        sortedInds.forEach((ind, i) => {
          db.details.push({
            submissionId: subId,
            indicationNo: i + 1,
            length: ind.length,
            width: ind.width,
            fromY: ind.fromY,
            type: ind.type,
            decision: ind.decision,
            sketchUrl: ind.sketchBase64,
            catatanPenguji: ''
          });
        });

        localStorage.setItem(AppState.LOCAL_STORAGE_KEY, JSON.stringify(db));
        resolve({
          success: true,
          submissionId: subId,
          message: isMaster ? 'Kunci Jawaban Master berhasil disimpan!' : 'Laporan praktikum berhasil dikirim!'
        });
      }

      else if (action === 'getParticipantSubmissions') {
        const list = db.headers
          .filter(h => h.role.toLowerCase() === 'peserta' && (!payload.nama || h.nama.toLowerCase() === payload.nama.toLowerCase()))
          .reverse();
        resolve({ success: true, list });
      }

      else if (action === 'getEvaluatorSubmissions') {
        const participants = [];
        const masters = {};
        db.headers.forEach(h => {
          if (h.role.toLowerCase() === 'penguji' || (h.statusBenda && h.statusBenda.includes('MASTER'))) {
            masters[h.testPieceId] = h;
          } else {
            participants.push(h);
          }
        });
        resolve({ success: true, participants: participants.reverse(), masters });
      }

      else if (action === 'getComparisonData') {
        const participantHeader = db.headers.find(h => h.submissionId === payload.submissionId);
        if (!participantHeader) {
          resolve({ success: false, message: 'Submisi tidak ditemukan.' });
          return;
        }

        const masterHeader = db.headers.find(h => 
          h.testPieceId.toUpperCase() === participantHeader.testPieceId.toUpperCase() &&
          (h.role.toLowerCase() === 'penguji' || (h.statusBenda && h.statusBenda.includes('MASTER')))
        );

        const participantDetails = db.details.filter(d => d.submissionId === participantHeader.submissionId);
        const masterDetails = masterHeader ? db.details.filter(d => d.submissionId === masterHeader.submissionId) : [];

        resolve({
          success: true,
          participant: { header: participantHeader, details: participantDetails },
          master: masterHeader ? { header: masterHeader, details: masterDetails } : null
        });
      }

      else if (action === 'saveEvaluation') {
        const header = db.headers.find(h => h.submissionId === payload.submissionId);
        if (header) {
          header.statusEvaluasi = 'Sudah Dievaluasi';
        }

        db.details.forEach(d => {
          if (d.submissionId === payload.submissionId) {
            const note = payload.detailNotes[String(d.indicationNo)];
            if (note) d.catatanPenguji = note;
            if (payload.generalFeedback) {
              d.catatanPenguji = (d.catatanPenguji ? d.catatanPenguji + ' | ' : '') + payload.generalFeedback;
            }
          }
        });

        localStorage.setItem(AppState.LOCAL_STORAGE_KEY, JSON.stringify(db));
        resolve({ success: true, message: 'Evaluasi berhasil disimpan!' });
      }

      else {
        resolve({ success: false, message: 'Mock action unknown' });
      }
    }, 250);
  });
}

// ==========================================================================
// 12. UTILITY UI HELPERS (TOAST & SPINNER)
// ==========================================================================
function showToast(message, type = 'info') {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast-box';
    document.body.appendChild(toast);
  }

  toast.className = `toast-box toast-${type} show`;
  const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : 'ℹ️'));
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function showSpinner(btnId, show) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  if (show) {
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span> Memproses...`;
    btn.disabled = true;
  } else {
    if (btn.dataset.originalHtml) {
      btn.innerHTML = btn.dataset.originalHtml;
    }
    btn.disabled = false;
  }
}
