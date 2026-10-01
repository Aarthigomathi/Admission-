// Regression tests for the home page cleanups requested during the build-up:
//   - no search bar / "Search Real" button in the hero
//   - no "POPULAR - REAL" chips line
//   - no district grid section on the home page (districts live in the header dropdown + /search filter)
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/homePageSections.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import PlatformHome from '../pages/platform/Home.jsx'
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

describe('home page', () => {
  it('hero has no search bar and no popular chips', async () => {
    await render(<PlatformHome />)
    const text = container.textContent
    expect(text).not.toContain('Search Real')
    expect(text.toLowerCase()).not.toContain('popular - real')
    expect(text).not.toContain('Real images from psgtech.edu')
    expect(container.querySelector('input[placeholder*="Search name/course"]')).toBeNull()
    expect(text).toContain('most trusted')
  })

  it('has no district grid section (districts stay in the header dropdown)', async () => {
    await render(<PlatformHome />)
    expect(container.querySelector('#districts')).toBeNull()
    expect(container.querySelectorAll('a[href*="district="]').length).toBe(0)
    expect(container.textContent).not.toContain('Districts Covered')
    expect(container.textContent).not.toContain('district by district')
  })

  it('hero has no signup / login CTA buttons', async () => {
    await render(<PlatformHome />)
    const hero = container.firstElementChild.children[0]   // hero block, before the Three Roles section
    expect(hero.textContent).toContain('most trusted')
    expect(hero.textContent).not.toContain('Sign Up')      // the CTA labels are gone (paragraph keeps "SIGN UP")
    expect(hero.textContent).not.toContain('Login')
    expect(hero.querySelector('a[href="/student/signup"]')).toBeNull()
    expect(hero.querySelector('a[href="/college/signup"]')).toBeNull()
    expect(hero.querySelector('a[href="/login"]')).toBeNull()
  })

  it('has no college-type filter chip bar', async () => {
    await render(<PlatformHome />)
    const chipLabels = ['All Real', 'Engineering Real', 'Arts & Science', 'Management', 'Medical']
    const buttons = [...container.querySelectorAll('button')].map(b => b.textContent.trim())
    chipLabels.forEach(label => expect(buttons).not.toContain(label))
    expect(buttons.some(label => /^(All Real|Engineering Real|Arts & Science|Management|Medical)$/.test(label))).toBe(false)
    expect(container.textContent).not.toContain('Verified Platform')
    expect(container.textContent).not.toContain('All Types')
  })

  it('shows starter listings without a no-colleges placeholder or how-it-works flow sections', async () => {
    await render(<PlatformHome />)
    const text = container.textContent
    expect(text).not.toContain('No Colleges Yet')
    expect(text).not.toContain('Automatic Default College Name Kattama')
    expect(text).not.toContain('How it works - Automatic Default')
    expect(text).not.toContain('How It Works - Complete Flows')
    expect(text).not.toContain('Student Flow - Multi-step Signup')
    expect(text).not.toContain('College Flow - Verification')
    expect(text).not.toContain('Platform Admin Flow - Analytics')
    expect(text).not.toContain('Colleges - No Default')
    expect(text).toContain('Tamil Nadu Colleges to Explore - 6 Listings')
    expect(text).toContain('PSG College of Technology')
    expect(text).not.toContain('Colleges Added by Colleges Themselves')
  })

  it('adds college-submitted profiles alongside the starter directory', async () => {
    localStorage.setItem('tn_registered_colleges', JSON.stringify([{
      id: 9001,
      slug: 'demo-check-college',
      name: 'Demo Check College',
      shortName: 'Demo Check',
      district: 'Coimbatore',
      city: 'Coimbatore',
      type: 'Engineering',
      courses: [],
      departments: [],
      branding: {}
    }]))
    await render(<PlatformHome />)
    expect(container.textContent).toContain('Tamil Nadu Colleges to Explore - 7 Listings')
    expect(container.textContent).toContain('Demo Check College')
  })
})
