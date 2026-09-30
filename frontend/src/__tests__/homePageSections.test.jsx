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

  it('keeps the signup / login entry points', async () => {
    await render(<PlatformHome />)
    const text = container.textContent
    expect(text).toContain('Student Sign Up')
    expect(text).toContain('Login - 3 Roles')
  })

  it('has no college-type filter chip bar', async () => {
    await render(<PlatformHome />)
    const chipLabels = ['All Real', 'Engineering Real', 'Arts & Science', 'Management', 'Medical']
    const buttons = [...container.querySelectorAll('button')].map(b => b.textContent.trim())
    chipLabels.forEach(label => expect(buttons).not.toContain(label))
    expect(buttons.length).toBe(0)                    // the chip bar was the only button group here
    expect(container.textContent).not.toContain('Verified Platform')
    expect(container.textContent).not.toContain('All Types')
  })
})
