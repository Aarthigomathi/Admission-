/**
 * API client for the Spring Boot backend.
 *
 * Live mode  : when the backend runs on http://localhost:8080, vite proxies
 *              /api/* to it (see vite.config.js) and these functions return
 *              real API data.
 * Clone mode : when the backend is unreachable (offline / preview), every
 *              function falls back to the cloned seed data in backendData.js
 *              so the frontend always works.
 */
import { backendColleges, backendUsers } from './backendData'

const API_TIMEOUT_MS = 3500

// null = unknown, true = live backend reachable, false = running on clone
let backendOnline = null

function fetchTimeout(url, options = {}, ms = API_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer))
}

export function getBackendStatus() {
  return backendOnline
}

/** GET /api/colleges -> List<College> (falls back to clone) */
export async function fetchColleges() {
  try {
    const res = await fetchTimeout('/api/colleges')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data)) throw new Error('Unexpected response shape')
    backendOnline = true
    return data
  } catch {
    backendOnline = false
    return backendColleges
  }
}

/** GET /api/colleges/{slug} -> College (falls back to clone) */
export async function fetchCollegeBySlug(slug) {
  try {
    const res = await fetchTimeout(`/api/colleges/${encodeURIComponent(slug)}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    backendOnline = true
    return await res.json()
  } catch {
    backendOnline = false
    return backendColleges.find(c => c.slug === slug) || null
  }
}

/** GET /api/colleges/{slug}/courses -> List<Course> (falls back to clone) */
export async function fetchCoursesForSlug(slug) {
  try {
    const res = await fetchTimeout(`/api/colleges/${encodeURIComponent(slug)}/courses`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    backendOnline = true
    return await res.json()
  } catch {
    backendOnline = false
    const college = backendColleges.find(c => c.slug === slug)
    return college ? (college.courses || []).filter(c => c.active !== false) : []
  }
}

/**
 * POST /api/auth/login -> { token, role, collegeId, email, fullName }
 * Falls back to the cloned users table (same credentials as DataInitializer).
 */
export async function apiLogin(email, password) {
  try {
    const res = await fetchTimeout('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    backendOnline = true
    return { source: 'live', ...(await res.json()) }
  } catch {
    backendOnline = false
    const user = backendUsers.find(u => u.email.toLowerCase() === String(email || '').trim().toLowerCase())
    if (!user || user.password !== password) return null
    return {
      source: 'clone',
      token: `clone-session-${user.id}`,
      role: user.role,
      collegeId: user.collegeId != null ? user.collegeId : '',
      email: user.email,
      fullName: user.fullName,
    }
  }
}
