import { api, isBackendUnavailable } from './api'

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch { return [] }
}

function mergeById(serverItems, localItems) {
  const merged = new Map()
  for (const item of [...(Array.isArray(serverItems) ? serverItems : []), ...(Array.isArray(localItems) ? localItems : [])]) {
    if (item && item.id != null) merged.set(String(item.id), item)
  }
  return Array.from(merged.values())
}

export async function syncStudentWorkspace() {
  if (!localStorage.getItem('tn_auth_token')) return false
  const workspace = {
    savedColleges: readList('tn_saved_colleges'),
    comparedColleges: readList('tn_compare_colleges')
  }
  try {
    await api.saveStudentWorkspace(workspace)
    return true
  } catch (error) {
    if (!isBackendUnavailable(error)) console.warn('[StudentWorkspace] Backend sync failed:', error.message)
    return false
  }
}

export async function hydrateStudentWorkspace() {
  if (!localStorage.getItem('tn_auth_token')) return false
  try {
    const server = await api.getStudentWorkspace()
    const savedColleges = mergeById(server.savedColleges, readList('tn_saved_colleges'))
    const comparedColleges = mergeById(server.comparedColleges, readList('tn_compare_colleges'))
    localStorage.setItem('tn_saved_colleges', JSON.stringify(savedColleges))
    localStorage.setItem('tn_compare_colleges', JSON.stringify(comparedColleges))
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('studentWorkspaceLoaded'))
    // Also upload any browser-only items merged into the server response.
    await syncStudentWorkspace()
    return true
  } catch {
    return false
  }
}
