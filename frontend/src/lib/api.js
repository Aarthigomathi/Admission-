const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
const AUTH_TOKEN_KEY = 'tn_auth_token'

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export function getAuthToken() {
  try { return localStorage.getItem(AUTH_TOKEN_KEY) || '' } catch { return '' }
}

export function saveAuthSession(session) {
  if (!session?.token) return
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, session.token)
    localStorage.setItem('tn_auth_session', JSON.stringify({
      token: session.token,
      role: session.role,
      userId: session.userId,
      studentId: session.studentId,
      collegeId: session.collegeId,
      email: session.email,
      fullName: session.fullName
    }))
  } catch { /* the UI can still use its local demo mode if storage is unavailable */ }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem('tn_auth_session')
  } catch { /* ignore storage restrictions */ }
}

export async function apiRequest(path, options = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${API_BASE_URL}${normalizedPath}`
  const headers = new Headers(options.headers || {})
  const token = getAuthToken()
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)

  let body = options.body
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  if (body !== undefined && body !== null && typeof body !== 'string' && !isFormData) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(url, { ...options, headers, body })
  } catch (error) {
    throw new ApiError('The backend is not reachable. Start the backend service and try again.', 0, error)
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '')
  if (!response.ok) {
    const message = payload?.error || payload?.message || `Request failed (${response.status})`
    throw new ApiError(message, response.status, payload)
  }
  return payload
}

export function isBackendUnavailable(error) {
  return error instanceof ApiError && error.status === 0
}

export const api = {
  health: () => apiRequest('/health'),
  getColleges: (params = {}) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value != null && value !== ''))
    return apiRequest(`/colleges${query.size ? `?${query}` : ''}`)
  },
  getCollege: slug => apiRequest(`/colleges/${encodeURIComponent(slug)}`),
  getPublicCollegeSections: slug => apiRequest(`/colleges/${encodeURIComponent(slug)}/sections`),
  login: credentials => apiRequest('/auth/login', { method: 'POST', body: credentials }),
  register: details => apiRequest('/auth/register', { method: 'POST', body: details }),
  trackActivity: activity => apiRequest('/activity/track', { method: 'POST', body: activity }),
  createEnquiry: enquiry => apiRequest('/enquiries', { method: 'POST', body: enquiry }),
  getStudentEnquiries: studentId => apiRequest(`/enquiries/student/${encodeURIComponent(studentId)}`),
  getStudentWorkspace: () => apiRequest('/students/me/workspace'),
  saveStudentWorkspace: workspace => apiRequest('/students/me/workspace', { method: 'PUT', body: workspace }),
  getStudentProfile: () => apiRequest('/students/me'),
  updateStudentProfile: profile => apiRequest('/students/me', { method: 'PUT', body: profile }),
  getCollegeSections: collegeId => apiRequest(`/admin/college/${encodeURIComponent(collegeId)}/sections`),
  saveCollegeSection: (collegeId, sectionKey, content) => apiRequest(
    `/admin/college/${encodeURIComponent(collegeId)}/sections/${encodeURIComponent(sectionKey)}`,
    { method: 'PUT', body: { content } }
  )
}
