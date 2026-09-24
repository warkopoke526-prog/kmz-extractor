const $ = (id) => document.getElementById(id);

const dropzone = $('dropzone');
const fileInput = $('fileInput');
const browseBtn = $('browseBtn');
const resetBtn = $('resetBtn');
const fileInfo = $('fileInfo');
const progressSection = $('progressSection');
const progressBar = $('progressBar');
const progressLabel = $('progressLabel');
const progressPercent = $('progressPercent');
const summarySection = $('summarySection');
const previewSection = $('previewSection');
const errorSection = $('errorSection');
const previewTable = $('previewTable');
const exportBtn = $('exportBtn');
const ruleInput = $('ruleInput');
const addRuleBtn = $('addRuleBtn');
const ruleList = $('ruleList');
const themeToggleBtn = $('themeToggleBtn');
const tableControlsBar = $('tableControlsBar');
const tableTypeFilter = $('tableTypeFilter');
const tableStatusFilter = $('tableStatusFilter');
const tableSearchInput = $('tableSearchInput');
const tableSearchBox = $('tableSearchBox');
const clearSearchBtn = $('clearSearchBtn');
const colToggleWrapper = $('colToggleWrapper');
const colToggleBtn = $('colToggleBtn');
const colToggleMenu = $('colToggleMenu');
const colChecklist = $('colChecklist');
const colCountBadge = $('colCountBadge');
const colSelectAllBtn = $('colSelectAllBtn');
const colSelectEssentialBtn = $('colSelectEssentialBtn');
const colHideRawBtn = $('colHideRawBtn');
const tableFooterInfo = $('tableFooterInfo');
const tabReviewBadge = $('tabReviewBadge');
const rulesCountBadge = $('rulesCountBadge');
const tablePreviewWrap = $('tablePreviewWrap');
const mapPreviewWrap = $('mapPreviewWrap');
const mapBasemapSelect = $('mapBasemapSelect');
const mapFitBoundsBtn = $('mapFitBoundsBtn');
const mapStatsInfo = $('mapStatsInfo');
const floatingActionBar = $('floatingActionBar');
const floatingTabBadge = $('floatingTabBadge');
const floatingCount = $('floatingCount');
const floatingSearchBtn = $('floatingSearchBtn');
const floatingTopBtn = $('floatingTopBtn');
const floatingExportBtn = $('floatingExportBtn');
const tableWrap = document.querySelector('.table-wrap');

const CLASS_OPTIONS = [
  'POLE', 'DPFO', 'HOME_PASS', 'NON_COVERAGE_HOME_PASS',
  'COVERAGE_HP_AREA', 'COVERAGE_SP_AREA', 'CABLE', 'JOINTBOX', 'BOUNDARY',
  'OTHER'
];
const STATUS_OPTIONS = ['NEW', 'EXISTING', 'COVERAGE', 'NON_COVERAGE', 'UNKNOWN'];

const DEFAULT_RULES = [
  { type: 'BOUNDARY', keywords: ['boundary', 'batas', 'area boundary'] },
  { type: 'POLE', keywords: ['pole', 'tiang', 'np7s', 'np7', 'np9'] },
  { type: 'DPFO', keywords: ['dpfo', 'drop fiber', 'distribution fiber'] },
  { type: 'NON_COVERAGE_HOME_PASS', keywords: ['non coverage homepass', 'non coverage hp', 'noncoverage homepass', 'non-covered homepass'] },
  { type: 'COVERAGE_HP_AREA', keywords: ['coverage hp', 'coverage homepass', 'coverage home pass'] },
  { type: 'COVERAGE_SP_AREA', keywords: ['coverage sp', 'coverage splitter', 'coverage split'] },
  { type: 'HOME_PASS', keywords: ['homepass', 'home pass', 'home-pass', 'hp'] },
  { type: 'CABLE', keywords: ['cable', 'fiber', 'fibre', 'fo ', 'fo cable', 'fiber optic'] },
  { type: 'JOINTBOX', keywords: ['jointbox', 'joint box', 'jb', 'njb', 'jc.'] }
];

const PREFERRED_ITEM_KEYS = [
  'normalized_type', 'normalized_subtype', 'network_status', 'asset_id', 'name',
  'cable_core_count', 'cable_length_m', 'folder', 'longitude', 'latitude',
  'altitude', 'item_type', 'geometry_type', 'coordinate_count', 'mapping_confidence',
  'mapping_reason', 'needs_review', 'source_file', 'item_id', 'parent_id',
  'visibility', 'style_url', 'description', 'snippet', 'time_when', 'time_begin', 'time_end'
];

const RAW_METADATA_COLS = new Set([
  'visibility', 'style_url', 'description', 'snippet', 'time_when', 'time_begin', 'time_end',
  'parent_id', 'source_file', 'item_id', 'altitude', 'Visibility', 'Style URL',
  'Description', 'Snippet', 'Time When', 'Time Begin', 'Time End', 'Parent ID',
  'Source File', 'Item ID', 'Altitude', 'coordinate_count', 'Coordinates Count'
]);

const ESSENTIAL_COLS = new Set([
  'normalized_type', 'normalized_subtype', 'network_status', 'asset_id', 'name',
  'cable_core_count', 'cable_length_m', 'folder', 'longitude', 'latitude', 'needs_review',
  'No', 'Normalized Type', 'Subtype / Spec', 'Network Status', 'Asset ID', 'Name',
  'Cable Core', 'Cable Length (m)', 'Folder Path', 'Longitude', 'Latitude', 'Needs Review',
  'Kategori Aset', 'Spesifikasi / Subtype', 'Status Jaringan', 'Jumlah Aset', 'Satuan',
  'Total Panjang Kabel (Meter)', 'Keterangan',
  'item_name', 'vertex_no', 'part', 'key', 'value', 'type'
]);

const state = {
  result: null,
  activeTab: 'items',
  fileName: '',
  searchQuery: '',
  typeFilter: '',
  statusFilter: '',
  hiddenColumns: new Set(),
  currentHeaders: [],
  activeHeadersKey: '',
  customRules: loadRules(),
};

let mapInstance = null;
let currentTileLayer = null;
let mapLayerGroups = {};
let mapRendered = false;

// Theme toggle
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kmz-theme', next);
    if (mapBasemapSelect && mapBasemapSelect.value === 'auto') {
      updateBasemap();
    }
  });
}

// Search input
if (tableSearchInput) {
  tableSearchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    if (clearSearchBtn) {
      if (e.target.value.length > 0) clearSearchBtn.classList.remove('hidden');
      else clearSearchBtn.classList.add('hidden');
    }
    renderPreview();
  });
}

// Clear search button
if (clearSearchBtn) {
  clearSearchBtn.addEventListener('click', () => {
    state.searchQuery = '';
    tableSearchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    tableSearchInput.focus();
    renderPreview();
  });
}

// Table Type filter
if (tableTypeFilter) {
  tableTypeFilter.addEventListener('change', (e) => {
    state.typeFilter = e.target.value;
    renderPreview();
  });
}

// Table Status filter
if (tableStatusFilter) {
  tableStatusFilter.addEventListener('change', (e) => {
    state.statusFilter = e.target.value;
    renderPreview();
  });
}

// Column Visibility Toggle Dropdown
if (colToggleBtn) {
  colToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (colToggleMenu) colToggleMenu.classList.toggle('hidden');
  });
}

if (colToggleMenu) {
  colToggleMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

document.addEventListener('click', (e) => {
  if (colToggleWrapper && !colToggleWrapper.contains(e.target)) {
    if (colToggleMenu) colToggleMenu.classList.add('hidden');
  }
});

// Quick Column Select Buttons
if (colSelectAllBtn) {
  colSelectAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    state.hiddenColumns.clear();
    if (state.currentHeaders && state.currentHeaders.length) {
      syncColumnChecklist(state.currentHeaders);
      updateColBadge(state.currentHeaders);
    }
    renderPreview();
  });
}

