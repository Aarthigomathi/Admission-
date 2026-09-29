// HOD profile helpers - shared by the Department page and the Academics page.

// Titles to ignore when building the monogram: "Dr. Ramesh Kumar" -> "RK"
const HOD_TITLES = ['dr', 'prof', 'professor', 'mr', 'mrs', 'ms', 'miss', 'shri', 'sri', 'thiru', 'er', 'adv']

// Professional monogram shown when the department has no HOD photo yet.
export function hodInitials(name) {
  const words = String(name || '').split(/\s+/).map(w => w.trim()).filter(Boolean)
  const meaningful = words.filter(w => !HOD_TITLES.includes(w.replace(/\./g, '').toLowerCase()))
  const source = meaningful.length > 0 ? meaningful : words
  return source.slice(0, 2).map(w => (w[0] || '').toUpperCase()).join('') || 'H'
}
