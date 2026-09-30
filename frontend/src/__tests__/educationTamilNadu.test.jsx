// @vitest-environment jsdom
// Signup step 3 ("Education & Original Documents") - Tamil Nadu education rules:
//   - 11th is gone from the education level choices
//   - 10th / 12th ask for a Tamil Nadu school board
//   - Diploma / Undergraduate / Postgraduate ask for a Tamil Nadu university (own district first)
//   - school / college name field suggests Tamil Nadu institutions
//
// Run:  npm test   (or npx vitest run src/__tests__/educationTamilNadu.test.jsx)
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import StudentSignup from '../pages/auth/StudentSignup.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'
import { EDUCATION_LEVELS } from '../lib/tnEducation.js'

let container, root

beforeEach(() => {
  localStorage.clear()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
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
  })

const buttonWithText = text =>
  [...container.querySelectorAll('button')].find(b => b.textContent.trim() === text)

// walk the wizard up to step 3
const goToStep3 = async () => {
  const inputs = [...container.querySelectorAll('input')]
  const byPlaceholder = ph => inputs.find(i => (i.placeholder || '').toLowerCase().includes(ph))
  await type(byPlaceholder('full name'), 'Test Student')
  await type(container.querySelector('input[type="email"]'), 'test@student.com')
  await type(byPlaceholder('+91'), '9876543210')
  await type(byPlaceholder('your city'), 'Coimbatore')
  await click(buttonWithText('Continue - Step 2 of 5'))
  await click(buttonWithText('Continue to Education & Docs'))
  expect(container.textContent).toContain('Education & Original Documents')
}

const levelButtons = () =>
  [...container.querySelectorAll('button')]
    .map(b => b.textContent.trim())
    .filter(text => EDUCATION_LEVELS.includes(text) || text === '11th')

const qualificationSelect = () =>
  [...container.querySelectorAll('select')].find(s => [...s.options].some(o => o.text === 'Tamil Nadu State Board'))
  || [...container.querySelectorAll('select')].find(s => [...s.options].some(o => o.text.startsWith('Anna University')))
  || [...container.querySelectorAll('select')].find(s => [...s.options].some(o => o.text === 'Other University / Board'))

const optionTexts = select => [...select.options].map(o => o.text)
const labelFor = select => select.closest('div')?.querySelector('label')?.textContent?.trim()
const institutionInput = () => container.querySelector('input[list="tnInstitutionSuggestions"]')

describe('signup step 3 - Tamil Nadu education', () => {
  it('drops 11th and keeps the 10th / 12th / Diploma / UG / PG choices', async () => {
    await render(<StudentSignup />)
    await goToStep3()
    const levels = levelButtons()
    expect(levels).not.toContain('11th')
    expect(levels).toEqual(EDUCATION_LEVELS)
    expect(levels).toContain('10th')
    expect(levels).toContain('12th')
    expect(levels).toContain('Postgraduate')
  })

  it('asks for a Tamil Nadu board for 10th and 12th', async () => {
    await render(<StudentSignup />)
    await goToStep3()
    const select = qualificationSelect()
    expect(labelFor(select)).toBe('Board of Education')
    const options = optionTexts(select)
    expect(options).toContain('Tamil Nadu State Board')
    expect(options).toContain('CBSE')
    expect(options.some(o => o.startsWith('Anna University'))).toBe(false)

    await click(buttonWithText('10th'))
    expect(labelFor(qualificationSelect())).toBe('Board of Education')
  })

  it('asks for a Tamil Nadu university for Diploma / UG / PG, own district first', async () => {
    await render(<StudentSignup />)
    await goToStep3()
    await click(buttonWithText('Undergraduate'))
    const select = qualificationSelect()
    expect(labelFor(select)).toBe('University')
    const options = optionTexts(select)
    expect(options).toContain('Anna University, Chennai')
    expect(options.some(o => o.startsWith('Madurai Kamaraj University'))).toBe(true)
    // district (Coimbatore by default) is listed first and is the selected value
    expect(options[0]).toBe('Bharathiar University, Coimbatore')
    expect(select.value).toBe('Bharathiar University, Coimbatore')
    expect(options).not.toContain('Tamil Nadu State Board')

    await click(buttonWithText('Postgraduate'))
    expect(labelFor(qualificationSelect())).toBe('University')
    expect(optionTexts(qualificationSelect())).toContain('Anna University, Chennai')
  })

  it('suggests Tamil Nadu school / college names, district first', async () => {
    await render(<StudentSignup />)
    await goToStep3()
    const input = institutionInput()
    expect(input).toBeTruthy()
    const datalist = container.querySelector('datalist')
    const names = [...datalist.querySelectorAll('option')].map(o => o.getAttribute('value'))
    expect(names).toContain('PSG Public Schools, Peelamedu')          // Coimbatore school, listed first
    expect(names).toContain('Government Higher Secondary School, Sulur')
    expect(names.some(n => n.includes('Anna University'))).toBe(false) // schools only while on 12th

    // picking a chip fills the field
    const chip = [...container.querySelectorAll('button[title]')].find(b => b.getAttribute('title') === 'PSG Public Schools, Peelamedu')
    expect(chip).toBeTruthy()
    await click(chip)
    expect(institutionInput().value).toBe('PSG Public Schools, Peelamedu')

    // switching to UG swaps the suggestions to Tamil Nadu colleges
    await click(buttonWithText('Undergraduate'))
    const collegeNames = [...container.querySelector('datalist').querySelectorAll('option')].map(o => o.getAttribute('value'))
    expect(collegeNames).toContain('PSG College of Technology')
    expect(collegeNames).toContain('Coimbatore Institute of Technology')
    expect(collegeNames).toContain('Anna University (CEG Campus), Guindy')
    expect(collegeNames).not.toContain('PSG Public Schools, Peelamedu')
  })

  it('uses quiet, formal copy (no "Mark potta odaney" phrasing)', async () => {
    await render(<StudentSignup />)
    await goToStep3()
    const text = container.textContent
    expect(text).not.toContain('Mark potta odaney')
    expect(text).not.toContain('Auto %')
    expect(text).toContain('Enter your marks and the percentage is calculated automatically. Upload your original documents below.')
    expect(text).toContain('Marks and Percentage Calculation')
  })

  it('offers year of passing from 2000 up to the latest year', async () => {
    await render(<StudentSignup />)
    await goToStep3()
    const select = [...container.querySelectorAll('select')].find(s => [...s.options].some(o => o.text === '2000'))
    expect(select).toBeTruthy()
    const years = [...select.options].map(o => Number(o.text))
    expect(years).toContain(2000)
    expect(years).toContain(2026)
    expect(years.length).toBeGreaterThanOrEqual(27)                    // 2000 .. 2026
    expect(years[0]).toBe(Math.max(new Date().getFullYear(), 2026))     // latest year first
    expect(years[years.length - 1]).toBe(2000)                          // goes down to 2000
    expect(years).toEqual([...years].sort((a, b) => b - a))
  })
})