if (colSelectEssentialBtn) {
  colSelectEssentialBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (state.currentHeaders && state.currentHeaders.length) {
      state.currentHeaders.forEach(h => {
        if (ESSENTIAL_COLS.has(h)) {
          state.hiddenColumns.delete(h);
        } else {
          state.hiddenColumns.add(h);
        }
      });
      syncColumnChecklist(state.currentHeaders);
      updateColBadge(state.currentHeaders);
      renderPreview();
    }
  });
}

if (colHideRawBtn) {
  colHideRawBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (state.currentHeaders && state.currentHeaders.length) {
      state.currentHeaders.forEach(h => {
        if (RAW_METADATA_COLS.has(h)) {
          state.hiddenColumns.add(h);
        }
      });
      syncColumnChecklist(state.currentHeaders);
      updateColBadge(state.currentHeaders);
      renderPreview();
    }
  });
}

// Floating Action Bar System
const TAB_LABELS = {
  items: 'All Items',
  boq: 'BOQ Summary',
  review: 'Review',
  coords: 'Coordinates',
  extended: 'ExtendedData',
  map: 'Map'
};

function checkFloatingBarVisibility() {
  if (!floatingActionBar || !state.result || state.activeTab === 'map') {
    if (floatingActionBar) floatingActionBar.classList.remove('visible');
    return;
  }

  const tableScrolled = tableWrap && tableWrap.scrollTop > 70;
  const pageScrolled = window.scrollY > 280;

  if (tableScrolled || pageScrolled) {
    floatingActionBar.classList.remove('hidden');
    floatingActionBar.classList.add('visible');
  } else {
    floatingActionBar.classList.remove('visible');
  }
}

window.addEventListener('scroll', checkFloatingBarVisibility, { passive: true });
if (tableWrap) {
  tableWrap.addEventListener('scroll', checkFloatingBarVisibility, { passive: true });
}

if (floatingExportBtn) {
  floatingExportBtn.addEventListener('click', exportExcel);
}

if (floatingTopBtn) {
  floatingTopBtn.addEventListener('click', () => {
    if (tableWrap) {
      tableWrap.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (window.scrollY > 260 && previewSection) {
      previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

if (floatingSearchBtn) {
  floatingSearchBtn.addEventListener('click', () => {
    if (tableSearchInput) {
      tableSearchInput.focus();
      if (tableControlsBar) {
        tableControlsBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}

// Reset button
if (resetBtn) {
  resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.value = '';
    state.result = null;
    state.fileName = '';
    state.searchQuery = '';
    state.typeFilter = '';
    state.statusFilter = '';
    state.hiddenColumns.clear();
    state.currentHeaders = [];
    state.activeHeadersKey = '';
    mapRendered = false;
    if (tableSearchInput) tableSearchInput.value = '';
    if (tableTypeFilter) tableTypeFilter.value = '';
    if (tableStatusFilter) tableStatusFilter.value = '';
    if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
    if (colToggleMenu) colToggleMenu.classList.add('hidden');
    if (colCountBadge) colCountBadge.textContent = 'Semua';
    if (floatingActionBar) {
      floatingActionBar.classList.remove('visible');
      floatingActionBar.classList.add('hidden');
    }
    fileInfo.classList.add('hidden');
    resetBtn.classList.add('hidden');
    browseBtn.classList.remove('hidden');
    previewSection.classList.add('hidden');
    summarySection.classList.add('hidden');
    progressSection.classList.add('hidden');
    clearError();
  });
}

browseBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
fileInput.addEventListener('change', (e) => { if (e.target.files[0]) processFile(e.target.files[0]); });
['dragenter', 'dragover'].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.add('dragover'); }));
['dragleave', 'drop'].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.remove('dragover'); }));
dropzone.addEventListener('drop', e => { const file = e.dataTransfer.files[0]; if (file) processFile(file); });

document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  state.activeTab = btn.dataset.tab;
  renderPreview();
}));
exportBtn.addEventListener('click', exportExcel);
addRuleBtn.addEventListener('click', addCustomRule);

function setProgress(pct, label) {
  progressBar.style.width = `${pct}%`;
  progressPercent.textContent = `${pct}%`;
  progressLabel.textContent = label;
}

function showError(message) {
  errorSection.textContent = message;
  errorSection.classList.remove('hidden');
}
function clearError() { errorSection.classList.add('hidden'); errorSection.textContent = ''; }

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\-/.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactText(value) {
  return normalizeText(value).replace(/\s+/g, '');
}

function loadRules() {
  try {
    const saved = JSON.parse(localStorage.getItem('kmz-semantic-rules') || '[]');
    return Array.isArray(saved) ? saved.filter(x => x && x.type && Array.isArray(x.keywords)) : [];
  } catch (_) { return []; }
}

function saveRules() {
  localStorage.setItem('kmz-semantic-rules', JSON.stringify(state.customRules));
  renderRuleList();
}

function addCustomRule() {
  const raw = ruleInput.value.trim();
  if (!raw) return;
  const parts = raw.split('=>').map(s => s.trim());
  if (parts.length !== 2) {
    showError('Format aturan: KEYWORD => TIPE. Contoh: tiang baru => POLE');
    return;
  }
  const keyword = parts[0];
  const type = parts[1].toUpperCase();
  if (!CLASS_OPTIONS.includes(type)) {
    showError(`Tipe harus salah satu dari: ${CLASS_OPTIONS.join(', ')}`);
    return;
  }
  const existing = state.customRules.find(r => r.type === type);
  if (existing) existing.keywords.push(keyword);
  else state.customRules.push({ type, keywords: [keyword] });
  ruleInput.value = '';
  clearError();
  saveRules();
  if (state.result) {
    state.result = reclassifyResult(state.result);
    updateSummary(state.result);
    renderPreview();
  }
}

function renderRuleList() {
  if (!ruleList) return;
  const totalCount = DEFAULT_RULES.length + state.customRules.length;
  if (rulesCountBadge) {
    rulesCountBadge.textContent = state.customRules.length ? `${totalCount} Rule (${state.customRules.length} Custom)` : `${totalCount} Default`;
  }
  const rows = [];
  [...DEFAULT_RULES, ...state.customRules].forEach((rule, idx) => {
    rows.push(`<span class="rule-chip"><b>${escapeHtml(rule.type)}</b> · ${escapeHtml(rule.keywords.join(', '))}${idx >= DEFAULT_RULES.length ? ` <button class="chip-x" data-rule="${idx - DEFAULT_RULES.length}">×</button>` : ''}</span>`);
  });
  ruleList.innerHTML = rows.join('');
  ruleList.querySelectorAll('[data-rule]').forEach(btn => btn.addEventListener('click', () => {
    const i = Number(btn.dataset.rule);
    state.customRules.splice(i, 1);
    saveRules();
    if (state.result) {
      state.result = reclassifyResult(state.result);
      updateSummary(state.result);
      renderPreview();
    }
  }));
}

