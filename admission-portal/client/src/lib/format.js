/** Formatting helpers shared across the portal. */

export function inr(value, { compact = false } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return '—';
  if (compact || n >= 100000) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)} L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  }
  return `₹${n.toLocaleString('en-IN')}`;
}

export function num(value, fallback = '—') {
  const n = Number(value);
  return Number.isFinite(n) && n !== 0 ? n.toLocaleString('en-IN') : fallback;
}

export function pct(value, digits = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toFixed(digits)}%` : '—';
}

export function dateLabel(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function dateTimeLabel(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(value) {
  if (!value) return '';
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (Number.isNaN(seconds)) return '';
  if (seconds < 60) return 'just now';
  const units = [
    ['minute', 60],
    ['hour', 3600],
    ['day', 86400],
    ['month', 2592000],
    ['year', 31536000],
  ];
  let label = 'just now';
  for (const [name, secs] of units) {
    if (seconds >= secs) label = `${Math.floor(seconds / secs)} ${name}${Math.floor(seconds / secs) > 1 ? 's' : ''} ago`;
  }
  return label;
}

/** Compact number formatting for hero stats: 8530 → 8.5K */
export function compact(value) {
  const n = Number(value) || 0;
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(n);
}

/** Accept arrays or comma/JSON strings (tag fields) and always return an array. */
export function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === '') return [];
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* fall through to comma split */
      }
    }
    return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function initials(text) {
  return String(text || '')
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w[0] || ''))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function seatTone(available, intake) {
  if (!intake) return 'muted';
  const ratio = available / intake;
  if (available <= 0) return 'danger';
  if (ratio <= 0.15) return 'warn';
  return 'ok';
}

export function statusBadgeClass(status) {
  switch (status) {
    case 'Open':
      return 'badge-green';
    case 'Closing Soon':
      return 'badge-amber';
    case 'Few Seats Left':
      return 'badge-red';
    case 'Closed':
      return 'badge-gray';
    case 'Coming Soon':
      return 'badge-blue';
    case 'Submitted':
    case 'New':
      return 'badge-blue';
    case 'Under Review':
    case 'In Progress':
      return 'badge-amber';
    case 'Shortlisted':
    case 'Interview Scheduled':
      return 'badge-teal';
    case 'Provisionally Selected':
    case 'Confirmed':
    case 'Responded':
      return 'badge-green';
    case 'Waitlisted':
      return 'badge-amber';
    case 'Rejected':
      return 'badge-red';
    default:
      return 'badge-gray';
  }
}

export function youtubeId(url) {
  const match = String(url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{6,})/i);
  return match ? match[1] : null;
}

export function isVideo(url) {
  return Boolean(youtubeId(url)) || /\.(mp4|webm|ogg|mov)$/i.test(String(url));
}
