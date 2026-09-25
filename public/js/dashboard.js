/* Student Portal dashboard - registration wizard.
 *
 * Steps: 1) Personal details  2) Academic details
 *        3) Certificate upload  4) Review & register
 *
 * All data comes from / goes to the server, so progress is never lost.
 */

const state = { user: null, app: null, step: 0, formsBuilt: false };

const $ = (id) => document.getElementById(id);

/* ------------------------------ field configs ------------------------------ */

const PERSONAL_FIELDS = [
  { name: 'fullName', label: 'Full name', type: 'text', required: true, placeholder: 'e.g. Priya Sharma', autocomplete: 'name' },
  { name: 'dob', label: 'Date of birth', type: 'date', required: true },
  { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
  { name: 'bloodGroup', label: 'Blood group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { name: 'community', label: 'Community', type: 'select', required: true, options: ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST', 'Other'] },
  { name: 'religion', label: 'Religion', type: 'text' },
  { name: 'nationality', label: 'Nationality', type: 'text', value: 'Indian' },
  { name: 'address', label: 'Address', type: 'textarea', required: true, full: true },
  { name: 'city', label: 'City / Town', type: 'text', required: true },
  { name: 'district', label: 'District', type: 'text', required: true },
  { name: 'state', label: 'State', type: 'text', required: true, value: 'Tamil Nadu' },
  { name: 'pincode', label: 'Pincode', type: 'text', required: true, placeholder: '6 digits' },
  { name: 'parentName', label: 'Parent / Guardian name', type: 'text', required: true },
  { name: 'parentPhone', label: 'Parent phone', type: 'tel', required: true },
  { name: 'parentOccupation', label: 'Parent occupation', type: 'text' },
];

const ACADEMIC_FIELDS = [
  { name: 'qualifyingExam', label: 'Qualifying exam', type: 'select', required: true, options: ['HSC (12th)', 'SSLC (10th)', 'Diploma', 'Other'] },
  { name: 'board', label: 'Board', type: 'text', required: true, placeholder: 'State Board / CBSE' },
  { name: 'schoolName', label: 'School name', type: 'text', required: true, full: true },
  { name: 'yearOfPassing', label: 'Year of passing', type: 'select', required: true, options: yearsList() },
  { name: 'examRegisterNo', label: 'Exam register number', type: 'text', required: true },
  { name: 'overallPercentage', label: 'Overall percentage (%)', type: 'number', required: true, min: 0, max: 100, step: '0.01' },
  { name: 'mathsMark', label: 'Maths mark (out of 100)', type: 'number', min: 0, max: 100, step: '0.01' },
  { name: 'physicsMark', label: 'Physics mark (out of 100)', type: 'number', min: 0, max: 100, step: '0.01' },
  { name: 'chemistryMark', label: 'Chemistry mark (out of 100)', type: 'number', min: 0, max: 100, step: '0.01' },
];

function yearsList() {
  const years = [];
  for (let y = 2027; y >= 2010; y--) years.push(String(y));
  return years;
}

const CERT_FIELDS = [
  { name: 'photo', label: 'Passport size photo', icon: '\uD83E\uDEAA', required: true },
  { name: 'tc', label: 'Transfer Certificate (TC)', icon: '\uD83D\uDCC4', required: true },
  { name: 'marksheet', label: 'HSC / Qualifying marksheet', icon: '\uD83D\uDCCA', required: true },
  { name: 'community', label: 'Community certificate (optional)', icon: '\uD83D\uDCDC', required: false },
];

/* ------------------------------ form building ------------------------------ */

function makeField(cfg) {
  const wrap = document.createElement('div');
  wrap.className = 'form-group';
  if (cfg.full) wrap.classList.add('full-width');

  const label = document.createElement('label');
  label.htmlFor = 'f-' + cfg.name;
  label.textContent = cfg.label;
  if (cfg.required) {
    const star = document.createElement('span');
    star.className = 'req';
    star.textContent = ' *';
    label.appendChild(star);
  }

  let input;
  if (cfg.type === 'select') {
    input = document.createElement('select');
    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = 'Select\u2026';
    input.appendChild(blank);
    for (const opt of cfg.options) {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      input.appendChild(o);
    }
  } else if (cfg.type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 3;
  } else {
    input = document.createElement('input');
    input.type = cfg.type;
    if (cfg.min !== undefined) input.min = cfg.min;
    if (cfg.max !== undefined) input.max = cfg.max;
    if (cfg.step !== undefined) input.step = cfg.step;
  }
  input.id = 'f-' + cfg.name;
  input.name = cfg.name;
  if (cfg.placeholder) input.placeholder = cfg.placeholder;
  if (cfg.autocomplete) input.autocomplete = cfg.autocomplete;
  if (cfg.value) input.value = cfg.value;

  const err = document.createElement('p');
  err.className = 'field-error';
  err.id = 'err-' + cfg.name;

  wrap.append(label, input, err);
  return wrap;
}

