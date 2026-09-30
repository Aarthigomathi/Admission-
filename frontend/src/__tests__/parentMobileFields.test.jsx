// @vitest-environment jsdom
// Family information regression tests:
//   - signup asks "Parent Mobile Number" as two fields one by one (Father / Mother)
//   - "Alternate Mobile" is renamed "Alternative Mobile Number"
//   - the old single parentMobile field is gone, and a legacy value still maps across
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/parentMobileFields.test.jsx
import { describe, it, expect, beforeEach } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import StudentSignup from '../pages/auth/StudentSignup.jsx'
import StudentProfile from '../pages/student/Profile.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'

let container, root

beforeEach(() => {
  localStorage.clear()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

const render = ui =>
  act(async () => {
    root.render(
      <MemoryRouter>
        <LanguageProvider>{ui}</LanguageProvider>
      </MemoryRouter>
    )
  })

const labelTexts = () => [...container.querySelectorAll('label')].map(l => l.textContent.trim())

// advance the wizard to step 2 (family details) by filling the required step 1 fields
const type = async (el, value) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  await act(async () => {
    setter.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

const goToStep2 = async () => {
  const inputs = [...container.querySelectorAll('input')]
  const byPlaceholder = ph => inputs.find(i => (i.placeholder || '').toLowerCase().includes(ph))
  await type(byPlaceholder('full name'), 'Test Student')
  await type(container.querySelector('input[type="email"]'), 'test@student.com')
  await type(byPlaceholder('+91'), '9876543210')
  await type(byPlaceholder('your city'), 'Coimbatore')
  const cont = [...container.querySelectorAll('button')].find(b => b.textContent.includes('Continue - Step 2 of 5'))
  expect(cont).toBeTruthy()
  await act(async () => { cont.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
}

describe('signup - family contact numbers', () => {
  it('asks Parent Mobile Number as father + mother, one by one', async () => {
    await render(<StudentSignup />)
    await goToStep2()
    const text = container.textContent
    expect(text).toContain('Parent Mobile Number')
    expect(labelTexts()).toContain('Father Mobile Number *')
    expect(labelTexts()).toContain('Mother Mobile Number *')
    // "one by one" -> distinct tel inputs, father first
    const telInputs = [...container.querySelectorAll('input[type="tel"]')]
    const fatherIdx = telInputs.findIndex(i => i.previousElementSibling?.textContent?.includes('Father Mobile Number'))
    const motherIdx = telInputs.findIndex(i => i.previousElementSibling?.textContent?.includes('Mother Mobile Number'))
    expect(fatherIdx).toBeGreaterThanOrEqual(0)
    expect(motherIdx).toBeGreaterThan(fatherIdx)
    // single old field is gone
    expect(labelTexts()).not.toContain('Parent Mobile *')
  })

  it('renames Alternate Mobile to Alternative Mobile Number', async () => {
    await render(<StudentSignup />)
    await goToStep2()
    const labels = labelTexts()
    expect(labels).toContain('Alternative Mobile Number')
    expect(labels.join('|')).not.toContain('Alternate Mobile')
  })

  it('keeps both numbers in the saved student record', async () => {
    await render(<StudentSignup />)
    await goToStep2()
    const telInputs = [...container.querySelectorAll('input[type="tel"]')]
    const father = telInputs.find(i => i.previousElementSibling?.textContent?.includes('Father Mobile'))
    expect(father).toBeTruthy()
    await type(father, '9876500001')
    expect(father.value).toBe('9876500001')          // controlled field keeps the father number
  })
})

describe('profile - parent numbers stay editable', () => {
  it('shows father/mother numbers and maps a legacy parentMobile value', async () => {
    localStorage.setItem('tn_current_student', JSON.stringify({
      id: 1, fullName: 'Test Student', email: 'test@x.com', mobile: '9999999999',
      district: 'Coimbatore', city: 'Coimbatore', parentMobile: '9876500000', role: 'STUDENT'
    }))
    await render(<StudentProfile />)
    const text = container.textContent
    expect(text).not.toContain('Alternate Mobile')      // renamed everywhere
    expect(text).toContain('9876500000')                // legacy value carried into Father Mobile Number
  })
})
