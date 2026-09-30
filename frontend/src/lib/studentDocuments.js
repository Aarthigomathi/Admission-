/**
 * Student certificates & documents - frontend only storage.
 *
 * Files are read in the browser and kept as data URLs in localStorage so a
 * student can open, preview, zoom and download them again after signup.
 * Images are compressed before saving; PDFs are kept as-is with a size guard.
 */

export const MAX_FILE_BYTES = 4 * 1024 * 1024          // reject anything above 4 MB
export const TARGET_IMAGE_BYTES = 600 * 1024           // images aim for ~600 KB after compression
export const IMAGE_MAX_DIM = 1600
export const IMAGE_QUALITY = 0.8
export const ACCEPTED_MIME = 'application/pdf,image/jpeg,image/png,image/webp'

// Single source of truth for the 10 certificate slots (labels come from t(labelKey))
export const STUDENT_DOCUMENTS = [
  { key: 'tenthMarksheet', labelKey: 'tenthMarksheet', desc: 'SSLC Original', required: true },
  { key: 'twelfthMarksheet', labelKey: 'twelfthMarksheet', desc: 'HSC Original', required: true },
  { key: 'tc', labelKey: 'tc', desc: 'School / College TC', required: true },
  { key: 'communityCertificate', labelKey: 'communityCertificate', desc: 'BC / MBC / SC / ST', required: true },
  { key: 'incomeCertificate', labelKey: 'incomeCertificate', desc: 'For scholarship', required: false },
  { key: 'aadharCard', labelKey: 'aadharCard', desc: 'ID Proof', required: true },
  { key: 'photo', labelKey: 'photo', desc: 'Recent Photo', required: true },
  { key: 'nativityCertificate', labelKey: 'nativityCertificate', desc: 'TN Nativity', required: false },
  { key: 'firstGraduateCertificate', labelKey: 'firstGraduateCertificate', desc: 'First graduate', required: false },
  { key: 'specialReservation', labelKey: 'specialReservation', desc: 'Sports / PH', required: false }
]

export const docMeta = key => STUDENT_DOCUMENTS.find(d => d.key === key)

export const documentsKey = studentId => `tn_student_docs_${studentId}`

export const isImageDoc = doc => !!doc && (/^data:image\//.test(doc.dataUrl || '') || /^image\//.test(doc.type || ''))
export const isPdfDoc = doc => !!doc && (/^data:application\/pdf/.test(doc.dataUrl || '') || /pdf/i.test(doc.type || '') || /\.pdf$/i.test(doc.name || ''))
export const hasFile = doc => !!(doc && doc.dataUrl)

export function formatFileSize(bytes) {
  const n = Number(bytes) || 0
  if (n <= 0) return '-'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

const base64Bytes = dataUrl => Math.round(((dataUrl || '').length * 3) / 4)

export function documentsByteSize(docs) {
  return Object.values(docs || {}).reduce((total, doc) => total + base64Bytes(doc?.dataUrl), 0)
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === 'undefined') { reject(new Error('unsupported')); return }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('read-failed'))
    reader.readAsDataURL(file)
  })
}

/** Shrink an image so 10 certificates still fit comfortably in localStorage */
async function compressImageFile(file) {
  const original = await readAsDataUrl(file)
  if (typeof Image === 'undefined' || typeof document === 'undefined') return original
  return await new Promise(resolve => {
    let settled = false
    const done = value => { if (!settled) { settled = true; resolve(value) } }
    const timer = setTimeout(() => done(original), 4000)     // never block the UI on a stuck decode
    const img = new Image()
    img.onload = () => {
      clearTimeout(timer)
      try {
        const scale = Math.min(1, IMAGE_MAX_DIM / Math.max(img.width || 1, img.height || 1))
        const width = Math.max(1, Math.round((img.width || 1) * scale))
        const height = Math.max(1, Math.round((img.height || 1) * scale))
        if (scale === 1 && base64Bytes(original) <= TARGET_IMAGE_BYTES) { done(original); return }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { done(original); return }
        ctx.drawImage(img, 0, 0, width, height)
        done(canvas.toDataURL('image/jpeg', IMAGE_QUALITY))
      } catch {
        done(original)
      }
    }
    img.onerror = () => { clearTimeout(timer); done(original) }
    img.src = original
  })
}

/**
 * Read a picked file into a stored document.
 * Throws: no-file | unsupported | too-large
 */
export async function prepareDocument(file) {
  if (!file) throw new Error('no-file')
  const type = file.type || ''
  const name = file.name || 'document'
  const isPdf = type === 'application/pdf' || /\.pdf$/i.test(name)
  const isImage = /^image\//.test(type) || /\.(jpe?g|png|webp)$/i.test(name)
  if (!isPdf && !isImage) throw new Error('unsupported')
  if (file.size > MAX_FILE_BYTES) throw new Error('too-large')

  const dataUrl = isImage ? await compressImageFile(file) : await readAsDataUrl(file)
  if (!dataUrl) throw new Error('read-failed')
  return {
    name,
    type: isPdf ? 'application/pdf' : (type || 'image/jpeg'),
    size: base64Bytes(dataUrl),
    originalSize: file.size || base64Bytes(dataUrl),
    dataUrl,
    uploadedAt: new Date().toISOString()
  }
}