function buildForms() {
  const pGrid = document.querySelector('#personalForm .form-grid');
  const aGrid = document.querySelector('#academicForm .form-grid');
  PERSONAL_FIELDS.forEach((c) => pGrid.appendChild(makeField(c)));
  ACADEMIC_FIELDS.forEach((c) => aGrid.appendChild(makeField(c)));
  buildUploadCards();
  state.formsBuilt = true;
}

function fillForm(fields, data) {
  for (const cfg of fields) {
    const el = $('f-' + cfg.name);
    if (el && data && data[cfg.name] != null) el.value = data[cfg.name];
  }
}

function collectForm(fields) {
  const out = {};
  for (const cfg of fields) {
    const el = $('f-' + cfg.name);
    if (el) out[cfg.name] = el.value.trim();
  }
  return out;
}

function setFieldError(name, msg) {
  const err = $('err-' + name);
  const input = $('f-' + name);
  if (err) err.textContent = msg || '';
  if (input) input.classList.toggle('input-invalid', Boolean(msg));
}

function clearFieldErrors(fields) {
  fields.forEach((c) => setFieldError(c.name, ''));
}

/* ------------------------------ save sections ------------------------------ */

async function saveSection(url, fields, btn) {
  clearFieldErrors(fields);

  // quick client-side required check (full validation happens on the server)
  let valid = true;
  for (const cfg of fields) {
    if (cfg.required && !$('f-' + cfg.name).value.trim()) {
      setFieldError(cfg.name, 'This field is required.');
      valid = false;
    }
  }
  if (!valid) return false;

  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Saving\u2026';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectForm(fields)),
    });
    const data = await res.json();
    if (data.ok) return true;
    if (data.errors) {
      for (const [field, msg] of Object.entries(data.errors)) setFieldError(field, msg);
    }
  } catch {
    /* fall through */
  }

  btn.disabled = false;
  btn.textContent = original;
  return false;
}

/* ------------------------------ certificates ------------------------------- */

function buildUploadCards() {
  const grid = $('uploadGrid');
  CERT_FIELDS.forEach((cfg) => {
    const card = document.createElement('div');
    card.className = 'upload-card';
    card.id = 'card-' + cfg.name;

    const head = document.createElement('div');
    head.className = 'upload-head';
    const title = document.createElement('div');
    title.className = 'upload-title';
    title.textContent = cfg.icon + ' ' + cfg.label + (cfg.required ? ' *' : '');
    head.appendChild(title);

    const hint = document.createElement('p');
    hint.className = 'upload-hint';
    hint.textContent = 'PDF / JPG / PNG \u00b7 max 5 MB';

    const status = document.createElement('p');
    status.className = 'upload-status';
    status.id = 'status-' + cfg.name;

    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'file-' + cfg.name;
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.hidden = true;

    const btn = document.createElement('label');
    btn.className = 'btn btn-ghost btn-sm upload-btn';
    btn.htmlFor = 'file-' + cfg.name;
    btn.textContent = 'Choose file';

    input.addEventListener('change', () => uploadCert(cfg.name, input));

    card.append(head, hint, status, btn, input);
    grid.appendChild(card);
  });
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return Math.max(1, Math.round(bytes / 1024)) + ' KB';
}

function renderCerts() {
  const certs = (state.app && state.app.certificates) || {};
  for (const cfg of CERT_FIELDS) {
    const status = $('status-' + cfg.name);
    const card = $('card-' + cfg.name);
    const btn = card.querySelector('.upload-btn');
    const info = certs[cfg.name];
    if (info) {
      status.textContent = '\u2713 ' + info.originalName + ' (' + formatSize(info.size) + ')';
      status.className = 'upload-status done';
      card.classList.add('done');
      btn.textContent = 'Replace';
    } else {
      status.textContent = 'Not uploaded yet' + (cfg.required ? '' : ' (optional)');
      status.className = 'upload-status';
      card.classList.remove('done');
      btn.textContent = 'Choose file';
    }
  }
}