async function processFile(file) {
  clearError();
  previewSection.classList.add('hidden');
  summarySection.classList.add('hidden');
  progressSection.classList.remove('hidden');
  fileInfo.classList.remove('hidden');
  fileInfo.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
  if (resetBtn) resetBtn.classList.remove('hidden');
  if (browseBtn) browseBtn.classList.add('hidden');
  state.fileName = file.name;
  mapRendered = false;

  try {
    setProgress(5, 'Membaca file…');
    const buffer = await file.arrayBuffer();
    let kmlTexts = [];

    if (/\.kmz$/i.test(file.name)) {
      setProgress(12, 'Membuka arsip KMZ…');
      const zip = await JSZip.loadAsync(buffer);
      const names = Object.keys(zip.files)
        .filter(n => /\.kml$/i.test(n) && !zip.files[n].dir)
        .sort((a, b) => a.localeCompare(b));
      if (!names.length) throw new Error('Tidak ditemukan file KML di dalam KMZ.');
      for (let i = 0; i < names.length; i++) {
        setProgress(12 + Math.round((i / names.length) * 28), `Membaca KML ${i + 1}/${names.length}…`);
        kmlTexts.push({ path: names[i], text: await zip.files[names[i]].async('text') });
      }
    } else if (/\.kml$/i.test(file.name)) {
      kmlTexts = [{ path: file.name, text: new TextDecoder('utf-8').decode(buffer) }];
    } else {
      throw new Error('Format tidak didukung. Pilih file .KMZ atau .KML.');
    }

    setProgress(50, 'Mengurai struktur KML…');
    const result = parseKmlFiles(kmlTexts);
    state.result = result;

    setProgress(88, 'Menyiapkan preview & semantic mapping…');
    updateSummary(result);
    renderPreview();
    previewSection.classList.remove('hidden');
    summarySection.classList.remove('hidden');
    setProgress(100, `Selesai · ${result.items.length.toLocaleString('id-ID')} item`);
  } catch (err) {
    console.error(err);
    showError(`Gagal memproses file: ${err.message || err}`);
    setProgress(0, 'Gagal');
  }
}

function parseKmlFiles(files) {
  const items = [];
  const coords = [];
  const extended = [];
  const seen = new Set();

  files.forEach(({ path, text }) => {
    const xml = new DOMParser().parseFromString(text, 'application/xml');
    const parserError = xml.querySelector('parsererror');
    if (parserError) throw new Error(`KML tidak valid: ${path}`);
    const root = xml.documentElement;

    const walk = (node, context) => {
      const local = localName(node);
      const name = directText(node, 'name');
      let next = { ...context };
      if (local === 'Document' || local === 'Folder') {
        if (name) next.pathParts = [...context.pathParts, name];
      }

      const isFeature = ['Document', 'Folder', 'Placemark', 'GroundOverlay', 'PhotoOverlay', 'ScreenOverlay', 'NetworkLink'].includes(local);
      let currentId = context.parentId;
      if (isFeature) {
        const id = node.getAttribute('id') || '';
        const pathParts = next.pathParts;
        const folderPath = pathParts.join(' / ');
        const geo = local === 'Placemark' ? extractGeometry(node) : { type: '', coordinates: [] };
        const explicitExtended = extractExtendedData(node);
        const rawKey = `${path}::${id}::${local}::${name}::${folderPath}::${items.length}`;
        if (!seen.has(rawKey)) {
          seen.add(rawKey);
          currentId = id || `${path}-row-${items.length + 1}`;
          const base = {
            source_file: path,
            item_id: currentId,
            item_type: local,
            name,
            folder: folderPath,
            parent_id: context.parentId,
            geometry_type: geo.type,
            longitude: geo.coordinates[0]?.lon ?? '',
            latitude: geo.coordinates[0]?.lat ?? '',
            altitude: geo.coordinates[0]?.alt ?? '',
            coordinate_count: geo.coordinates.length,
            visibility: directText(node, 'visibility'),
            style_url: directText(node, 'styleUrl'),
            address: directText(node, 'address'),
            description: stripHtml(directText(node, 'description')),
            snippet: directText(node, 'Snippet') || directText(node, 'snippet'),
            time_when: findNestedText(node, 'when'),
            time_begin: findNestedText(node, 'begin'),
            time_end: findNestedText(node, 'end'),
          };
          const semantic = classifyFeature(base, pathParts);
          const item = { ...base, ...semantic };
          items.push(item);

          geo.coordinates.forEach((c, idx) => coords.push({
            item_id: currentId,
            item_name: name,
            source_file: path,
            normalized_type: item.normalized_type,
            geometry_type: geo.type,
            vertex_no: idx + 1,
            part: c.part,
            longitude: c.lon,
            latitude: c.lat,
            altitude: c.alt,
          }));

          explicitExtended.forEach(e => extended.push({
            item_id: currentId,
            item_name: name,
            source_file: path,
            normalized_type: item.normalized_type,
            key: e.key,
            value: e.value,
            type: e.type,
          }));
        }
      }

      [...node.children].forEach(child => walk(child, {
        pathParts: next.pathParts,
        parentId: currentId,
      }));
    };

    walk(root, { pathParts: [], parentId: '' });
  });

  return { items, coords, extended };
}

function reclassifyResult(result) {
  const items = result.items.map(item => ({
    ...item,
    ...classifyFeature(item, item.folder ? item.folder.split(' / ') : []),
  }));
  const typeById = new Map(items.map(x => [x.item_id, x.normalized_type]));
  const coords = result.coords.map(c => ({ ...c, normalized_type: typeById.get(c.item_id) || c.normalized_type }));
  const extended = result.extended.map(e => ({ ...e, normalized_type: typeById.get(e.item_id) || e.normalized_type }));
  return { items, coords, extended };
}

function inferSubtype(item, pathParts, normalized_type) {
  const path = normalizeText(pathParts.join(' / '));
  const name = String(item.name || '').trim();
  if (normalized_type === 'POLE') {
    if (/np\s*7s/i.test(path) || /^np\s*7s$/i.test(name)) return 'NP7S';
    if (/np\s*7/i.test(path) || /^np\s*7$/i.test(name)) return 'NP7';
    if (/np\s*9/i.test(path) || /^np\s*9$/i.test(name)) return 'NP9';
    if (/existing/i.test(path) || /^ext[. ]?pole$/i.test(name)) return 'EXISTING_POLE';
  }
  if (normalized_type === 'DPFO') {
    const m = path.match(/\bm\s*(\d{1,2})\b/);
    if (m) return `M${String(Number(m[1])).padStart(2, '0')}`;
    const n = name.match(/^m\s*(\d{1,2})s\s*(\d{1,2})$/i);
    if (n) return `M${String(Number(n[1])).padStart(2, '0')}`;
  }
  if (normalized_type === 'HOME_PASS') {
    if (/^nn[- ]?\d+/i.test(name)) return 'NN';
    return 'NAMED_SITE';
  }
  if (normalized_type === 'NON_COVERAGE_HOME_PASS') {
    return 'NON_COVERAGE';
  }
  if (normalized_type === 'JOINTBOX') {
    if (/njb\.(\d+)c/i.test(name)) return `NJB_${name.match(/njb\.(\d+)c/i)[1]}C`;
    if (/jc[.]?ext/i.test(name)) return 'EXISTING_JOINTBOX';
  }
  if (normalized_type === 'CABLE') {
    const m = name.match(/(\d+)c/i); if (m) return `${m[1]}C`;
  }
  if (normalized_type === 'BOUNDARY') return 'AREA';
  if (normalized_type === 'COVERAGE_HP_AREA') return 'HP_COVERAGE';
  if (normalized_type === 'COVERAGE_SP_AREA') return 'SP_COVERAGE';
  return '';
}

function extractEngineeringFields(item, normalized_type) {
  const name = String(item.name || '');
  const cableCore = (name.match(/(\d+)\s*C\b/i) || [,''])[1];
  const lengthM = (name.match(/(\d+)\s*m\b/i) || [,''])[1];
  const assetId = name.trim();
  return {
    asset_id: assetId,
    cable_core_count: normalized_type === 'CABLE' ? cableCore : '',
    cable_length_m: normalized_type === 'CABLE' && lengthM ? Number(lengthM) : '',
  };
}