/** Read stored documents. Legacy records kept only the file name (string). */
export function getStudentDocuments(studentId) {
  if (!studentId) return {}
  try {
    const raw = JSON.parse(localStorage.getItem(documentsKey(studentId)) || '{}')
    const out = {}
    Object.entries(raw || {}).forEach(([key, value]) => {
      if (!value) return
      if (typeof value === 'string') out[key] = { name: value, nameOnly: true }
      else out[key] = value
    })
    return out
  } catch { return {} }
}

export function saveStudentDocuments(studentId, docs) {
  if (!studentId) return { ok: false, error: 'no-student' }
  try {
    localStorage.setItem(documentsKey(studentId), JSON.stringify(docs || {}))
    return { ok: true }
  } catch (error) {
    const quota = error && (error.name === 'QuotaExceededError' || error.code === 22 || error.code === 1014)
    return { ok: false, error: quota ? 'quota' : 'unknown' }
  }
}

/**
 * Save, and if the browser storage is full drop the optional documents first
 * (then the largest ones) so the important certificates always survive.
 */
export function saveStudentDocumentsWithFallback(studentId, docs) {
  const first = saveStudentDocuments(studentId, docs)
  if (first.ok) return { ok: true, docs, dropped: [] }

  const kept = { ...docs }
  const dropped = []
  const optional = STUDENT_DOCUMENTS.filter(d => !d.required).map(d => d.key)
  const sizes = key => base64Bytes(kept[key]?.dataUrl)
  const candidates = [
    ...optional.filter(key => kept[key]),
    ...STUDENT_DOCUMENTS.filter(d => d.required).map(d => d.key).filter(key => kept[key]).sort((a, b) => sizes(b) - sizes(a))
  ]
  for (const key of candidates) {
    delete kept[key]
    dropped.push(key)
    if (saveStudentDocuments(studentId, kept).ok) return { ok: true, docs: kept, dropped }
  }
  return { ok: false, docs: {}, dropped, error: first.error }
}

export function documentsSummary(studentId) {
  const docs = getStudentDocuments(studentId)
  const uploaded = STUDENT_DOCUMENTS.filter(d => docs[d.key]?.name).length
  const withFile = STUDENT_DOCUMENTS.filter(d => hasFile(docs[d.key])).length
  const missingRequired = STUDENT_DOCUMENTS.filter(d => d.required && !docs[d.key]?.name)
  return { docs, uploaded, withFile, total: STUDENT_DOCUMENTS.length, missingRequired }
}

/** data: URL -> Blob URL (needed to open PDFs / download without hitting data-URL limits) */
export function documentBlobUrl(doc) {
  if (!doc?.dataUrl) return ''
  try {
    const [header, payload] = doc.dataUrl.split(',')
    const mime = (header.match(/data:([^;]+)/) || [])[1] || doc.type || 'application/octet-stream'
    const binary = header.includes('base64') ? atob(payload) : decodeURIComponent(payload)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return URL.createObjectURL(new Blob([bytes], { type: mime }))
  } catch { return '' }
}

export function downloadDocument(doc) {
  if (!doc) return
  const url = documentBlobUrl(doc)
  if (!url) return
  const link = document.createElement('a')
  link.href = url
  link.download = doc.name || 'document'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

/** Keep the student record (counts + names) in sync with the stored files */
export function syncStudentDocumentCounters(studentId, docs) {
  const count = STUDENT_DOCUMENTS.filter(d => docs[d.key]?.name).length
  const names = {}
  const meta = {}
  Object.entries(docs || {}).forEach(([key, doc]) => {
    if (!doc?.name) return
    names[key] = doc.name
    meta[key] = { name: doc.name, uploadedAt: doc.uploadedAt || '', size: doc.size || 0, type: doc.type || '' }
  })

  const patch = { documentsUploaded: count, documentNames: names, documents: meta }
  try {
    const students = JSON.parse(localStorage.getItem('tn_students') || '[]')
    const next = students.map(s => (String(s.id) === String(studentId) ? { ...s, ...patch } : s))
    localStorage.setItem('tn_students', JSON.stringify(next))
  } catch { /* storage full - the document files themselves are already saved */ }

  try {
    const current = JSON.parse(localStorage.getItem('tn_current_student') || 'null')
    if (current && String(current.id) === String(studentId)) {
      localStorage.setItem('tn_current_student', JSON.stringify({ ...current, ...patch }))
    }
  } catch { /* ignore */ }

  if (typeof window !== 'undefined') window.dispatchEvent(new Event('studentDocsUpdated'))
  return count
}
