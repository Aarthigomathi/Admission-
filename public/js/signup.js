/* Sign up page: client-side validation, POST /api/signup, redirect to dashboard. */

const signupForm = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const formError = document.getElementById('formError');

const FIELD_IDS = ['name', 'email', 'phone', 'password', 'confirmPassword'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s]{7,15}$/;

function setFieldError(id, msg) {
  const errEl = document.getElementById('err-' + id);
  const input = document.getElementById(id);
  if (errEl) errEl.textContent = msg || '';
  if (input) input.classList.toggle('input-invalid', Boolean(msg));
}

function clearErrors() {
  formError.hidden = true;
  FIELD_IDS.forEach((f) => setFieldError(f, ''));
}

// Already logged in? Skip the form and go to the dashboard.
fetch('/api/me')
  .then((r) => r.json())
  .then((d) => {
    if (d.ok) window.location.replace('/dashboard.html');
  })
  .catch(() => {});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const values = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    password: document.getElementById('password').value,
    confirmPassword: document.getElementById('confirmPassword').value,
  };

  // --- client-side validation (same rules as the server) ---
  let valid = true;
  if (values.name.length < 2) {
    setFieldError('name', 'Please enter your full name.');
    valid = false;
  }
  if (!EMAIL_RE.test(values.email)) {
    setFieldError('email', 'Please enter a valid email address.');
    valid = false;
  }
  if (!PHONE_RE.test(values.phone)) {
    setFieldError('phone', 'Please enter a valid phone number.');
    valid = false;
  }
  if (values.password.length < 6) {
    setFieldError('password', 'Password must be at least 6 characters.');
    valid = false;
  }
  if (values.password !== values.confirmPassword) {
    setFieldError('confirmPassword', 'Passwords do not match.');
    valid = false;
  }
  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating account\u2026';

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (data.ok) {
      window.location.href = '/dashboard.html';
      return;
    }

    if (data.errors) {
      Object.entries(data.errors).forEach(([field, msg]) => setFieldError(field, msg));
    } else if (data.message) {
      formError.textContent = data.message;
      formError.hidden = false;
    }
  } catch {
    formError.textContent = 'Could not reach the server. Please try again.';
    formError.hidden = false;
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Create Account';
});
