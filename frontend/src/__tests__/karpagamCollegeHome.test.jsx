// Karpagam College's custom landing page stays as one scroll page and opens
// the admission poster two seconds after the college page is entered.
// @vitest-environment jsdom
import React from 'react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CollegePage from '../pages/college/CollegePage.jsx'
import { getDiscoveryColleges } from '../lib/collegeStorage.js'

let container
let root

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  window.scrollTo = vi.fn()
  vi.useFakeTimers()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root?.unmount())
  vi.useRealTimers()
})

describe('Karpagam College landing page', () => {
  it('is discoverable and puts the ordered sections on one page', async () => {
    expect(getDiscoveryColleges().some((college) => college.slug === 'karpagam-college-of-engineering')).toBe(true)

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/college/karpagam-college-of-engineering']}>
          <Routes>
            <Route path="/college/:slug/:section" element={<CollegePage />} />
            <Route path="/college/:slug" element={<CollegePage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    expect(container.querySelector('main')).toBeTruthy()
    expect([...container.querySelectorAll('main > section')].map((section) => section.id)).toEqual([
      'home',
      'about',
      'programmes',
      'admissions',
      'recruiters',
    ])
    expect(container.textContent).toContain('Address')
    expect(container.textContent).toContain('Admission Support Line')
    expect(container.textContent).toContain('info@kce.ac.in')
    expect(container.querySelector('[role="dialog"]')).toBeNull()
  })

  it('opens the application form from Apply Now and saves the referral details locally', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/college/karpagam-college-of-engineering']}>
          <Routes>
            <Route path="/college/:slug/:section" element={<CollegePage />} />
            <Route path="/college/:slug" element={<CollegePage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    const applyLink = [...container.querySelectorAll('a')].find(link => link.textContent.trim() === 'Apply Now')
    expect(applyLink).toBeTruthy()
    await act(async () => applyLink.click())

    expect(container.textContent).toContain('Karpagam College of Engineering (KCE)')
    expect(container.textContent).toContain('How did you know about our college?')
    expect(container.textContent).toContain('College Admission Portal')
    expect(container.textContent).toContain('KCE Official Website')
    expect(container.textContent).not.toContain('Newspaper Advertisement')
    expect(container.querySelector('main').style.backgroundImage).toContain('karpagam-admission-event-hd.jpg')
    const genderGroup = container.querySelector('fieldset[aria-labelledby="kce-application-gender-label"]')
    expect(genderGroup?.querySelector('#kce-application-gender-label')?.textContent).toContain('Gender')
    const referralGroup = container.querySelector('fieldset[aria-labelledby="kce-application-referral-label"]')
    expect(referralGroup?.querySelector('#kce-application-referral-label')?.textContent).toContain('How did you know about our college?')

    const setValue = (input, value) => {
      const setter = Object.getOwnPropertyDescriptor(input.constructor.prototype, 'value').set
      act(() => {
        setter.call(input, value)
        input.dispatchEvent(new Event('input', { bubbles: true }))
      })
    }
    setValue(container.querySelector('input[name="name"]'), 'Test Applicant')
    setValue(container.querySelector('input[name="email"]'), 'applicant@example.com')
    setValue(container.querySelector('input[name="state"]'), 'Tamil Nadu')
    setValue(container.querySelector('input[name="districtCity"]'), 'Coimbatore')
    await act(async () => container.querySelector('input[name="gender"][value="Female"]').click())
    const googleOption = [...container.querySelectorAll('input[type="checkbox"]')].find(input => input.parentElement.textContent.includes('Google Search'))
    await act(async () => googleOption.click())
    await act(async () => {
      container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const savedApplications = JSON.parse(localStorage.getItem('tn_kce_admission_applications') || '[]')
    expect(savedApplications).toHaveLength(1)
    expect(savedApplications[0]).toMatchObject({ name: 'Test Applicant', email: 'applicant@example.com', districtCity: 'Coimbatore' })
    expect(savedApplications[0].referralSources).toContain('Google Search')
    expect(container.textContent).toContain('Your enquiry details are saved in this browser')
  })

  it('opens the poster after two seconds and allows it to be closed', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/college/karpagam-college-of-engineering']}>
          <Routes>
            <Route path="/college/:slug/:section" element={<CollegePage />} />
            <Route path="/college/:slug" element={<CollegePage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    await act(async () => { await vi.advanceTimersByTimeAsync(1999) })
    expect(container.querySelector('[role="dialog"]')).toBeNull()

    await act(async () => { await vi.advanceTimersByTimeAsync(1) })
    expect(container.querySelector('[role="dialog"]')).toBeTruthy()
    expect(container.querySelector('[data-testid="hero-cta-actions"]')).toBeNull()

    const closeButton = container.querySelector('button[aria-label="Close admission popup"]')
    expect(closeButton).toBeTruthy()
    await act(async () => closeButton.click())
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(container.querySelector('[data-testid="hero-cta-actions"]')).toBeTruthy()
  })

  it('reveals the hero actions when the admission poster is tapped', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/college/karpagam-college-of-engineering']}>
          <Routes>
            <Route path="/college/:slug/:section" element={<CollegePage />} />
            <Route path="/college/:slug" element={<CollegePage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    await act(async () => { await vi.advanceTimersByTimeAsync(2000) })
    const poster = container.querySelector('[role="dialog"] img')
    expect(poster).toBeTruthy()
    await act(async () => poster.click())
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(container.querySelector('[data-testid="hero-cta-actions"]')).toBeTruthy()
  })
})
