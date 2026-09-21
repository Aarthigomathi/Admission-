const token = () => localStorage.getItem('kp_token');

async function call(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token()) headers.Authorization = 'Bearer ' + token();
  const res = await fetch(path, { ...opts, headers });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.status);
  return res.json();
}

export const api = {
  signup: (body) => call('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => call('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  colleges: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return call('/api/colleges' + (q ? '?' + q : ''));
  },
  college: (slug) => call('/api/colleges/' + slug),
  reviews: (slug) => call('/api/colleges/' + slug + '/reviews'),
  addReview: (slug, body) => call('/api/colleges/' + slug + '/reviews', { method: 'POST', body: JSON.stringify(body) }),
  districts: () => call('/api/stats/districts'),
  favs: () => call('/api/favs'),
  toggleFav: (slug) => call('/api/favs/' + slug, { method: 'POST' })
};

export const user = () => {
  try { return JSON.parse(localStorage.getItem('kp_user')); } catch { return null; }
};
export const setUser = (u) => localStorage.setItem('kp_user', JSON.stringify(u));
export const setToken = (t) => localStorage.setItem('kp_token', t);
export const logout = () => { localStorage.removeItem('kp_token'); localStorage.removeItem('kp_user'); };