function classifyFeature(item, pathParts) {
  const normalizedPath = pathParts.map(normalizeText);
  const pathText = normalizeText(pathParts.join(' '));
  const name = normalizeText(item.name);
  const compact = compactText(`${pathText} ${name}`);
  const rawUpper = `${item.folder} / ${item.name}`.toUpperCase();

  let normalized_type = '';
  let mapping_reason = '';
  let mapping_confidence = 0;

  // 1) Strong parent-folder semantics.
  if (hasAny(pathText, ['non coverage homepass', 'non coverage hp', 'noncovered homepass', 'non covered homepass'])) {
    normalized_type = 'NON_COVERAGE_HOME_PASS'; mapping_reason = 'parent folder indicates non-coverage homepass'; mapping_confidence = 100;
  } else if (hasAny(pathText, ['coverage hp', 'coverage homepass', 'coverage home pass'])) {
    normalized_type = 'COVERAGE_HP_AREA'; mapping_reason = 'parent folder indicates HP coverage'; mapping_confidence = 100;
  } else if (hasAny(pathText, ['coverage sp', 'coverage splitter'])) {
    normalized_type = 'COVERAGE_SP_AREA'; mapping_reason = 'parent folder indicates SP coverage'; mapping_confidence = 100;
  } else if (hasAny(pathText, ['boundary', 'batas'])) {
    normalized_type = 'BOUNDARY'; mapping_reason = 'parent folder indicates boundary'; mapping_confidence = 100;
  } else if (hasAny(pathText, ['jointbox', 'joint box'])) {
    normalized_type = 'JOINTBOX'; mapping_reason = 'parent folder indicates jointbox'; mapping_confidence = 100;
  } else if (hasAny(pathText, ['dpfo', 'drop fiber', 'distribution fiber'])) {
    normalized_type = 'DPFO'; mapping_reason = 'parent folder indicates DPFO'; mapping_confidence = 100;
  } else if (hasAny(pathText, ['cable', 'fiber optic', 'fiber', 'fibre'])) {
    normalized_type = 'CABLE'; mapping_reason = 'parent folder indicates cable/fiber'; mapping_confidence = 100;
  } else if (hasAny(pathText, ['pole', 'tiang'])) {
    normalized_type = 'POLE'; mapping_reason = 'parent folder indicates pole/tiang'; mapping_confidence = 100;
  }

  // 2) Name patterns if parent semantics did not decide it.
  if (!normalized_type && item.item_type === 'Placemark') {
    const nameChecks = [
      ['CABLE', ['fo cable', 'fiber optic', 'fiber cable', ' kabel ', 'cable '], 95],
      ['JOINTBOX', ['jointbox', 'joint box', 'njb', 'jc ext', 'jc.'], 95],
      ['DPFO', ['dpfo'], 95],
      ['POLE', ['np7s', 'np7', 'np9', 'pole', 'tiang'], 92],
      ['HOME_PASS', ['homepass', 'home pass', 'home-pass'], 90],
      ['COVERAGE_SP_AREA', ['coverage sp'], 90],
      ['COVERAGE_HP_AREA', ['coverage hp'], 90],
    ];
    for (const [type, terms, score] of nameChecks) {
      if (terms.some(t => compact.includes(compactText(t)))) {
        normalized_type = type;
        mapping_reason = `name pattern matched: ${terms.find(t => compact.includes(compactText(t)))}`;
        mapping_confidence = score;
        break;
      }
    }
  }

  // 3) Geometry-assisted hints.
  if (!normalized_type && item.item_type === 'Placemark') {
    if (item.geometry_type === 'LineString' || item.geometry_type === 'MultiGeometry') {
      if (/(\bfo\b|cable|fiber|fibre)/.test(name)) {
        normalized_type = 'CABLE'; mapping_reason = 'line geometry + cable/fiber name'; mapping_confidence = 86;
      }
    }
    if (!normalized_type && item.geometry_type === 'Point') {
      if (/^m\d{1,2}s\d{1,2}$/i.test(item.name.trim())) {
        normalized_type = 'DPFO'; mapping_reason = 'MxxSx naming pattern on point'; mapping_confidence = 84;
      }
      if (/^nn[- ]?\d+/i.test(item.name.trim())) {
        normalized_type = 'HOME_PASS'; mapping_reason = 'NN-xxxxx naming pattern'; mapping_confidence = 82;
      }
    }
  }

  // 4) Local custom rules (higher priority than low-confidence fallback).
  if (item.item_type === 'Placemark') {
    const customMatch = findCustomRule(`${item.folder} ${item.name}`);
    if (customMatch) {
      normalized_type = customMatch.type;
      mapping_reason = `custom rule matched: ${customMatch.keyword}`;
      mapping_confidence = 100;
    }
  }

  if (!normalized_type) {
    normalized_type = item.item_type === 'Folder' ? 'OTHER' : 'OTHER';
    mapping_reason = 'no semantic rule matched';
    mapping_confidence = 20;
  }

  let network_status = inferStatus(pathParts, normalized_type);
  if (normalized_type === 'COVERAGE_HP_AREA' || normalized_type === 'COVERAGE_SP_AREA') network_status = 'COVERAGE';
  if (normalized_type === 'NON_COVERAGE_HOME_PASS') network_status = 'NON_COVERAGE';

  const normalized_subtype = inferSubtype(item, pathParts, normalized_type);
  const engineering = extractEngineeringFields(item, normalized_type);
  const needs_review = mapping_confidence < 80 && item.item_type === 'Placemark';
  return { normalized_type, normalized_subtype, network_status, ...engineering, mapping_confidence, mapping_reason, needs_review };
}

function findCustomRule(text) {
  const n = normalizeText(text);
  for (const rule of state.customRules) {
    for (const keyword of rule.keywords || []) {
      if (n.includes(normalizeText(keyword))) return { type: rule.type, keyword };
    }
  }
  return null;
}

function inferStatus(pathParts, type) {
  const p = normalizeText(pathParts.join(' '));
  if (/\bexisting\b/.test(p) || /\beksisting\b/.test(p)) return 'EXISTING';
  if (/\bnew\b|\bbaru\b/.test(p)) return 'NEW';
  if (type === 'NON_COVERAGE_HOME_PASS') return 'NON_COVERAGE';
  if (/coverage/.test(p)) return 'COVERAGE';
  return 'UNKNOWN';
}

function hasAny(text, terms) {
  return terms.some(t => text.includes(normalizeText(t)));
}

function localName(node) { return node.localName || node.nodeName.split(':').pop(); }
function directChild(node, name) { return [...node.children].find(el => localName(el) === name) || null; }
function directText(node, name) { const el = directChild(node, name); return el ? (el.textContent || '').trim() : ''; }
function findNestedText(node, name) {
  const all = [...node.getElementsByTagName('*')];
  const el = all.find(x => localName(x) === name);
  return el ? (el.textContent || '').trim() : '';
}
function stripHtml(s) { return (s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); }

function extractGeometry(feature) {
  const geometryNodes = [];
  const walk = (node) => {
    const ln = localName(node);
    if (['Point', 'LineString', 'LinearRing', 'Polygon', 'MultiGeometry', 'Track', 'MultiTrack', 'Model'].includes(ln)) geometryNodes.push(node);
    [...node.children].forEach(walk);
  };
  walk(feature);

  const typePriority = ['Point', 'LineString', 'Polygon', 'LinearRing', 'Model', 'MultiGeometry', 'Track', 'MultiTrack'];
  let type = '';
  for (const t of typePriority) if (geometryNodes.some(n => localName(n) === t)) { type = t; break; }

  const coordinates = [];
  let partNo = 0;
  const collectCoordinates = (node) => {
    const ln = localName(node);
    if (ln === 'coordinates') {
      parseCoordinates(node.textContent).forEach(c => coordinates.push({ ...c, part: ++partNo }));
    } else {
      [...node.children].forEach(collectCoordinates);
    }
  };
  collectCoordinates(feature);
  return { type, coordinates };
}

function parseCoordinates(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).map(token => {
    const [lon = '', lat = '', alt = ''] = token.split(',');
    return { lon: toNumberOrText(lon), lat: toNumberOrText(lat), alt: toNumberOrText(alt) };
  });
}
function toNumberOrText(v) { if (v === '') return ''; const n = Number(v); return Number.isFinite(n) ? n : v; }

