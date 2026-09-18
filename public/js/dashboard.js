/* Dashboard: load the current user's profile from /api/me. */

(async function initDashboard() {
  let data;
  try {
    const res = await fetch('/api/me');
    data = await res.json();
  } catch {
    window.location.replace('/login.html');
    return;
  }

  if (!data.ok) {
    window.location.replace('/login.html');
    return;
  }

  const user = data.user;

  document.getElementById('userName').textContent = user.name;

  // Avatar with initials, e.g. "Priya Sharma" -> "PS"
  const initials = (user.name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
  document.getElementById('avatar').textContent = initials || '?';

  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profilePhone').textContent = user.phone || '\u2014';

  // SQLite stores UTC "YYYY-MM-DD HH:MM:SS"; append Z so Date parses it as UTC.
  const joined = user.createdAt ? new Date(user.createdAt.replace(' ', 'T') + 'Z') : null;
  document.getElementById('profileJoined').textContent = joined
    ? joined.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '\u2014';
})();
