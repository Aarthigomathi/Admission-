// Regression tests for the AboutPagesAdmin crash reported in the console:
//   Uncaught TypeError: Cannot read properties of undefined (reading 'profile')
//     at AboutPagesAdmin (AboutPagesAdmin.jsx:160)
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/aboutPagesAdmin.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import AboutPagesAdmin from '../components/admin/AboutPagesAdmin.jsx'

let container
let root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

const type = (el, value) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  setter.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('AboutPagesAdmin', () => {
  it('renders with no stored data', () => {
    act(() => root.render(
      <AboutPagesAdmin collegeId="c1" customData={{}} setCustomData={() => {}} fullCollege={{}} />
    ))
    expect(container.textContent).toContain('About Pages (KCE Layout)')
    expect(container.querySelectorAll('input').length).toBeGreaterThan(0)
  })

  it('renders partial / malformed stored data without crashing', () => {
    const bad = {
      aboutPages: {
        profile: { paragraphs: ['a', 'b'], stats: [null, { value: '15+', label: 'COE' }] },
        vision: { coreValues: [null] },
        management: [null],
        coe: { categories: [null] },
        acc: { mous: [null], electives: [null] },
      },
    }
    act(() => root.render(
      <AboutPagesAdmin collegeId="c1" customData={bad} setCustomData={() => {}} fullCollege={{}} />
    ))
    expect(container.textContent).toContain('About Pages (KCE Layout)')
  })

  it('keeps working after typing into a field (regression: state became undefined)', () => {
    act(() => root.render(
      <AboutPagesAdmin collegeId="c1" customData={{}} setCustomData={() => {}} fullCollege={{}} />
    ))
    const heading = container.querySelector('input')
    act(() => { type(heading, 'My College') })
    expect(container.querySelector('input').value).toBe('My College')
    // component must still be mounted and rendering its groups
    expect(container.textContent).toContain('Profile (About College)')
    expect(container.textContent).toContain('Vision & Mission + Core Values')
  })

  it('adds and removes management members', () => {
    act(() => root.render(
      <AboutPagesAdmin collegeId="c1" customData={{}} setCustomData={() => {}} fullCollege={{}} />
    ))
    const addBtn = [...container.querySelectorAll('button')].find(b => b.textContent.includes('Add Member'))
    act(() => addBtn.click())
    expect(container.textContent).toContain('Member 1')
    act(() => addBtn.click())
    expect(container.textContent).toContain('Member 2')
    const removeBtns = [...container.querySelectorAll('button')].filter(b => b.textContent.includes('Remove'))
    act(() => removeBtns[0].click())
    expect(container.textContent).not.toContain('Member 2')
  })

  it('round-trips stored data back through the form', () => {
    const stored = {
      aboutPages: {
        profile: { heading: 'About Us', paragraphs: ['p1', 'p2'], highlights: ['h1'], stats: [{ value: '15+', label: 'COE' }] },
        vision: { visionText: 'vision', missionBullets: ['m1'], coreValues: [{ title: 'T', text: 'x' }] },
        management: [{ role: 'CHAIRMAN', name: 'A', photo: '', bio: ['bio'] }],
        org: { chartImage: '' },
        coe: { categories: [{ title: 'C', logos: [{ name: 'n', url: 'u' }] }], innovation: { title: 'i', text: ['t'], image: '' } },
        acc: { mous: [{ name: 'm', url: 'u' }], electives: [{ name: 'e', url: 'u' }] },
      },
    }
    act(() => root.render(
      <AboutPagesAdmin collegeId="c1" customData={stored} setCustomData={() => {}} fullCollege={{}} />
    ))
    expect(container.querySelector('input').value).toBe('About Us')
    const ta = [...container.querySelectorAll('textarea')]
    expect(ta.some(t => t.value === 'p1\n\np2')).toBe(true)
    expect(container.textContent).toContain('Member 1')
  })
})
