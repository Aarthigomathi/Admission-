// Regression tests for the "Add College (New Website)" admin form:
//  - creates a brand new college website with EMPTY departments
//    (no template/default departments may leak into a new college)
//  - validates required fields, password confirm and unique username
//  - lists every added college and can open one
//  - optional logo/hero upload is stored as the college branding
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/addCollegeAdmin.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import AddCollegeAdmin from '../components/admin/AddCollegeAdmin.jsx'
import { getRegisteredColleges, getCollegeById } from '../lib/collegeStorage'

const flush = () => new Promise(r => setTimeout(r, 0))

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  window.alert = vi.fn()
})

const byPlaceholder = (c, ph) => [...c.querySelectorAll('input,select,textarea')].find(el => el.getAttribute('placeholder') === ph)
const setVal = (c, ph, v) => {
  const el = byPlaceholder(c, ph)
  if (!el) throw new Error('field not found: ' + ph)
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set
    setter.call(el, v)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })
}
const clickText = (c, text) => {
  const el = [...c.querySelectorAll('button')].find(b => b.textContent.trim() === text)
  if (!el) throw new Error('button not found: ' + text)
  act(() => { el.click() })
}

const renderForm = (props = {}) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => {
    root.render(
      <MemoryRouter>
        <AddCollegeAdmin {...props} />
      </MemoryRouter>
    )
  })
  return container
}

const fillValid = (c, over = {}) => {
  setVal(c, 'e.g. Kalaignar Karunanidhi College', over.name || 'Test Engineering College')
  setVal(c, 'principal@yourcollege.edu', 'principal@tec.edu')
  setVal(c, '+91 98765 43210', '9876543210')
  setVal(c, 'Full college address', '12 College Road, Sulur')
  setVal(c, 'City', 'Sulur')
  setVal(c, '641004', '641004')
  setVal(c, 'e.g. kce_admin', over.username || 'tec_admin')
  setVal(c, 'Min 4 characters', over.password || 'secret123')
  setVal(c, 'Repeat password', over.password || 'secret123')
}

describe('Add College form (admin)', () => {
  it('creates a new college website with empty departments and no template defaults', async () => {
    const c = renderForm()
    fillValid(c)
    clickText(c, 'Create College Website')
    await flush()

    const colleges = getRegisteredColleges()
    expect(colleges.length).toBe(1)
    const created = colleges[0]
    expect(created.name).toBe('Test Engineering College')
    expect(created.loginUsername).toBe('tec_admin')
    expect(created.loginPassword).toBe('secret123')
    expect(created.verificationStatus).toBe('PENDING')
    expect(Array.isArray(created.departments)).toBe(true)
    expect(created.departments.length).toBe(0)
    expect(created.slug).toMatch(/^test-engineering-college-/)
    expect(getCollegeById(created.id)).toBeTruthy()

    // success panel explains the KCE Academics next step
    expect(c.textContent).toContain('created!')
    expect(c.textContent).toContain('Department Pages (KCE Layout)')
    expect(window.alert).not.toHaveBeenCalled()
  })

  it('switches the dashboard to the new college through onCreated', async () => {
    const onCreated = vi.fn()
    const c = renderForm({ onCreated })
    fillValid(c, { name: 'Another Engineering College', username: 'another_admin' })
    clickText(c, 'Create College Website')
    await flush()

    expect(onCreated).toHaveBeenCalledTimes(1)
    const created = onCreated.mock.calls[0][0]
    expect(created.name).toBe('Another Engineering College')
    expect(created.departments).toEqual([])
  })

  it('refuses to create when a required field is missing', () => {
    const c = renderForm()
    clickText(c, 'Create College Website')
    expect(c.textContent).toContain('College name venum')
    expect(getRegisteredColleges().length).toBe(0)
  })

  it('refuses a password that does not match the confirmation', () => {
    const c = renderForm()
    fillValid(c, { name: 'Mismatch College' })
    setVal(c, 'Repeat password', 'different')
    clickText(c, 'Create College Website')
    expect(c.textContent).toContain('same illai')
    expect(getRegisteredColleges().length).toBe(0)
  })

  it('refuses a username that is already taken', async () => {
    const first = renderForm()
    fillValid(first, { username: 'shared_admin' })
    clickText(first, 'Create College Website')
    await flush()
    expect(getRegisteredColleges().length).toBe(1)

    const c = renderForm()
    fillValid(c, { name: 'Second College', username: 'shared_admin' })
    clickText(c, 'Create College Website')
    expect(c.textContent).toContain('already use aagiduchu')
    expect(getRegisteredColleges().length).toBe(1)
  })

  it('lists every added college and lets the owner open one', async () => {
    const onOpenCollege = vi.fn()
    const c = renderForm({ onOpenCollege })
    fillValid(c, { name: 'Listed College', username: 'listed_admin' })
    clickText(c, 'Create College Website')
    await flush()

    clickText(c, 'Add Another College')
    const listed = getRegisteredColleges()[0]
    expect(c.textContent).toContain(listed.name)
    clickText(c, 'Open Dashboard')
    expect(onOpenCollege).toHaveBeenCalledTimes(1)
    expect(onOpenCollege.mock.calls[0][0].id).toBe(listed.id)
  })

  it('stores an uploaded logo/hero as the new college branding', async () => {
    const c = renderForm()
    fillValid(c, { name: 'Branded College', username: 'branded_admin' })
    const urlFields = [...c.querySelectorAll('input')].filter(el => el.getAttribute('placeholder') === 'or paste image URL')
    expect(urlFields.length).toBeGreaterThan(0)
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(urlFields[0].constructor.prototype, 'value').set
      setter.call(urlFields[0], 'https://example.com/logo.png')
      urlFields[0].dispatchEvent(new Event('input', { bubbles: true }))
    })
    clickText(c, 'Create College Website')
    await flush()

    const created = getRegisteredColleges()[0]
    const raw = JSON.parse(localStorage.getItem('tn_college_data_' + created.id) || '{}')
    expect(raw.branding.logo).toBe('https://example.com/logo.png')
    expect(raw.branding.colors.accent).toBe('#FAB95B')
  })
})
