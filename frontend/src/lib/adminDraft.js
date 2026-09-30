/**
 * Auto-save drafts + backup for the college admin portal (frontend only).
 *
 * Why: while filling a section (branding, home page, contact...) the values live
 * only in React state. Reload, tab switch or a section change threw them away.
 * Now every change is written to a per-college / per-section draft in
 * localStorage, restored when the admin comes back, and cleared once the real
 * "Save" button persists the section.
 *
 * Backup: all of one college's data can be exported to a JSON file and restored
 * later - useful when the browser storage is cleared or a different device /
 * preview URL (different origin = different localStorage) is used.
 */

export const DRAFT_PREFIX = 'tn_admin_draft_'
const COLLEGE_KEY = 'tn_registered_colleges'
const collegeDataKey = collegeId => `tn_college_data_${collegeId}`
const draftKey = (collegeId, section) => `${DRAFT_PREFIX}${collegeId}_${section}`

/* ------------------------------- drafts ------------------------------- */

export function saveAdminDraft(collegeId, section, data) {
  if (!collegeId || !section) return false
  try {
    const payload = { data, savedAt: new Date().toISOString() }
    const json = JSON.stringify(payload)
    localStorage.setItem(draftKey(collegeId, section), json)
    return true
  } catch {
    // storage full (usually because of big data-URL images) - try without megabyte-sized strings
    try {
      const lean = stripHeavyStrings(data)
      localStorage.setItem(draftKey(collegeId, section), JSON.stringify({ data: lean, savedAt: new Date().toISOString(), trimmed: true }))
      return true
    } catch {
      return false
    }
  }
}

export function readAdminDraft(collegeId, section) {
  if (!collegeId || !section) return null
  try {
    const parsed = JSON.parse(localStorage.getItem(draftKey(collegeId, section)) || 'null')
    if (parsed && parsed.data) return parsed
    return null
  } catch { return null }
}

export function clearAdminDraft(collegeId, section) {
  try { localStorage.removeItem(draftKey(collegeId, section)) } catch { /* ignore */ }
}

export function listAdminDrafts(collegeId) {
  const out = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`${DRAFT_PREFIX}${collegeId}_`)) {
        const section = key.slice(`${DRAFT_PREFIX}${collegeId}_`.length)
        const draft = readAdminDraft(collegeId, section)
        if (draft) out.push({ section, savedAt: draft.savedAt })
      }
    }
  } catch { /* ignore */ }
  return out
}

function stripHeavyStrings(value, limit = 120000) {
  if (typeof value === 'string') return value.startsWith('data:') && value.length > limit ? '' : value
  if (Array.isArray(value)) return value.map(v => stripHeavyStrings(v, limit))
  if (value && typeof value === 'object') {
    const out = {}
    for (const k of Object.keys(value)) out[k] = stripHeavyStrings(value[k], limit)
    return out
  }
  return value
}

/* ------------------------------- backup ------------------------------- */

export function buildCollegeBackup(collegeId) {
  const keys = [COLLEGE_KEY, collegeDataKey(collegeId)]
  const data = {}
  keys.forEach(key => {
    const value = localStorage.getItem(key)
    if (value) data[key] = value
  })
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`${DRAFT_PREFIX}${collegeId}_`)) data[key] = localStorage.getItem(key)
    }
  } catch { /* ignore */ }
  return {
    app: 'tn-colleges',
    kind: 'college-backup',
    version: 1,
    collegeId: String(collegeId),
    exportedAt: new Date().toISOString(),
    data
  }
}

export function downloadCollegeBackup(collegeId, collegeName = 'college') {
  const backup = buildCollegeBackup(collegeId)
  const safeName = String(collegeName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'college'
  const stamp = new Date().toISOString().slice(0, 10)
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${safeName}-backup-${stamp}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return backup
}

/**
 * Writes a backup file back into localStorage.
 * @returns {{ ok: boolean, keys?: number, error?: string }}
 */
export function restoreCollegeBackup(backup) {
  if (!backup || typeof backup !== 'object') return { ok: false, error: 'invalid-file' }
  if (backup.kind !== 'college-backup' || !backup.data) return { ok: false, error: 'not-a-college-backup' }
  let keys = 0
  try {
    Object.keys(backup.data).forEach(key => {
      if (!key.startsWith('tn_')) return
      localStorage.setItem(key, backup.data[key])
      keys += 1
    })
  } catch {
    return { ok: false, error: 'storage-full' }
  }
  return { ok: true, keys }
}

/** Reads a backup from a selected File object. */
export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try { resolve(JSON.parse(String(reader.result))) } catch { reject(new Error('invalid-json')) }
    }
    reader.onerror = () => reject(new Error('read-failed'))
    reader.readAsText(file)
  })
}
