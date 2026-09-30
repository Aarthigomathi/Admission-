// @vitest-environment jsdom
// College admin - auto save & backup:
//   - typing in a section is auto-saved as a draft (nothing is lost on reload / nav)
//   - reopening the section restores the draft and tells the admin to press Save
//   - a real Save clears the draft (no stale values come back)
//   - backup export / restore round-trips the college data
//
// Run:  npm test
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'
import {
  readAdminDraft, listAdminDrafts, buildCollegeBackup, restoreCollegeBackup, DRAFT_PREFIX
} from '../lib/adminDraft.js'

const COLLEGE_ID = 999003
const college = {
  id: COLLEGE_ID,
  slug: 'autosave-college-9003',
  name: 'Auto Save Test College',
  shortName: 'AS Test',
  district: 'Coimbatore',
  city: 'Coimbatore',
  type: 'Engineering',
  collegeType: 'Engineering',
  verificationStatus: 'PENDING',
  loginUsername: 'as_admin',
  loginPassword: 'pw123',
  branding: { logo: '', heroImage: '', collegeImages: [], colors: { primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' } }
}

let container, root

const mount = () => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  return act(async () => {
    root.render(
      <MemoryRouter>
        <LanguageProvider><AdminDashboard /></LanguageProvider>
      </MemoryRouter>
    )
  })
}

const unmount = () => {
  act(() => root.unmount())
  container.remove()
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('tn_registered_colleges', JSON.stringify([college]))
  localStorage.setItem('tn_current_college', JSON.stringify(college))
  vi.spyOn(window, 'alert').mockImplementation(() => {})
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  unmount()
  vi.restoreAllMocks()
})

const type = async (el, value) => {
  const proto = el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set
  await act(async () => {
    setter.call(el, value)
    el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }))
  })
}

const click = async el =>
  act(async () => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise(r => setTimeout(r, 0))
  })

const buttonWithText = text =>
  [...container.querySelectorAll('button')].find(b => b.textContent.trim() === text)

const switcher = () => container.querySelector('select[aria-label="College admin section"]')
const inputByPlaceholder = fragment =>
  [...container.querySelectorAll('input')].find(i => (i.placeholder || '').toLowerCase().includes(fragment.toLowerCase()))

const wait = ms => act(async () => { await new Promise(r => setTimeout(r, ms)) })

describe('college admin auto-save', () => {
  it('auto-saves what is typed in a section before it is saved for real', async () => {
    await mount()
    await type(switcher(), 'branding')
    await type(inputByPlaceholder('logo url'), 'https://autosave.edu/logo.png')
    await wait(2300)   // auto-save runs every 2s

    const draft = readAdminDraft(COLLEGE_ID, 'branding')
    expect(draft).toBeTruthy()
    expect(draft.data.logo).toBe('https://autosave.edu/logo.png')
    expect(localStorage.getItem(`tn_college_data_${COLLEGE_ID}`)).toBeNull()   // not saved for real yet
    expect(container.textContent).toContain('Auto-saved')
  })

  it('restores the draft when the section is opened again (reload) and flags it', async () => {
    await mount()
    await type(switcher(), 'branding')
    await type(inputByPlaceholder('logo url'), 'https://autosave.edu/logo.png')
    await wait(2300)
    unmount()

    await mount()
    await type(switcher(), 'branding')
    expect(inputByPlaceholder('logo url').value).toBe('https://autosave.edu/logo.png')
    expect(container.textContent).toContain('Auto-save la irundhu thirumba kondu vandhutom')
  })

  it('clears the draft once the section is really saved', async () => {
    await mount()
    await type(switcher(), 'branding')
    await type(inputByPlaceholder('logo url'), 'https://autosave.edu/logo.png')
    await wait(2300)
    expect(readAdminDraft(COLLEGE_ID, 'branding')).toBeTruthy()

    await click(buttonWithText('Save Logo & Images'))
    await wait(50)
    expect(readAdminDraft(COLLEGE_ID, 'branding')).toBeNull()
    expect(listAdminDrafts(COLLEGE_ID)).toHaveLength(0)
    const saved = JSON.parse(localStorage.getItem(`tn_college_data_${COLLEGE_ID}`) || '{}')
    expect(saved.branding.logo).toBe('https://autosave.edu/logo.png')
  })

  it('keeps a separate draft per section', async () => {
    await mount()
    await type(switcher(), 'branding')
    await type(inputByPlaceholder('logo url'), 'https://autosave.edu/logo.png')
    await wait(2300)
    await type(switcher(), 'contact')
    await type(inputByPlaceholder('Main Campus Road'), '12, College Road, Coimbatore')
    await wait(2300)

    const drafts = listAdminDrafts(COLLEGE_ID)
    expect(drafts.map(d => d.section).sort()).toEqual(['branding', 'contact'])
    expect(readAdminDraft(COLLEGE_ID, 'contact').data.address).toBe('12, College Road, Coimbatore')
  })
})

describe('college data backup & restore', () => {
  it('exports the college data and restores it into an empty browser', async () => {
    localStorage.setItem(`tn_college_data_${COLLEGE_ID}`, JSON.stringify({ branding: { logo: 'https://x.edu/logo.png' } }))
    localStorage.setItem(`${DRAFT_PREFIX}${COLLEGE_ID}_homepage`, JSON.stringify({ data: { tneaCode: '1234' }, savedAt: new Date().toISOString() }))

    const backup = buildCollegeBackup(COLLEGE_ID)
    expect(backup.kind).toBe('college-backup')
    expect(Object.keys(backup.data)).toContain(`tn_college_data_${COLLEGE_ID}`)
    expect(backup.data['tn_registered_colleges']).toContain('Auto Save Test College')

    localStorage.clear()   // simulated: new browser / cleared cache
    const result = restoreCollegeBackup(backup)
    expect(result.ok).toBe(true)
    expect(JSON.parse(localStorage.getItem(`tn_college_data_${COLLEGE_ID}`)).branding.logo).toBe('https://x.edu/logo.png')
    expect(localStorage.getItem('tn_registered_colleges')).toContain('Auto Save Test College')
  })

  it('refuses files that are not a college backup', () => {
    expect(restoreCollegeBackup({ hello: 'world' }).ok).toBe(false)
    expect(restoreCollegeBackup(null).ok).toBe(false)
  })

  it('offers download + restore in the Settings tab', async () => {
    await mount()
    await type(switcher(), 'settings')
    expect(container.textContent).toContain('Backup & Restore')
    expect(buttonWithText('Download Backup (JSON)')).toBeTruthy()
    expect(container.textContent).toContain('Restore from Backup')
    expect(buttonWithText('Check Unsaved Drafts')).toBeTruthy()
  })
})
