/**
 * API client + realtime socket.
 *
 * All requests are relative ("/api/...") so the same build works behind the
 * Vite dev proxy and in single-port production mode.
 */
import { io } from 'socket.io-client';

const TOKEN_KEY = 'cc_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (token) => (token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY));
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, auth = false, raw = false, headers = {} } = {}) {
  const options = { method, headers: { ...headers } };
  if (body instanceof FormData) {
    options.body = body;
  } else if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  if (auth || getToken()) {
    const token = getToken();
    if (token) options.headers.Authorization = `Bearer ${token}`;
  }

  // accept both "/api/..." full paths and "/auth/..." relative paths
  const url = path.startsWith('/api/') || path === '/api' ? path : `/api${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, options);
  if (raw) return res;
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text.slice(0, 200) };
  }
  if (!res.ok) {
    if (res.status === 401 && auth) clearToken();
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  }
  return data;
}

const qs = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'All') search.set(key, value);
  });
  const str = search.toString();
  return str ? `?${str}` : '';
};

export const api = {
  /* ---------------- public / student ---------------- */
  stats: () => request('/public/stats'),
  meta: () => request('/public/meta'),
  colleges: (params) => request(`/public/colleges${qs(params)}`),
  college: (slug) => request(`/public/colleges/${slug}`),
  collegesBySlug: (slug, id) => request(`/public/colleges/${slug}/courses/${id}`),
  liveSeats: (params) => request(`/public/seats/live${qs(params)}`),
  updates: (limit = 25) => request(`/public/updates?limit=${limit}`),
  topRecruiters: (limit = 18) => request(`/public/recruiters/top?limit=${limit}`),
  enquire: (payload) => request('/public/enquiries', { method: 'POST', body: payload }),
  apply: (payload) => request('/public/applications', { method: 'POST', body: payload }),
  track: (params) => request(`/public/applications/track${qs(params)}`),

  /* ---------------- college auth ---------------- */
  verifyDomain: (website) => request('/auth/verify-domain', { method: 'POST', body: { website } }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (identifier, password) => request('/auth/login', { method: 'POST', body: { identifier, password } }),
  me: () => request('/auth/me', { auth: true }),
  changePassword: (payload) => request('/auth/change-password', { method: 'POST', body: payload, auth: true }),
  logout: () => request('/auth/logout', { method: 'POST', auth: true }).catch(() => ({})),
  security: () => request('/auth/security', { auth: true }),

  /* ---------------- college dashboard ---------------- */
  dashboard: () => request('/college/me', { auth: true }),
  updateProfile: (payload) => request('/college/profile', { method: 'PUT', body: payload, auth: true }),
  completeness: () => request('/college/completeness', { auth: true }),
  statsDashboard: () => request('/college/stats', { auth: true }),
  importWebsite: (payload) => request('/college/website-import', { method: 'POST', body: payload, auth: true }),
  applyImport: (payload) => request('/college/website-import/apply', { method: 'POST', body: payload, auth: true }),
  sections: () => request('/college/entities', { auth: true }),
  sectionRows: (section) => request(`/college/entities/${section}`, { auth: true }),
  createRow: (section, payload) => request(`/college/entities/${section}`, { method: 'POST', body: payload, auth: true }),
  updateRow: (section, id, payload) => request(`/college/entities/${section}/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteRow: (section, id) => request(`/college/entities/${section}/${id}`, { method: 'DELETE', auth: true }),
  bulkRows: (section, rows, mode = 'append') =>
    request(`/college/entities/${section}/bulk`, { method: 'POST', body: { rows, mode }, auth: true }),
  applications: (params) => request(`/college/applications${qs(params)}`, { auth: true }),
  updateApplication: (id, payload) => request(`/college/applications/${id}`, { method: 'PUT', body: payload, auth: true }),
  enquiries: (params) => request(`/college/enquiries${qs(params)}`, { auth: true }),
  updateEnquiry: (id, payload) => request(`/college/enquiries/${id}`, { method: 'PUT', body: payload, auth: true }),
  updateSeats: (payload) => request('/college/seats', { method: 'POST', body: payload, auth: true }),
  activity: (limit = 40) => request(`/college/activity?limit=${limit}`, { auth: true }),
  publish: (status) => request('/college/publish', { method: 'POST', body: { status }, auth: true }),
  upload: (file, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    return request('/college/uploads', { method: 'POST', body: form, auth: true });
  },
  applicationsCsvUrl: () => '/api/college/applications.csv',
};

/** Download the applications CSV with the auth header applied via a blob. */
export async function downloadApplicationsCsv() {
  const res = await request('/college/applications.csv', { auth: true, raw: true });
  if (!res.ok) throw new ApiError('Could not export applications', res.status);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ *
 * Realtime
 * ------------------------------------------------------------------ */
let socket = null;
export function getSocket() {
  if (!socket) {
    socket = io('/', { path: '/socket.io', transports: ['websocket', 'polling'], reconnectionDelay: 800 });
  }
  return socket;
}

/** Subscribe to an event and return an unsubscribe function. */
export function on(event, handler) {
  const s = getSocket();
  s.on(event, handler);
  return () => s.off(event, handler);
}

export function joinCollegeRoom(collegeId) {
  if (collegeId) getSocket().emit('college:join', collegeId);
}
export function joinTrackRoom(applicationNo) {
  if (applicationNo) getSocket().emit('track:join', applicationNo);
}
