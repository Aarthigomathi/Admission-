const FORM_DRAFT_KEY = 'tn_student_signup_draft_v1'
const FILES_DB_NAME = 'tn_student_signup_draft_files'
const FILES_DB_VERSION = 1
const FILES_STORE_NAME = 'documents'

/**
 * Signup text is kept on this device. Never persist the password in a draft.
 */
export function loadStudentSignupDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(FORM_DRAFT_KEY) || 'null')
    if (!draft || typeof draft !== 'object' || !draft.formData || typeof draft.formData !== 'object') return null

    const step = Number(draft.step)
    return {
      step: Number.isInteger(step) && step >= 1 && step <= 5 ? step : 1,
      formData: draft.formData
    }
  } catch {
    return null
  }
}

export function saveStudentSignupDraft({ step, formData }) {
  try {
    const safeFormData = { ...(formData || {}) }
    delete safeFormData.password
    localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify({
      version: 1,
      step: Number.isInteger(step) && step >= 1 && step <= 5 ? step : 1,
      formData: safeFormData,
      savedAt: new Date().toISOString()
    }))
    return { ok: true }
  } catch {
    return { ok: false, error: 'storage-unavailable' }
  }
}

export function clearStudentSignupDraft() {
  try {
    localStorage.removeItem(FORM_DRAFT_KEY)
    return true
  } catch {
    return false
  }
}

function openFilesDatabase() {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('indexeddb-unavailable'))

  return new Promise((resolve, reject) => {
    let request
    try {
      request = indexedDB.open(FILES_DB_NAME, FILES_DB_VERSION)
    } catch (error) {
      reject(error)
      return
    }

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(FILES_STORE_NAME)) {
        database.createObjectStore(FILES_STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('indexeddb-open-failed'))
    request.onblocked = () => reject(new Error('indexeddb-blocked'))
  })
}

async function writeFilesTransaction(operation) {
  let database
  try {
    database = await openFilesDatabase()
    return await new Promise(resolve => {
      let transaction
      try {
        transaction = database.transaction(FILES_STORE_NAME, 'readwrite')
        operation(transaction.objectStore(FILES_STORE_NAME))
      } catch (error) {
        resolve({ ok: false, error: error?.name || 'indexeddb-write-failed' })
        return
      }

      transaction.oncomplete = () => resolve({ ok: true })
      transaction.onerror = () => resolve({ ok: false, error: transaction.error?.name || 'indexeddb-write-failed' })
      transaction.onabort = () => resolve({ ok: false, error: transaction.error?.name || 'indexeddb-write-failed' })
    })
  } catch (error) {
    return { ok: false, error: error?.name || 'indexeddb-unavailable' }
  } finally {
    database?.close()
  }
}

/** Persist one certificate before reporting its upload as complete. */
export function saveStudentSignupDraftFile(docKey, file) {
  if (!docKey || !file?.dataUrl) return Promise.resolve({ ok: false, error: 'invalid-file' })
  return writeFilesTransaction(store => store.put(file, docKey))
}

export function removeStudentSignupDraftFile(docKey) {
  if (!docKey) return Promise.resolve({ ok: false, error: 'invalid-file' })
  return writeFilesTransaction(store => store.delete(docKey))
}

export function loadStudentSignupDraftFiles() {
  return openFilesDatabase().then(async database => {
    try {
      const transaction = database.transaction(FILES_STORE_NAME, 'readonly')
      const store = transaction.objectStore(FILES_STORE_NAME)
      // Issue both reads together while the transaction is active.
      const keysRequest = store.getAllKeys()
      const filesRequest = store.getAll()
      const [keys, files] = await Promise.all([
        new Promise((resolve, reject) => {
          keysRequest.onsuccess = () => resolve(keysRequest.result || [])
          keysRequest.onerror = () => reject(keysRequest.error || new Error('indexeddb-read-failed'))
        }),
        new Promise((resolve, reject) => {
          filesRequest.onsuccess = () => resolve(filesRequest.result || [])
          filesRequest.onerror = () => reject(filesRequest.error || new Error('indexeddb-read-failed'))
        })
      ])

      return keys.reduce((result, key, index) => {
        const file = files[index]
        if (file?.dataUrl && file?.name) result[String(key)] = file
        return result
      }, {})
    } finally {
      database.close()
    }
  })
}

export function clearStudentSignupDraftFiles() {
  return writeFilesTransaction(store => store.clear())
}
