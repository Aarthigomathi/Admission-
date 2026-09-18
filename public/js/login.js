/* Login page: validate, POST /api/login, redirect to the dashboard. */

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const formError = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');

function showError(msg) {
  formError.textContent = msg;
  formError.hidden = false;
}

function hideError() {
  formError.hidden = true;
}

// Already logged in? Skip the form and go to the dashboard.
fetch('/api/me')
  .then((r) => r.json())
  .then((d) => {
    if (d.ok) window.location.replace('/dashboard.html');
  })
  .catch(() => {});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showError('Please enter both email and password.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in\u2026';

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.ok) {
      window.location.href = '/dashboard.html';
      return;
    }
    showError(data.message || 'Login failed. Please try again.');
  } catch {
    showError('Could not reach the server. Please try again.');
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Log In';
});