async function uploadCert(fieldName, input) {
  const file = input.files && input.files[0];
  const status = $('status-' + fieldName);
  const card = $('card-' + fieldName);
  if (!file) return;

  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!['.pdf', '.jpg', '.jpeg', '.png'].includes(ext)) {
    status.textContent = 'Only PDF, JPG or PNG files are allowed.';
    status.className = 'upload-status error';
    input.value = '';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    status.textContent = 'File is too large (max 5 MB).';
    status.className = 'upload-status error';
    input.value = '';
    return;
  }

  status.textContent = 'Uploading ' + file.name + '\u2026';
  status.className = 'upload-status';

  try {
    const fd = new FormData();
    fd.append(fieldName, file);
    const res = await fetch('/api/application/certificates', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.ok) {
      state.app.certificates = data.certificates;
      renderCerts();
      renderStepper();
    } else if (data.errors && data.errors[fieldName]) {
      status.textContent = data.errors[fieldName];
      status.className = 'upload-status error';
    } else {
      status.textContent = data.message || 'Upload failed. Please try again.';
      status.className = 'upload-status error';
    }
  } catch {
    status.textContent = 'Could not reach the server. Please try again.';
    status.className = 'upload-status error';
  }
  input.value = '';
}

/* ------------------------------ stepper / steps ---------------------------- */

function maxStep() {
  const p = (state.app && state.app.progress) || {};
  if (p.personal && p.academic && p.certificates) return 3;
  if (p.personal && p.academic) return 2;
  if (p.personal) return 1;
  return 0;
}

function stepDone(i) {
  const p = (state.app && state.app.progress) || {};
  if (i === 0) return Boolean(p.personal);
  if (i === 1) return Boolean(p.academic);
  if (i === 2) return Boolean(p.certificates);
  if (i === 3) return state.app && state.app.status === 'registered';
  return false;
}

function renderStepper() {
  document.querySelectorAll('.stepper-item').forEach((item) => {
    const i = Number(item.dataset.step);
    item.classList.toggle('done', stepDone(i));
    item.classList.toggle('active', i === state.step);
    item.classList.toggle('clickable', i <= maxStep() && !(state.app && state.app.status === 'registered'));
    item.querySelector('.stepper-dot').textContent = stepDone(i) && i !== state.step ? '\u2713' : String(i + 1);
  });
}