function extractExtendedData(node) {
  const out = [];
  const all = [...node.getElementsByTagName('*')];
  const ext = all.find(x => localName(x) === 'ExtendedData');
  if (!ext) return out;
  [...ext.getElementsByTagName('*')].forEach(d => {
    const ln = localName(d);
    if (ln === 'Data') out.push({ key: d.getAttribute('name') || '', value: directText(d, 'value'), type: 'Data' });
    if (ln === 'SimpleData') out.push({ key: d.getAttribute('name') || '', value: (d.textContent || '').trim(), type: 'SimpleData' });
  });
  return out;
}

function updateSummary(r) {
  $('statItems').textContent = r.items.length.toLocaleString('id-ID');
  $('statPlacemarks').textContent = r.items.filter(x => x.item_type === 'Placemark').length.toLocaleString('id-ID');
  $('statCoords').textContent = r.coords.length.toLocaleString('id-ID');
  $('statExtended').textContent = r.extended.length.toLocaleString('id-ID');
  const reviewCount = r.items.filter(x => x.needs_review).length;
  $('statReview').textContent = reviewCount.toLocaleString('id-ID');
  $('statTypes').textContent = new Set(r.items.map(x => x.normalized_type)).size.toLocaleString('id-ID');

  if (tabReviewBadge) {
    if (reviewCount > 0) {
      tabReviewBadge.textContent = reviewCount;
      tabReviewBadge.classList.remove('hidden');
    } else {
      tabReviewBadge.classList.add('hidden');
    }
  }
}

function generateBoqSummary(items) {
  const boqMap = new Map();

  items.forEach(item => {
    if (item.item_type !== 'Placemark' && item.item_type !== 'Folder') return;

    const category = item.normalized_type || 'OTHER';
    const subtype = item.normalized_subtype || 'DEFAULT';
    const status = item.network_status || 'UNKNOWN';
    const key = `${category}__${subtype}__${status}`;

    if (!boqMap.has(key)) {
      boqMap.set(key, {
        category,
        subtype,
        status,
        count: 0,
        totalLengthM: 0,
        hasLength: false,
      });
    }

    const group = boqMap.get(key);
    group.count += 1;
    if (typeof item.cable_length_m === 'number' && !isNaN(item.cable_length_m)) {
      group.totalLengthM += item.cable_length_m;
      group.hasLength = true;
    }
  });

  const categoryOrder = [
    'POLE', 'DPFO', 'CABLE', 'JOINTBOX', 'HOME_PASS',
    'NON_COVERAGE_HOME_PASS', 'COVERAGE_HP_AREA', 'COVERAGE_SP_AREA', 'BOUNDARY', 'OTHER'
  ];

  const sortedGroups = [...boqMap.values()].sort((a, b) => {
    const idxA = categoryOrder.indexOf(a.category);
    const idxB = categoryOrder.indexOf(b.category);
    const catComp = (idxA >= 0 ? idxA : 99) - (idxB >= 0 ? idxB : 99);
    if (catComp !== 0) return catComp;
    if (a.subtype !== b.subtype) return a.subtype.localeCompare(b.subtype);
    return a.status.localeCompare(b.status);
  });

  return sortedGroups.map((g, idx) => {
    let unit = 'Unit';
    if (g.category === 'CABLE') unit = 'Span / Segmen';
    else if (g.category.includes('AREA') || g.category === 'BOUNDARY') unit = 'Poligon / Area';
    else if (g.category === 'HOME_PASS' || g.category === 'NON_COVERAGE_HOME_PASS') unit = 'Titik HP';

    return {
      'No': idx + 1,
      'Kategori Aset': g.category,
      'Spesifikasi / Subtype': g.subtype,
      'Status Jaringan': g.status,
      'Jumlah Aset': g.count,
      'Satuan': unit,
      'Total Panjang Kabel (Meter)': g.hasLength ? g.totalLengthM : '',
      'Keterangan': getBoqNotes(g.category, g.subtype, g.status)
    };
  });
}

function getBoqNotes(category, subtype, status) {
  if (category === 'POLE') {
    if (subtype.includes('NP7S')) return 'Tiang Besi 7 Meter Khusus (NP7S)';
    if (subtype.includes('NP7')) return 'Tiang Distribusi Beton/Besi 7 Meter (NP7)';
    if (subtype.includes('NP9')) return 'Tiang Feeder 9 Meter (NP9)';
    if (status === 'EXISTING') return 'Tiang Eksisting Pihak Ketiga';
    return 'Tiang Jaringan FTTH';
  }
  if (category === 'DPFO') return 'Distribution Point Fiber Optic / ODP';
  if (category === 'CABLE') return `Kabel Distribusi Fiber Optic ${subtype}`;
  if (category === 'JOINTBOX') return 'Joint Closure / Sambungan Kabel Optik';
  if (category === 'HOME_PASS') return 'Calon Pelanggan Ter-cover (Home Pass)';
  if (category === 'NON_COVERAGE_HOME_PASS') return 'Bangunan di luar cakupan distribusi';
  if (category.includes('AREA') || category === 'BOUNDARY') return 'Batas Lingkup Wilayah / Cluster';
  return '-';
}

function formatItemForExport(x, index) {
  return {
    'No': index + 1,
    'Normalized Type': x.normalized_type,
    'Subtype / Spec': x.normalized_subtype,
    'Network Status': x.network_status,
    'Asset ID': x.asset_id,
    'Name': x.name,
    'Cable Core': x.cable_core_count,
    'Cable Length (m)': x.cable_length_m,
    'Folder Path': x.folder,
    'Longitude': x.longitude,
    'Latitude': x.latitude,
    'Altitude': x.altitude,
    'Item Type': x.item_type,
    'Geometry': x.geometry_type,
    'Coordinates Count': x.coordinate_count,
    'Confidence (%)': x.mapping_confidence,
    'Mapping Reason': x.mapping_reason,
    'Needs Review': x.needs_review ? 'YES' : 'NO',
    'Source File': x.source_file,
    'Item ID': x.item_id,
    'Parent ID': x.parent_id,
    'Visibility': x.visibility,
    'Style URL': x.style_url,
    'Description': x.description,
    'Snippet': x.snippet,
    'Time When': x.time_when,
    'Time Begin': x.time_begin,
    'Time End': x.time_end
  };
}

function buildColumnChecklist(headers) {
  if (!colChecklist) return;
  colChecklist.innerHTML = '';

  headers.forEach(h => {
    const label = document.createElement('label');
    label.className = 'col-check-item';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.dataset.col = h;
    cb.checked = !state.hiddenColumns.has(h);

    cb.addEventListener('change', () => {
      if (cb.checked) {
        state.hiddenColumns.delete(h);
      } else {
        state.hiddenColumns.add(h);
      }
      updateColBadge(headers);
      renderPreview();
    });

    const span = document.createElement('span');
    span.textContent = h;
    span.title = h;

    label.appendChild(cb);
    label.appendChild(span);
    colChecklist.appendChild(label);
  });
}

function syncColumnChecklist(headers) {
  if (!colChecklist) return;
  const inputs = colChecklist.querySelectorAll('input[type="checkbox"]');
  inputs.forEach(input => {
    const col = input.dataset.col;
    if (col) {
      input.checked = !state.hiddenColumns.has(col);
    }
  });
}

function updateColBadge(headers) {
  if (!colCountBadge || !headers || !headers.length) return;
  const visible = headers.filter(h => !state.hiddenColumns.has(h)).length;
  if (visible === headers.length) {
    colCountBadge.textContent = 'Semua';
  } else {
    colCountBadge.textContent = `${visible}/${headers.length}`;
  }
}

