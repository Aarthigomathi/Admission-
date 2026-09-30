// @vitest-environment jsdom
// Signup step 1 regression tests:
//   - Dream Course field sits directly below City inside the Basic Information card
//   - professional, quiet copy (no "Below City" / "Enna padikka aasa..." / "kattama")
//   - labels use the muted slate treatment instead of loud uppercase navy
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/signupDreamCourse.test.jsx
import { describe, it, expect, beforeEach } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import StudentSignup from '../pages/auth/StudentSignup.jsx'
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

const fieldLabelFor = input => {
  const wrapper = input.closest('div')
  return wrapper?.querySelector('label')?.textContent || ''
}

describe('student signup - step 1', () => {
  it('places the Dream Course picker right after the City field', async () => {
    await render(<StudentSignup />)
    const labels = [...container.querySelectorAll('label')]
    const cityLabel = labels.find(l => l.textContent.includes('City'))
    expect(cityLabel).toBeTruthy()

    const dreamSelect = container.querySelector('#dreamCourse')
    expect(dreamSelect).toBeTruthy()
    expect(fieldLabelFor(dreamSelect)).toContain('Dream Course')

    // order check: City label appears before the Dream Course label in the DOM
    const dreamLabel = labels.find(l => l.textContent.includes('Dream Course'))
    expect(dreamLabel).toBeTruthy()
    expect(cityLabel.compareDocumentPosition(dreamLabel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    // it is a required select, filled with the shared option list
    expect(dreamSelect.required).toBe(true)
    expect(dreamSelect.value).toBe('B.E Computer Science')
    expect([...dreamSelect.querySelectorAll('option')].length).toBeGreaterThanOrEqual(15)
  })

  it('uses quiet professional copy - no old placeholder phrasing', async () => {
    await render(<StudentSignup />)
    const text = container.textContent
    expect(text).not.toContain('Below City')
    expect(text).not.toContain('Enna padikka')
    expect(text).not.toContain('kattama')
    expect(text).not.toContain('Dream course at signup itself')
    expect(text).toContain('What would you like to study?')
    expect(text).toContain('Basic details')
    expect(text).toContain('Study Preferences')
  })

  it('gives fields a muted label treatment instead of loud uppercase navy', async () => {
    await render(<StudentSignup />)
    const labels = [...container.querySelectorAll('label')]
    expect(labels.length).toBeGreaterThan(5)
    labels.slice(0, 8).forEach(l => {
      expect(l.className).toContain('text-[#547792]')
      expect(l.className).not.toContain('uppercase text-[#1A3263]')
    })
    // the loud gold step pill is gone from the heading
    expect(container.querySelector('h2').textContent).not.toContain('Step 1 of 5')
    expect(container.textContent).toContain('Step 1 of 5')   // still shown as a quiet eyebrow
  })
})
