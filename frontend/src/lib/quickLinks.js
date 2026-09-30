/**
 * Quick Links Row (icons strip above footer - KCE style).
 *
 * Admin stores one line per link in the format `Label | URL` (max 6).
 * This module turns whatever is stored (array of strings, a single string,
 * already-parsed objects - including data saved by older versions) into a
 * clean, render-ready list, and falls back to the default KCE quick links
 * when nothing is set.
 *
 * Icon names: link | user | book | cap | users | landmark | briefcase | globe | phone | building
 */

export const QUICK_LINK_DEFAULTS = [
  { label: 'Vidya Lakshmi Portal', icon: 'user', href: 'https://vidyalakshmi.gov.in' },
  { label: 'National Digital Library', icon: 'book', href: 'https://ndl.in' },
  { label: 'Student Alumni', icon: 'cap', href: '#alumni' },
  { label: 'Anti Ragging Committee', icon: 'users', href: 'https://antiraggingccimc.in' },
  { label: 'Admission Enquiries', icon: 'landmark', href: '#contact' }
]

export const QUICK_LINK_MAX = 6
export const QUICK_LINK_ICON_NAMES = ['link', 'user', 'book', 'cap', 'users', 'landmark', 'briefcase', 'globe', 'phone', 'building']

const KEYWORD_ICONS = [
  [/admission|enquir|apply|counselling/i, 'landmark'],
  [/library|digital library|\bndl\b|journal/i, 'book'],
  [/alumni|batch|graduat/i, 'cap'],
  [/anti[ -]?ragging|committee|grievance|complaint|icc\b|women/i, 'users'],
  [/placement|career|recruit|internship|training/i, 'briefcase'],
  [/scholarship|fee|vidya ?lakshmi|portal|govt|government|nsp\b/i, 'globe'],
  [/contact|phone|helpline|enquiry number|call/i, 'phone'],
  [/hostel|campus|infrastructure|tour|facilit/i, 'building'],
  [/student|login|dashboard|portal login/i, 'user']
]

export function quickLinkIconName(label, explicitIcon = '') {
  const wanted = String(explicitIcon || '').trim().toLowerCase()
  if (QUICK_LINK_ICON_NAMES.includes(wanted)) return wanted
  const text = String(label || '')
  for (const [pattern, icon] of KEYWORD_ICONS) {
    if (pattern.test(text)) return icon
  }
  return 'link'
}

/** One stored line -> { label, icon, href } (or null when the line is empty). */
function parseQuickLink(entry) {
  if (entry && typeof entry === 'object') {
    const label = String(entry.label || entry.title || '').trim()
    if (!label) return null
    const icon = quickLinkIconName(label, entry.icon)
    const href = String(entry.href || entry.url || '#').trim() || '#'
    return { label, icon, href }
  }

  const text = String(entry || '').trim()
    .replace(/^\d+[).\]]\s*/, '')          // "1. Label | url"
    .replace(/^[-*•]\s*/, '')              // "- Label | url"
  if (!text) return null

  const parts = text.split('|').map(p => p.trim()).filter(Boolean)
  let label = ''
  let href = ''
  let icon = ''

  if (parts.length >= 2) {
    label = parts[0]
    href = parts[1]
    icon = parts[2] || ''
  } else if (/^https?:\/\//i.test(text)) {
    href = text
    label = text.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '')
  } else if (/^#\S+$/.test(text)) {
    href = text
    label = text.slice(1).replace(/[-_]+/g, ' ')
  } else if (/\s+-\s+/.test(text)) {
    const [left, right] = text.split(/\s+-\s+/)
    label = left.trim()
    href = (right || '').trim()
  } else {
    const urlMatch = text.match(/(https?:\/\/\S+|#\S+)/)
    if (urlMatch) {
      href = urlMatch[1]
      label = text.replace(urlMatch[1], '').trim().replace(/[-|,]+$/, '').trim()
    } else {
      label = text
      href = '#'
    }
  }

  if (!label && !href) return null
  if (!label) label = href.replace(/^https?:\/\//i, '')
  if (!href) href = '#'
  return { label, icon: quickLinkIconName(label, icon), href }
}

/**
 * Normalise anything stored for quick links.
 * @param {Array|string|undefined} raw stored value
 * @param {{ fallbackToDefaults?: boolean }} options
 */
export function normalizeQuickLinks(raw, { fallbackToDefaults = true } = {}) {
  let list = []
  if (Array.isArray(raw)) list = raw
  else if (typeof raw === 'string' && raw.trim()) list = raw.split(/\r?\n/)

  const parsed = list.map(parseQuickLink).filter(Boolean).slice(0, QUICK_LINK_MAX)
  if (parsed.length > 0) return parsed
  return fallbackToDefaults ? QUICK_LINK_DEFAULTS.slice(0, QUICK_LINK_MAX) : []
}

/** Count of links the admin actually typed (used for the "empty = default" hint). */
export function countQuickLinks(text) {
  if (!text) return 0
  const list = Array.isArray(text) ? text : String(text).split(/\r?\n/)
  return list.filter(line => String(line || '').trim()).slice(0, QUICK_LINK_MAX).length
}
