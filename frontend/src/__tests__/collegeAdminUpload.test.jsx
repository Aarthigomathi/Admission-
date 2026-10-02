// @vitest-environment jsdom
// College admin dashboard regression tests:
//   - narrow screens / preview panes get their own section switcher (the sidebar is lg-only),
//     so "College Logo & Branding" (uploads) is always reachable
//   - logo and hero image upload fields coexist with ten campus image URL fields
//   - the first non-empty campus image URL becomes the hero image when no hero is set
//   - Save Draft / Publish header buttons are wired (they used to do nothing)
//
// Run:  npm test
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'
import { readAdminDraft } from '../lib/adminDraft.js'

const COLLEGE_ID = 999001
const college = {
  id: COLLEGE_ID,
  slug: 'test-college-9001',
  name: 'Test College of Engineering',
  shortName: 'Test College',
  district: 'Coimbatore',
  city: 'Coimbatore',
  type: 'Engineering',
  collegeType: 'Engineering',
  verificationStatus: 'PENDING',
  loginUsername: 'test_admin',
  loginPassword: 'pw123',
  branding: { logo: '', heroImage: '', collegeImages: [], colors: { primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' } }
}

let container, root, alerts

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('tn_registered_colleges', JSON.stringify([college]))
  localStorage.setItem('tn_current_college', JSON.stringify(college))
  alerts = []
  vi.spyOn(window, 'alert').mockImplementation(msg => { alerts.push(String(msg)) })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
})

const render = ui =>
  act(async () => {
    root.render(
      <MemoryRouter>
        <LanguageProvider>{ui}</LanguageProvider>
      </MemoryRouter>
    )
  })

const type = async (el, value) => {
  const proto = el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set
  await act(async () => {
    setter.call(el, value)
    el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }))
  })
}

const click = async el =>
  act(async () => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await Promise.resolve()
  })

const buttonWithText = text =>
  [...container.querySelectorAll('button')].find(b => b.textContent.trim() === text)

const sectionSwitcher = () => container.querySelector('select[aria-label="College admin section"]')
const inputByPlaceholder = fragment =>
  [...container.querySelectorAll('input')].find(i => (i.placeholder || '').toLowerCase().includes(fragment.toLowerCase()))

const storedCustom = () => JSON.parse(localStorage.getItem(`tn_college_data_${COLLEGE_ID}`) || '{}')

describe('college admin - branding uploads', () => {
  it('always offers a section switcher, even when the lg sidebar is hidden', async () => {
    await render(<AdminDashboard />)
    const switcher = sectionSwitcher()
    expect(switcher).toBeTruthy()
    const labels = [...switcher.options].map(o => o.text)
    expect(labels).toContain('College Logo & Branding')
    expect(labels).toContain('Department Pages (KCE Layout)')
    expect(labels.length).toBeGreaterThan(10)
  })

  it('saves logo, campus images and a hero image from the Branding tab', async () => {
    await render(<AdminDashboard />)
    await type(sectionSwitcher(), 'branding')

    const logoInput = inputByPlaceholder('logo url')
    const campusInputs = [...container.querySelectorAll('input[type="url"]')].filter(input => input.placeholder.includes('campus-'))
    const campusInput = inputByPlaceholder('campus-1.jpg')
    const heroInput = inputByPlaceholder('banner image url')
    expect(logoInput).toBeTruthy()
    expect(campusInput).toBeTruthy()
    expect(campusInputs).toHaveLength(10)
    expect(container.textContent).not.toContain('Upload Multiple (Up to 10)')
    expect(heroInput).toBeTruthy()

    await type(logoInput, 'https://testcollege.edu/logo.png')
    await type(campusInput, 'https://testcollege.edu/campus1.jpg')
    await click(buttonWithText('Save Logo & Images'))
    await act(async () => { await new Promise(r => setTimeout(r, 0)) })

    const branding = storedCustom().branding
    expect(branding.logo).toBe('https://testcollege.edu/logo.png')
    expect(branding.collegeImages).toHaveLength(1)
    expect(branding.collegeImages[0].url).toBe('https://testcollege.edu/campus1.jpg')
    // no hero chosen -> first campus image is used, so the dashboard preview is never empty
    expect(branding.heroImage).toBe('https://testcollege.edu/campus1.jpg')
    expect(alerts.some(a => a.includes('Branding saved'))).toBe(true)
  })

  it('keeps an explicitly chosen hero image over the campus fallback', async () => {
    await render(<AdminDashboard />)
    await type(sectionSwitcher(), 'branding')
    await type(inputByPlaceholder('banner image url'), 'https://testcollege.edu/banner.jpg')
    await type(inputByPlaceholder('campus-1.jpg'), 'https://testcollege.edu/campus1.jpg')
    await click(buttonWithText('Save Logo & Images'))
    await act(async () => { await new Promise(r => setTimeout(r, 0)) })
    expect(storedCustom().branding.heroImage).toBe('https://testcollege.edu/banner.jpg')
  })

  it('saves the active unsaved form with Save as Draft and keeps Publish wired', async () => {
    await render(<AdminDashboard />)
    await type(sectionSwitcher(), 'branding')
    await type(inputByPlaceholder('logo url'), 'https://testcollege.edu/logo.png')

    await click(buttonWithText('Save as Draft'))
    expect(readAdminDraft(COLLEGE_ID, 'branding')?.data?.logo).toBe('https://testcollege.edu/logo.png')
    expect(localStorage.getItem(`tn_college_data_${COLLEGE_ID}`)).toBeNull()
    expect(container.textContent).toContain('Draft saved in this browser')

    // Publish remains separate: save the section for real, then publish its saved content.
    await click(buttonWithText('Save Logo & Images'))
    await act(async () => { await new Promise(r => setTimeout(r, 0)) })
    await click(buttonWithText('Publish'))
    await act(async () => { await new Promise(r => setTimeout(r, 0)) })
    expect(alerts.some(a => a.startsWith('Published'))).toBe(true)
  })
})
