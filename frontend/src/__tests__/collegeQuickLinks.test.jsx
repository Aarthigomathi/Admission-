// @vitest-environment jsdom
// Quick Links Row (icons strip above footer - KCE style) end-to-end:
//   - admin Home Page tab saves "Label | URL" lines (max 6)
//   - the public college home page renders them as the icon strip
//   - empty = default KCE quick links
//
// Run:  npm test
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import CollegePage from '../pages/college/CollegePage.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'

const COLLEGE_ID = 999002
const SLUG = 'quick-links-college-9002'
const college = {
  id: COLLEGE_ID,
  slug: SLUG,
  name: 'Quick Links Test College',
  shortName: 'QL Test',
  district: 'Coimbatore',
  city: 'Coimbatore',
  type: 'Engineering',
  collegeType: 'Engineering',
  verificationStatus: 'PENDING',
  loginUsername: 'ql_admin',
  loginPassword: 'pw123',
  branding: { logo: '', heroImage: '', collegeImages: [], colors: { primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' } }
}

let container, root

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('tn_registered_colleges', JSON.stringify([college]))
  localStorage.setItem('tn_current_college', JSON.stringify(college))
  vi.spyOn(window, 'alert').mockImplementation(() => {})
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
      <MemoryRouter initialEntries={[`/college/${SLUG}`]}>
        <LanguageProvider>
          <Routes>
            <Route path="/college/:slug" element={ui} />
          </Routes>
        </LanguageProvider>
      </MemoryRouter>
    )
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

const flush = async () => act(async () => { await new Promise(r => setTimeout(r, 0)) })

const buttonWithText = text =>
  [...container.querySelectorAll('button')].find(b => b.textContent.trim() === text)

const quickLinksTextarea = () =>
  [...container.querySelectorAll('textarea')].find(t => (t.placeholder || '').includes('Vidya Lakshmi Portal'))

describe('college quick links row', () => {
  it('saves Label | URL lines from the admin Home Page tab', async () => {
    await render(<AdminDashboard />)
    await type(container.querySelector('select[aria-label="College admin section"]'), 'homepage')
    const box = quickLinksTextarea()
    expect(box).toBeTruthy()

    await type(box, ['Admission Enquiries | #contact', 'National Digital Library | https://ndl.in', 'Vidya Lakshmi Portal | https://vidyalakshmi.gov.in'].join('\n'))
    await click(buttonWithText('Save Home Page Setup - Real-time Update'))
    await flush()

    const stored = JSON.parse(localStorage.getItem(`tn_college_data_${COLLEGE_ID}`) || '{}')
    expect(stored.homePage.quickLinks).toEqual([
      'Admission Enquiries | #contact',
      'National Digital Library | https://ndl.in',
      'Vidya Lakshmi Portal | https://vidyalakshmi.gov.in'
    ])
  })

  it('renders the saved links as the quick links strip on the public page', async () => {
    await render(<AdminDashboard />)
    await type(container.querySelector('select[aria-label="College admin section"]'), 'homepage')
    await type(quickLinksTextarea(), ['Admission Enquiries | #contact', 'National Digital Library | https://ndl.in'].join('\n'))
    await click(buttonWithText('Save Home Page Setup - Real-time Update'))
    await flush()
    act(() => root.unmount())
    container.remove()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await render(<CollegePage />)
    const anchors = [...container.querySelectorAll('a')]
    const admission = anchors.find(a => a.textContent.includes('Admission Enquiries'))
    const ndl = anchors.find(a => a.textContent.includes('National Digital Library'))
    expect(admission).toBeTruthy()
    expect(admission.getAttribute('href')).toBe('#contact')
    expect(ndl).toBeTruthy()
    expect(ndl.getAttribute('href')).toBe('https://ndl.in')
    expect(ndl.getAttribute('target')).toBe('_blank')
  })

  it('falls back to the default KCE quick links when nothing is saved', async () => {
    await render(<CollegePage />)
    const text = container.textContent
    expect(text).toContain('Vidya Lakshmi Portal')
    expect(text).toContain('National Digital Library')
    expect(text).toContain('Anti Ragging Committee')
  })

})

describe('quick links - tolerant parsing (real-world input)', () => {
  it('parses Label - URL, bare URLs, anchors and numbered lines', async () => {
    localStorage.setItem('tn_college_data_' + COLLEGE_ID, JSON.stringify({
      homePage: { quickLinks: [
        '1. Admission Enquiries - #contact',
        'https://ndl.in',
        '#alumni',
        'Scholarship Portal | https://scholarships.gov.in | globe',
        'Placement Cell | https://example.edu/placements'
      ] }
    }))
    await render(<CollegePage />)
    const anchors = [...container.querySelectorAll('a')]
    const find = txt => anchors.find(a => a.textContent.includes(txt))
    expect(find('Admission Enquiries')?.getAttribute('href')).toBe('#contact')
    expect(find('ndl.in')?.getAttribute('href')).toBe('https://ndl.in')
    expect(find('alumni')?.getAttribute('href')).toBe('#alumni')
    expect(find('Scholarship Portal')?.getAttribute('href')).toBe('https://scholarships.gov.in')
    expect(find('Placement Cell')?.getAttribute('href')).toBe('https://example.edu/placements')
    // the two labels that have no explicit icon get a keyword icon
    const ndlIcon = find('ndl.in')?.querySelector('svg')
    expect(ndlIcon).toBeTruthy()
  })

  it('accepts an older single-string value saved by a previous version', async () => {
    localStorage.setItem('tn_college_data_' + COLLEGE_ID, JSON.stringify({
      homePage: { quickLinks: 'Admission Enquiries | #contact\nAnti Ragging Committee | https://antiraggingccimc.in' }
    }))
    await render(<CollegePage />)
    const text = container.textContent
    expect(text).toContain('Admission Enquiries')
    expect(text).toContain('Anti Ragging Committee')
    expect(text).not.toContain('Vidya Lakshmi Portal')   // custom list replaces the defaults
  })

  it('caps the strip at 6 links', async () => {
    const many = Array.from({ length: 9 }, (_, i) => `Link ${i + 1} | https://example.edu/${i + 1}`)
    localStorage.setItem('tn_college_data_' + COLLEGE_ID, JSON.stringify({ homePage: { quickLinks: many } }))
    await render(<CollegePage />)
    const strip = [...container.querySelectorAll('a')].filter(a => /^Link \d+$/.test(a.textContent.trim()))
    expect(strip).toHaveLength(6)
  })

  it('shows a live preview in the admin while typing', async () => {
    await render(<AdminDashboard />)
    await type(container.querySelector('select[aria-label="College admin section"]'), 'homepage')
    expect(container.textContent).toContain('Live preview - icons strip above footer')
    expect(container.textContent).toContain('default KCE links')

    await type(quickLinksTextarea(), ['Admission Enquiries | #contact', 'National Digital Library | https://ndl.in'].join('\n'))
    await flush()
    expect(container.textContent).toContain('2/6')
    const labelSpan = [...container.querySelectorAll('span')].find(sp => sp.textContent.trim() === 'National Digital Library')
    expect(labelSpan).toBeTruthy()
    const hrefSpan = [...container.querySelectorAll('span')].find(sp => sp.textContent.trim() === 'https://ndl.in')
    expect(hrefSpan).toBeTruthy()   // preview also shows where the link points
  })
})
