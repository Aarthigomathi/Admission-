// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import StudentSignup from '../pages/auth/StudentSignup.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'
import { loadStudentSignupDraftFiles } from '../lib/studentSignupDraft.js'

let container
let root
let originalIndexedDB

function memoryIndexedDB() {
  const databases = new Map()
  const copy = value => JSON.parse(JSON.stringify(value))

  const createDatabase = () => {
    const records = new Map()
    const stores = new Set()
    return {
      objectStoreNames: { contains: name => stores.has(name) },
      createObjectStore(name) { stores.add(name); return {} },
      transaction() {
        let pending = 0
        const transaction = {
          oncomplete: null,
          onerror: null,
          onabort: null,
          objectStore: () => ({
            put(value, key) {
              const request = {}
              pending += 1
              queueMicrotask(() => {
                records.set(key, copy(value))
                request.result = key
                request.onsuccess?.({ target: request })
                pending -= 1
                if (pending === 0) queueMicrotask(() => transaction.oncomplete?.({ target: transaction }))
              })
              return request
            },
            delete(key) {
              const request = {}
              pending += 1
              queueMicrotask(() => {
                records.delete(key)
                request.onsuccess?.({ target: request })
                pending -= 1
                if (pending === 0) queueMicrotask(() => transaction.oncomplete?.({ target: transaction }))
              })
              return request
            },
            clear() {
              const request = {}
              pending += 1
              queueMicrotask(() => {
                records.clear()
                request.onsuccess?.({ target: request })
                pending -= 1
                if (pending === 0) queueMicrotask(() => transaction.oncomplete?.({ target: transaction }))
              })
              return request
            },
            getAllKeys() {
              const request = {}
              pending += 1
              queueMicrotask(() => {
                request.result = [...records.keys()]
                request.onsuccess?.({ target: request })
                pending -= 1
                if (pending === 0) queueMicrotask(() => transaction.oncomplete?.({ target: transaction }))
              })
              return request
            },
            getAll() {
              const request = {}
              pending += 1
              queueMicrotask(() => {
                request.result = [...records.values()].map(copy)
                request.onsuccess?.({ target: request })
                pending -= 1
                if (pending === 0) queueMicrotask(() => transaction.oncomplete?.({ target: transaction }))
              })
              return request
            }
          })
        }
        return transaction
      },
      close() {}
    }
  }

  return {
    open(name) {
      const request = { result: null, onupgradeneeded: null, onsuccess: null, onerror: null }
      queueMicrotask(() => {
        let database = databases.get(name)
        if (!database) {
          database = createDatabase()
          databases.set(name, database)
          request.result = database
          request.onupgradeneeded?.({ target: request })
        }
        request.result = database
        request.onsuccess?.({ target: request })
      })
      return request
    }
  }
}

const renderSignup = async () => {
  await act(async () => {
    root.render(
      <MemoryRouter>
        <LanguageProvider><StudentSignup /></LanguageProvider>
      </MemoryRouter>
    )
  })
}

const typeInput = async (input, value) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  await act(async () => {
    setter.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

const clickButton = async text => {
  const button = [...container.querySelectorAll('button')].find(candidate => candidate.textContent.includes(text))
  expect(button, `Missing button “${text}”. Current page: ${container.textContent.slice(-400)}`).toBeTruthy()
  await act(async () => button.click())
}

beforeEach(() => {
  localStorage.clear()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  originalIndexedDB = globalThis.indexedDB
  Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: memoryIndexedDB() })
})

afterEach(() => {
  if (root) act(() => root.unmount())
  container?.remove()
  if (originalIndexedDB === undefined) delete globalThis.indexedDB
  else Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: originalIndexedDB })
})

describe('student signup draft persistence', () => {
  it('restores entered details and an uploaded certificate after remounting', async () => {
    await renderSignup()
    await typeInput(container.querySelector('input[placeholder="Enter full name as per Aadhar"]'), 'Test Student')
    await typeInput(container.querySelector('input[placeholder="student@email.com"]'), 'test@student.example')
    await typeInput(container.querySelector('input[type="password"]'), 'do-not-save-this')
    await typeInput(container.querySelector('input[placeholder="+91 98765 43210"]'), '9876543210')
    await typeInput(container.querySelector('input[placeholder="Enter your city"]'), 'Coimbatore')
    await clickButton('Continue - Step 2 of 5')
    await clickButton('Continue to Education & Docs')

    const upload = container.querySelector('input[type="file"]')
    const pdf = new File(['%PDF-1.4 saved draft'], 'tenth-marksheet.pdf', { type: 'application/pdf' })
    Object.defineProperty(upload, 'files', { configurable: true, value: [pdf] })
    await act(async () => {
      upload.dispatchEvent(new Event('change', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const draft = JSON.parse(localStorage.getItem('tn_student_signup_draft_v1'))
    expect(draft.formData.fullName).toBe('Test Student')
    expect(draft.formData.city).toBe('Coimbatore')
    expect(draft.formData.password).toBeUndefined()
    expect((await loadStudentSignupDraftFiles()).tenthMarksheet.name).toBe('tenth-marksheet.pdf')

    act(() => root.unmount())
    root = createRoot(container)
    await renderSignup()
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)) })

    expect(container.textContent).toContain('tenth-marksheet.pdf')
    expect(container.querySelector('button[aria-label="View document"]')).toBeTruthy()
    await clickButton('Back')
    await clickButton('Back')
    expect(container.querySelector('input[placeholder="Enter full name as per Aadhar"]').value).toBe('Test Student')
    expect(container.querySelector('input[placeholder="Enter your city"]').value).toBe('Coimbatore')
    expect(container.querySelector('input[type="password"]').value).toBe('')
    expect(container.textContent).toContain('Your details and files auto-save on this device')
  })
})