function renderPreview() {
  if (!state.result) return;

  if (state.activeTab === 'map') {
    if (tablePreviewWrap) tablePreviewWrap.classList.add('hidden');
    if (tableControlsBar) tableControlsBar.classList.add('hidden');
    if (floatingActionBar) floatingActionBar.classList.remove('visible');
    if (mapPreviewWrap) mapPreviewWrap.classList.remove('hidden');
    if (!mapRendered) {
      renderGisMapData();
    } else if (mapInstance) {
      setTimeout(() => mapInstance.invalidateSize(), 50);
    }
    return;
  }

  if (tablePreviewWrap) tablePreviewWrap.classList.remove('hidden');
  if (tableControlsBar) tableControlsBar.classList.remove('hidden');
  if (mapPreviewWrap) mapPreviewWrap.classList.add('hidden');

  let data = state.activeTab === 'items' ? state.result.items
    : state.activeTab === 'boq' ? generateBoqSummary(state.result.items)
    : state.activeTab === 'review' ? state.result.items.filter(x => x.needs_review)
    : state.activeTab === 'coords' ? state.result.coords
    : state.activeTab === 'extended' ? state.result.extended
    : [];

  const rawTotal = data.length;

  // Filter by Type
  if (state.typeFilter) {
    const tf = state.typeFilter;
    data = data.filter(row => {
      const t = row.normalized_type || row['Kategori Aset'] || '';
      return t === tf;
    });
  }

  // Filter by Status
  if (state.statusFilter) {
    const sf = state.statusFilter;
    data = data.filter(row => {
      const s = row.network_status || row['Status Jaringan'] || '';
      return s === sf;
    });
  }

  // Filter by Search Query
  if (state.searchQuery) {
    const q = state.searchQuery;
    data = data.filter(row => Object.values(row).some(v => String(v ?? '').toLowerCase().includes(q)));
  }

  previewTable.innerHTML = '';
  if (!data.length) {
    let msg = 'Tidak ada data pada sheet ini.';
    if (state.searchQuery) {
      msg = `Tidak ada data yang cocok dengan pencarian "${escapeHtml(state.searchQuery)}".`;
    } else if (state.typeFilter || state.statusFilter) {
      const filters = [];
      if (state.typeFilter) filters.push(`Tipe: ${state.typeFilter}`);
      if (state.statusFilter) filters.push(`Status: ${state.statusFilter}`);
      msg = `Tidak ada data yang cocok dengan filter (${filters.join(', ')}).`;
    }
    previewTable.innerHTML = `<tr><td style="padding: 24px; text-align: center; color: var(--text-muted);">${msg}</td></tr>`;
    if (tableFooterInfo) tableFooterInfo.textContent = `0 dari ${rawTotal.toLocaleString('id-ID')} baris`;
    if (floatingCount) floatingCount.textContent = '0 baris';
    checkFloatingBarVisibility();
    return;
  }

  let headers = Object.keys(data[0]);
  if (state.activeTab === 'items' || state.activeTab === 'review') {
    headers = headers.sort((a, b) => {
      const idxA = PREFERRED_ITEM_KEYS.indexOf(a);
      const idxB = PREFERRED_ITEM_KEYS.indexOf(b);
      return (idxA >= 0 ? idxA : 99) - (idxB >= 0 ? idxB : 99);
    });
  }

  state.currentHeaders = headers;
  const headersKey = `${state.activeTab}:${headers.join('|')}`;
  if (state.activeHeadersKey !== headersKey) {
    state.activeHeadersKey = headersKey;
    buildColumnChecklist(headers);
  } else {
    syncColumnChecklist(headers);
  }
  updateColBadge(headers);

  const visibleHeaders = headers.filter(h => !state.hiddenColumns.has(h));
  if (!visibleHeaders.length) {
    previewTable.innerHTML = `<tr><td style="padding: 24px; text-align: center; color: var(--text-muted);">
      Semua kolom disembunyikan. Klik <b>Pilih Kolom</b> di pojok kanan atas untuk menampilkan kolom kembali.
    </td></tr>`;
    if (tableFooterInfo) tableFooterInfo.textContent = `0 kolom ditampilkan (${data.length.toLocaleString('id-ID')} baris)`;
    if (floatingCount) floatingCount.textContent = '0 kolom ditampilkan';
    checkFloatingBarVisibility();
    return;
  }

  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  visibleHeaders.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  previewTable.appendChild(thead);

  const tbody = document.createElement('tbody');
  const displayLimit = 250;
  const displayed = data.slice(0, displayLimit);

  displayed.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    visibleHeaders.forEach(h => {
      const td = document.createElement('td');
      if (state.activeTab === 'review' && h === 'normalized_type') {
        const select = document.createElement('select');
        select.className = 'inline-select';
        CLASS_OPTIONS.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          if (row[h] === opt) option.selected = true;
          select.appendChild(option);
        });
        select.addEventListener('change', () => {
          row.normalized_type = select.value;
          row.mapping_confidence = 100;
          row.mapping_reason = 'manual review override';
          row.needs_review = false;
          row.network_status = row.network_status === 'UNKNOWN' ? inferStatus((row.folder || '').split(' / '), row.normalized_type) : row.network_status;
          const idx = state.result.items.findIndex(x => x.item_id === row.item_id && x.name === row.name && x.source_file === row.source_file);
          if (idx >= 0) state.result.items[idx] = { ...state.result.items[idx], ...row };
          const typeById = new Map(state.result.items.map(x => [x.item_id, x.normalized_type]));
          state.result.coords = state.result.coords.map(c => ({ ...c, normalized_type: typeById.get(c.item_id) || c.normalized_type }));
          state.result.extended = state.result.extended.map(e => ({ ...e, normalized_type: typeById.get(e.item_id) || e.normalized_type }));
          mapRendered = false;
          updateSummary(state.result);
          renderPreview();
        });
        td.appendChild(select);
      } else {
        td.textContent = row[h] == null ? '' : String(row[h]);
      }
      tr.appendChild(td);
    });
    tr.dataset.row = String(rowIndex);
    tbody.appendChild(tr);
  });
  previewTable.appendChild(tbody);

  if (tableFooterInfo) {
    const hasFilter = Boolean(state.searchQuery || state.typeFilter || state.statusFilter);
    const queryInfo = hasFilter ? ` (difilter dari ${rawTotal.toLocaleString('id-ID')} total)` : '';
    const colInfo = ` · ${visibleHeaders.length}/${headers.length} kolom`;
    tableFooterInfo.textContent = `Menampilkan ${displayed.length.toLocaleString('id-ID')} dari ${data.length.toLocaleString('id-ID')} baris${queryInfo}${colInfo}`;
  }

  // Update Sticky Floating Action Bar info
  if (floatingTabBadge) {
    floatingTabBadge.textContent = TAB_LABELS[state.activeTab] || state.activeTab;
  }
  if (floatingCount) {
    const hasFilter = Boolean(state.searchQuery || state.typeFilter || state.statusFilter);
    const filterTag = hasFilter ? ' (filter)' : '';
    floatingCount.textContent = `${displayed.length.toLocaleString('id-ID')} / ${data.length.toLocaleString('id-ID')} baris${filterTag}`;
  }
  checkFloatingBarVisibility();
}

/* ==========================================================================
   GIS Leaflet Map Preview System
   ========================================================================== */

function getValidLatLng(latVal, lonVal) {
  if (latVal == null || lonVal == null || latVal === '' || lonVal === '') return null;
  const lat = typeof latVal === 'number' ? latVal : parseFloat(String(latVal).trim());
  const lon = typeof lonVal === 'number' ? lonVal : parseFloat(String(lonVal).trim());
  if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
    return [lat, lon];
  }
  return null;
}