function goStep(i) {
  state.step = i;
  for (let k = 0; k < 4; k++) $('panel-' + k).hidden = k !== i;
  renderStepper();
  if (i === 3) renderReview();
  const wizard = $('wizardView');
  if (wizard) wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ------------------------------ review & register -------------------------- */

function reviewRow(label, value) {
  const row = document.createElement('div');
  row.className = 'review-row';
  const s = document.createElement('span');
  s.textContent = label;
  const v = document.createElement('strong');
  v.textContent = value === '' || value == null ? '\u2014' : value;
  row.append(s, v);
  return row;
}

function reviewSection(title, rows) {
  const sec = document.createElement('div');
  sec.className = 'review-section';
  const h = document.createElement('h3');
  h.textContent = title;
  sec.appendChild(h);
  rows.forEach((r) => sec.appendChild(r));
  return sec;
}

function buildSummary(container) {
  container.textContent = '';
  const a = state.app || {};

  const personalRows = [
    reviewRow('Full name', a.personal && a.personal.fullName),
    reviewRow('Date of birth', a.personal && a.personal.dob),
    reviewRow('Gender', a.personal && a.personal.gender),
    reviewRow('Community', a.personal && a.personal.community),
    reviewRow('Blood group', a.personal && a.personal.bloodGroup),
    reviewRow('Address', [a.personal && a.personal.address, a.personal && a.personal.city, a.personal && a.personal.district, a.personal && a.personal.state, a.personal && a.personal.pincode].filter(Boolean).join(', ')),
    reviewRow('Parent / Guardian', a.personal && a.personal.parentName),
    reviewRow('Parent phone', a.personal && a.personal.parentPhone),
  ];

  const academicRows = [
    reviewRow('Qualifying exam', a.academic && a.academic.qualifyingExam),
    reviewRow('Board', a.academic && a.academic.board),
    reviewRow('School', a.academic && a.academic.schoolName),
    reviewRow('Year of passing', a.academic && a.academic.yearOfPassing),
    reviewRow('Register number', a.academic && a.academic.examRegisterNo),
    reviewRow('Overall percentage', a.academic && a.academic.overallPercentage ? a.academic.overallPercentage + '%' : ''),
    reviewRow('Maths / Physics / Chemistry', [a.academic && a.academic.mathsMark, a.academic && a.academic.physicsMark, a.academic && a.academic.chemistryMark].filter(Boolean).join(' / ')),
  ];

  const certRows = CERT_FIELDS.map((cfg) =>
    reviewRow(cfg.label, a.certificates && a.certificates[cfg.name]
      ? '\u2713 ' + a.certificates[cfg.name].originalName
      : '')
  );

  container.append(
    reviewSection('Personal details', personalRows),
    reviewSection('Academic details', academicRows),
    reviewSection('Certificates', certRows)
  );
}

function renderReview() {
  buildSummary($('reviewSummary'));
}

async function register() {
  const btn = $('registerBtn');
  const errBox = $('registerError');
  errBox.hidden = true;
  btn.disabled = true;
  btn.textContent = 'Registering\u2026';

  try {
    const res = await fetch('/api/application/register', { method: 'POST' });
    const data = await res.json();
    if (data.ok) {
      state.app = data.application;
      render();
      return;
    }
    errBox.textContent = data.message || 'Registration failed. Please try again.';
    errBox.hidden = false;
  } catch {
    errBox.textContent = 'Could not reach the server. Please try again.';
    errBox.hidden = false;
  }
  btn.disabled = false;
  btn.textContent = '\uD83D\uDD12 Register';
}

/* ------------------------------ render / init ------------------------------ */

function render() {
  const a = state.app;

  $('userName').textContent = state.user ? state.user.name : 'Student';
  $('userEmail').textContent = state.user ? state.user.email : '\u2014';

  const chip = $('statusChip');
  if (a && a.status === 'registered') {
    chip.textContent = '\u2713 Registered';
    chip.classList.add('ok');
    $('wizardView').hidden = true;
    $('successView').hidden = false;

    $('regNo').textContent = a.registrationNo || '\u2014';
    const submitted = a.submittedAt ? new Date(a.submittedAt.replace(' ', 'T') + 'Z') : null;
    $('regDate').textContent = submitted
      ? 'Submitted on ' + submitted.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      : '';
    buildSummary($('finalSummary'));
    return;
  }

  chip.textContent = 'Draft in progress';
  chip.classList.remove('ok');
  $('wizardView').hidden = false;
  $('successView').hidden = true;

  renderCerts();
  const target = Math.min(state.step, maxStep());
  goStep(target);
}

(async function init() {
  // main.js handles the navbar; this page needs the full application state.
  try {
    const res = await fetch('/api/application');
    const data = await res.json();
    if (!data.ok) {
      window.location.replace('/login.html');
      return;
    }
    state.user = data.user;
    state.app = data.application;
  } catch {
    window.location.replace('/login.html');
    return;
  }

  buildForms();
  fillForm(PERSONAL_FIELDS, state.app.personal);
  fillForm(ACADEMIC_FIELDS, state.app.academic);

  // open the first incomplete step
  const p = state.app.progress || {};
  state.step = !p.personal ? 0 : !p.academic ? 1 : !p.certificates ? 2 : 3;

  render();

  /* ---- wire up events ---- */

  $('personalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (await saveSection('/api/application/personal', PERSONAL_FIELDS, $('personalBtn'))) {
      state.app.progress.personal = true;
      goStep(1);
    }
  });

  $('academicForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (await saveSection('/api/application/academic', ACADEMIC_FIELDS, $('academicBtn'))) {
      state.app.progress.academic = true;
      goStep(2);
    }
  });

  $('certsNextBtn').addEventListener('click', () => goStep(3));

  document.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', () => goStep(Number(btn.dataset.back)));
  });

  document.querySelectorAll('.stepper-item').forEach((item) => {
    item.addEventListener('click', () => {
      const i = Number(item.dataset.step);
      if (i <= maxStep() && !(state.app.status === 'registered')) goStep(i);
    });
  });

  $('confirmCheck').addEventListener('change', (e) => {
    $('registerBtn').disabled = !e.target.checked;
  });

  $('registerBtn').addEventListener('click', register);

  $('copyRegBtn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('regNo').textContent);
      $('copyRegBtn').textContent = 'Copied \u2713';
      setTimeout(() => ($('copyRegBtn').textContent = 'Copy'), 1500);
    } catch {
      /* clipboard unavailable - ignore */
    }
  });
})();
