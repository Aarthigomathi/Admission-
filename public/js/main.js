/* Shared behaviour: navbar login state, logout, password toggles, footer year. */

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])
  );
}

async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } catch {
    /* ignore - we redirect anyway */
  }
  window.location.href = '/';
}

(async function initNav() {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Show/hide password toggles (used on the auth pages)
  document.querySelectorAll('.toggle-password').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Hide' : 'Show';
    });
  });

  // Navbar: swap Login/Sign Up for Dashboard/Logout when logged in
  const navAuth = document.getElementById('navAuth');
  if (!navAuth) return;

  try {
    const res = await fetch('/api/me');
    const data = await res.json();
    if (!data.ok) return;

    const firstName = escapeHtml((data.user.name || 'Student').trim().split(/\s+/)[0]);
    const onDashboard = window.location.pathname.startsWith('/dashboard');

    navAuth.innerHTML = onDashboard
      ? '<span class="user-chip">&#128075; ' + firstName + '</span>' +
        '<button type="button" class="btn btn-primary" id="logoutBtn">Logout</button>'
      : '<a href="/dashboard.html" class="btn btn-ghost">Dashboard</a>' +
        '<button type="button" class="btn btn-primary" id="logoutBtn">Logout</button>';

    document.getElementById('logoutBtn').addEventListener('click', logout);
  } catch {
    /* server unreachable - keep the default Login / Sign Up buttons */
  }
})();