function initGisMap() {
  if (mapInstance) return;
  const container = $('gisMap');
  if (!container || !window.L) return;

  mapInstance = L.map('gisMap', {
    center: [-2.5489, 118.0149],
    zoom: 5,
    zoomControl: true,
  });

  mapLayerGroups = {
    POLE: L.layerGroup().addTo(mapInstance),
    DPFO: L.layerGroup().addTo(mapInstance),
    CABLE: L.layerGroup().addTo(mapInstance),
    JOINTBOX: L.layerGroup().addTo(mapInstance),
    HOME_PASS: L.layerGroup().addTo(mapInstance),
    NON_COVERAGE_HOME_PASS: L.layerGroup().addTo(mapInstance),
    COVERAGE_HP_AREA: L.layerGroup().addTo(mapInstance),
    COVERAGE_SP_AREA: L.layerGroup().addTo(mapInstance),
    BOUNDARY: L.layerGroup().addTo(mapInstance),
    OTHER: L.layerGroup().addTo(mapInstance),
  };

  updateBasemap();

  // Layer filter binding
  const bindLayer = (id, groupKey) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener('change', () => {
      const group = mapLayerGroups[groupKey];
      if (!group) return;
      if (el.checked) {
        if (!mapInstance.hasLayer(group)) mapInstance.addLayer(group);
      } else {
        if (mapInstance.hasLayer(group)) mapInstance.removeLayer(group);
      }
    });
  };

  bindLayer('layerPole', 'POLE');
  bindLayer('layerDpfo', 'DPFO');
  bindLayer('layerCable', 'CABLE');
  bindLayer('layerJointbox', 'JOINTBOX');
  bindLayer('layerHomepass', 'HOME_PASS');

  const boundaryCheck = $('layerBoundary');
  if (boundaryCheck) {
    boundaryCheck.addEventListener('change', () => {
      ['BOUNDARY', 'COVERAGE_HP_AREA', 'COVERAGE_SP_AREA'].forEach(k => {
        const group = mapLayerGroups[k];
        if (!group) return;
        if (boundaryCheck.checked) {
          if (!mapInstance.hasLayer(group)) mapInstance.addLayer(group);
        } else {
          if (mapInstance.hasLayer(group)) mapInstance.removeLayer(group);
        }
      });
    });
  }

  const basemapSelect = $('mapBasemapSelect');
  if (basemapSelect) {
    basemapSelect.addEventListener('change', updateBasemap);
  }

  const fitBtn = $('mapFitBoundsBtn');
  if (fitBtn) {
    fitBtn.addEventListener('click', fitMapToBounds);
  }
}

function updateBasemap() {
  if (!mapInstance || !window.L) return;
  const select = $('mapBasemapSelect');
  let choice = select ? select.value : 'auto';

  if (choice === 'auto') {
    const isDark = (document.documentElement.getAttribute('data-theme') || 'light') === 'dark';
    choice = isDark ? 'dark' : 'light';
  }

  if (currentTileLayer) {
    mapInstance.removeLayer(currentTileLayer);
  }

  let tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  let options = {
    maxZoom: 20,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
  };

  if (choice === 'dark') {
    tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  } else if (choice === 'satellite') {
    tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    options = {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri, Earthstar Geographics'
    };
  } else if (choice === 'osm') {
    tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    options = {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    };
  }

  currentTileLayer = L.tileLayer(tileUrl, options).addTo(mapInstance);
}

function renderGisMapData() {
  const statsEl = $('mapStatsInfo');

  if (!window.L) {
    if (statsEl) statsEl.textContent = 'Memuat library Leaflet GIS...';
    let count = 0;
    const poll = setInterval(() => {
      count++;
      if (window.L) {
        clearInterval(poll);
        renderGisMapData();
      } else if (count > 25) {
        clearInterval(poll);
        if (statsEl) statsEl.textContent = 'Perhatian: Gagal memuat library Leaflet. Periksa koneksi internet Anda.';
      }
    }, 200);
    return;
  }

  initGisMap();
  if (!mapInstance) return;

  Object.values(mapLayerGroups).forEach(g => g.clearLayers());

  if (!state.result || !state.result.items || !state.result.items.length) {
    if (statsEl) statsEl.textContent = 'Belum ada data KMZ yang dimuat. Silakan pilih atau tarik file KMZ terlebih dahulu.';
    setTimeout(() => mapInstance.invalidateSize(), 100);
    return;
  }

  const items = state.result.items;
  const coords = state.result.coords || [];

  const coordsByItem = new Map();
  coords.forEach(c => {
    if (!coordsByItem.has(c.item_id)) coordsByItem.set(c.item_id, []);
    coordsByItem.get(c.item_id).push(c);
  });

  const bounds = L.latLngBounds([]);
  let renderedCount = 0;

  items.forEach(item => {
    const type = item.normalized_type || 'OTHER';
    const group = mapLayerGroups[type] || mapLayerGroups.OTHER;
    const itemCoords = coordsByItem.get(item.item_id) || [];

    // Find valid coordinates
    let primaryPoint = getValidLatLng(item.latitude, item.longitude);
    if (!primaryPoint && itemCoords.length > 0) {
      primaryPoint = getValidLatLng(itemCoords[0].latitude, itemCoords[0].longitude);
    }

    // 1. CABLES / LINES
    if (type === 'CABLE' || item.geometry_type === 'LineString' || item.geometry_type === 'MultiGeometry') {
      const linePoints = [];
      itemCoords.forEach(c => {
        const pt = getValidLatLng(c.latitude, c.longitude);
        if (pt) linePoints.push(pt);
      });

      if (linePoints.length >= 2) {
        linePoints.forEach(pt => bounds.extend(pt));
        const color = getCableColor(item);
        const polyline = L.polyline(linePoints, {
          color: color,
          weight: 3.5,
          opacity: 0.9,
          lineJoin: 'round',
        });

        polyline.bindPopup(createItemPopupHtml(item, { latitude: linePoints[0][0], longitude: linePoints[0][1] }));
        polyline.bindTooltip(`${escapeHtml(item.name || 'Kabel')} ${item.cable_length_m ? '(' + item.cable_length_m + 'm)' : ''}`, { sticky: true });
        polyline.addTo(group);
        renderedCount++;
      } else if (primaryPoint) {
        bounds.extend(primaryPoint);
        const marker = createItemMarker(item, primaryPoint);
        marker.bindPopup(createItemPopupHtml(item, { latitude: primaryPoint[0], longitude: primaryPoint[1] }));
        marker.addTo(group);
        renderedCount++;
      }
    }
    // 2. BOUNDARY / AREA POLYGONS
    else if (type.includes('AREA') || type === 'BOUNDARY' || item.geometry_type === 'Polygon' || item.geometry_type === 'LinearRing') {
      const polyPoints = [];
      itemCoords.forEach(c => {
        const pt = getValidLatLng(c.latitude, c.longitude);
        if (pt) polyPoints.push(pt);
      });

      if (polyPoints.length >= 3) {
        polyPoints.forEach(pt => bounds.extend(pt));
        const poly = L.polygon(polyPoints, {
          color: type === 'BOUNDARY' ? '#ff3b30' : '#00f0ff',
          weight: 2,
          dashArray: type === 'BOUNDARY' ? '6, 6' : '4, 4',
          fillOpacity: 0.16,
        });

        poly.bindPopup(createItemPopupHtml(item, { latitude: polyPoints[0][0], longitude: polyPoints[0][1] }));
        poly.addTo(group);
        renderedCount++;
      } else if (primaryPoint) {
        bounds.extend(primaryPoint);
        const marker = createItemMarker(item, primaryPoint);
        marker.bindPopup(createItemPopupHtml(item, { latitude: primaryPoint[0], longitude: primaryPoint[1] }));
        marker.addTo(group);
        renderedCount++;
      }
    }
    // 3. POINTS (POLE, DPFO, JOINTBOX, HOMEPASS, ETC.)
    else if (primaryPoint) {
      bounds.extend(primaryPoint);
      const marker = createItemMarker(item, primaryPoint);
      marker.bindPopup(createItemPopupHtml(item, { latitude: primaryPoint[0], longitude: primaryPoint[1] }));
      marker.addTo(group);
      renderedCount++;
    }
  });

  if (statsEl) {
    statsEl.textContent = `${renderedCount.toLocaleString('id-ID')} aset berhasil ditampilkan di peta GIS`;
  }

  const refreshMapSize = () => {
    if (!mapInstance) return;
    mapInstance.invalidateSize();
    if (bounds.isValid()) {
      mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 18 });
    }
  };

  refreshMapSize();
  setTimeout(refreshMapSize, 120);
  setTimeout(refreshMapSize, 350);

  mapRendered = true;
}

function fitMapToBounds() {
  if (!mapInstance || !state.result || !window.L) return;
  const coords = state.result.coords || [];
  const items = state.result.items || [];
  const bounds = L.latLngBounds([]);

  coords.forEach(c => {
    const pt = getValidLatLng(c.latitude, c.longitude);
    if (pt) bounds.extend(pt);
  });

  if (!bounds.isValid()) {
    items.forEach(it => {
      const pt = getValidLatLng(it.latitude, it.longitude);
      if (pt) bounds.extend(pt);
    });
  }

  if (bounds.isValid()) {
    mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 18 });
  }
}

function createItemMarker(item, latlng) {
  const type = item.normalized_type;
  let color = '#00f0ff';
  let fillColor = '#00f0ff';
  let radius = 5.5;

  if (type === 'POLE') {
    color = '#00f0ff';
    fillColor = item.network_status === 'EXISTING' ? '#475569' : '#00f0ff';
    radius = 5.5;
  } else if (type === 'DPFO') {
    color = '#00ff9d';
    fillColor = '#00ff9d';
    radius = 7;
  } else if (type === 'JOINTBOX') {
    color = '#ffb700';
    fillColor = '#ffb700';
    radius = 6.5;
  } else if (type === 'HOME_PASS') {
    color = '#10b981';
    fillColor = '#10b981';
    radius = 4;
  } else if (type === 'NON_COVERAGE_HOME_PASS') {
    color = '#ff007f';
    fillColor = '#ff007f';
    radius = 4;
  }

  return L.circleMarker(latlng, {
    radius: radius,
    color: color,
    weight: 2,
    fillColor: fillColor,
    fillOpacity: 0.9,
  });
}

function getCableColor(item) {
  const core = String(item.cable_core_count || '');
  if (core.includes('96') || core.includes('144')) return '#c084fc'; // Neon Hyper-Violet
  if (core.includes('48')) return '#ff007f'; // Neon Fuchsia/Magenta
  if (core.includes('24')) return '#00f0ff'; // Neon Electric Cyan
  if (core.includes('12') || core.includes('8') || core.includes('6')) return '#00ff9d'; // Neon Emerald
  return '#38bdf8'; // Electric Sky
}

function createItemPopupHtml(item, coord) {
  return `
    <div class="map-popup-card">
      <div class="map-popup-title">
        <span>${escapeHtml(item.name || item.asset_id || 'Item')}</span>
        <span class="map-popup-badge">${escapeHtml(item.normalized_type || '')}</span>
      </div>
      <div class="map-popup-grid">
        <span class="map-popup-label">Subtype</span>
        <span class="map-popup-val text-val">${escapeHtml(item.normalized_subtype || '-')}</span>
        <span class="map-popup-label">Status</span>
        <span class="map-popup-val text-val">${escapeHtml(item.network_status || '-')}</span>
        <span class="map-popup-label">Latitude</span>
        <span class="map-popup-val">${coord && typeof coord.latitude === 'number' ? Number(coord.latitude).toFixed(6) : '-'}</span>
        <span class="map-popup-label">Longitude</span>
        <span class="map-popup-val">${coord && typeof coord.longitude === 'number' ? Number(coord.longitude).toFixed(6) : '-'}</span>
        ${item.cable_length_m ? `<span class="map-popup-label">Panjang</span><span class="map-popup-val">${item.cable_length_m} m</span>` : ''}
        ${item.cable_core_count ? `<span class="map-popup-label">Kapasitas</span><span class="map-popup-val">${escapeHtml(item.cable_core_count)} Core</span>` : ''}
        <span class="map-popup-label">Folder</span>
        <span class="map-popup-val text-val">${escapeHtml(item.folder || '-')}</span>
        <span class="map-popup-label">Confidence</span>
        <span class="map-popup-val">${item.mapping_confidence || 0}%</span>
      </div>
    </div>
  `;
}

function exportExcel() {
  if (!state.result) return;
  if (!window.XLSX || !XLSX.utils || !XLSX.writeFile) {
    showError('Library Excel belum siap. Pastikan koneksi internet aktif lalu reload halaman.');
    return;
  }
  const r = state.result;
  const wb = XLSX.utils.book_new();

  // 1. BOQ / Rekapitulasi Material
  const boqData = generateBoqSummary(r.items);

  // 2. Summary
  const summary = [
    { Metric: 'Source file', Value: state.fileName },
    { Metric: 'Total items', Value: r.items.length },
    { Metric: 'Placemark', Value: r.items.filter(x => x.item_type === 'Placemark').length },
    { Metric: 'Coordinate rows', Value: r.coords.length },
    { Metric: 'ExtendedData rows', Value: r.extended.length },
    { Metric: 'Needs review', Value: r.items.filter(x => x.needs_review).length },
    { Metric: 'Normalized types', Value: new Set(r.items.map(x => x.normalized_type)).size },
    { Metric: 'Generated at', Value: new Date().toISOString() },
  ];

  // 3. Formatted Items with clean column sequence
  const items = r.items.map((x, i) => formatItemForExport(x, i));
  const review = r.items.filter(x => x.needs_review).map((x, i) => formatItemForExport(x, i));
  const coords = r.coords.map((x, i) => ({ No: i + 1, ...x }));
  const extended = r.extended.map((x, i) => ({ No: i + 1, ...x }));

  const typeCounts = {};
  r.items.forEach(x => { typeCounts[x.normalized_type] = (typeCounts[x.normalized_type] || 0) + 1; });
  const statusCounts = {};
  r.items.forEach(x => { statusCounts[x.network_status] = (statusCounts[x.network_status] || 0) + 1; });

  const typeRows = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([Type, Count]) => ({ Type, Count }));
  const statusRows = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([Status, Count]) => ({ Status, Count }));

  appendSheet(wb, boqData, 'BOQ Summary');
  appendSheet(wb, summary, 'Summary');
  appendSheet(wb, items, 'All Items');
  appendSheet(wb, review, 'Review');
  appendSheet(wb, coords, 'Coordinates');
  appendSheet(wb, extended, 'ExtendedData');
  appendSheet(wb, typeRows, 'Type Summary');
  appendSheet(wb, statusRows, 'Status Summary');

  const out = state.fileName.replace(/\.(kmz|kml)$/i, '') + '_normalized.xlsx';
  try {
    XLSX.writeFile(wb, out, { compression: true });
  } catch (err) {
    console.error(err);
    showError(`Gagal membuat file Excel: ${err?.message || err}`);
  }
}

function appendSheet(wb, rows, name) {
  const data = rows.length ? rows : [{ Info: 'Tidak ada data' }];
  const sheet = XLSX.utils.json_to_sheet(data, { skipHeader: false });
  if (sheet['!ref']) {
    sheet['!autofilter'] = { ref: sheet['!ref'] };
    const range = XLSX.utils.decode_range(sheet['!ref']);
    const widths = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      widths.push({ wch: Math.min(48, Math.max(12, columnWidth(data, c))) });
    }
    sheet['!cols'] = widths;
  }
  XLSX.utils.book_append_sheet(wb, sheet, name);
}

function columnWidth(rows, colIndex) {
  const keys = rows.length ? Object.keys(rows[0]) : ['Info'];
  const key = keys[colIndex] || '';
  const max = rows.slice(0, 300).reduce((m, r) => Math.max(m, String(r[key] ?? '').length), key.length);
  return max + 2;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
}

renderRuleList();

