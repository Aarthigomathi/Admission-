// Regression tests for the header redesign + 3-role login flow:
//   - header shows "Demo", no "College Sign Up", always-visible Tamil/English toggle, 38 districts
//   - Demo / shield open the 3-role login modal (Student / College / Platform Admin)
//   - modal "Login" goes to /login?role=... and "Demo View" enters that role's dashboard
//   - /login?role=admin&demo=1 preselects the role and fills demo credentials
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/roleLoginHeader.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import PlatformHeader from '../components/platform/PlatformHeader.jsx'
import Login from '../pages/auth/Login.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'
import { districts } from '../lib/colleges.js'

let container, root

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
  document.body.style.overflow = ''
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  if (root) act(() => root.unmount())
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

function LocationProbe({ onChange }) {
  const loc = useLocation()
  onChange(loc.pathname + loc.search)
  return null
}

const renderAt = (initialPath, ui) => {
  let current = initialPath
  act(() => {
    root.render(
      <MemoryRouter initialEntries={[initialPath]}>
        <LanguageProvider>
          <LocationProbe onChange={p => { current = p }} />
          {ui}
        </LanguageProvider>
      </MemoryRouter>
    )
  })
  return () => current
}

const click = el => act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
const byText = (text, tag = 'button') =>
  [...document.body.querySelectorAll(tag)].find(el => el.textContent.trim().includes(text))

describe('header matches the new design', () => {
  it('has Demo button, no College Sign Up, always-visible language toggle, 38 districts', () => {
    renderAt('/', <PlatformHeader />)
    const text = container.textContent

    expect(text).toContain('Discover • Decide • Dream')
    expect(byText('Demo')).toBeTruthy()
    expect(text).not.toContain('College Sign Up')
    // language toggle always visible (no student needed)
    expect(byText('English', 'button')).toBeTruthy()
    expect(byText('தமிழ்', 'button')).toBeTruthy()
    // district dropdown full list
    const options = [...container.querySelectorAll('select')][0]
    expect([...options.querySelectorAll('option')].length).toBe(districts.length + 1)
  })
})

describe('demo button opens 3 logins', () => {
  it('shows the role picker in a viewport-level dialog above the sticky header', () => {
    renderAt('/', <PlatformHeader />)
    click(byText('Demo'))
    const dialog = document.body.querySelector('[role="dialog"]')
    const text = document.body.textContent
    expect(text).toContain('3 Logins')
    expect(text).toContain('Student Login')
    expect(text).toContain('College Login')
    expect(text).toContain('Platform Admin')
    expect(dialog).toBeTruthy()
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(container.contains(dialog)).toBe(false) // rendered outside the sticky/backdrop-filter header
    expect(dialog.className).toContain('max-h-')
    expect(byText('Student Login')).toBeTruthy()   // Login button per role
    expect(byText('College Login')).toBeTruthy()
    expect(byText('Platform Admin')).toBeTruthy()
    // demo buttons per role
    expect([...document.body.querySelectorAll('button')].filter(b => b.textContent.includes('Demo View')).length).toBe(3)
  })

  it('Login button routes to /login?role=college', () => {
    const getPath = renderAt('/', <PlatformHeader />)
    click(byText('Demo'))
    click(byText('College Login'))
    expect(getPath()).toBe('/login?role=college')
  })

  it('Demo View logs the student straight into the dashboard', () => {
    const getPath = renderAt('/', <PlatformHeader />)
    click(byText('Demo'))
    const studentDemo = [...document.body.querySelectorAll('button')].find(b => b.textContent.includes('Demo View'))
    click(studentDemo)
    expect(getPath()).toBe('/student/dashboard')
    const stored = JSON.parse(localStorage.getItem('tn_current_student') || 'null')
    expect(stored?.isDemo).toBe(true)
    expect(stored?.fullName).toBe('Demo Student')
  })

  it('shield button also opens the 3 logins (platform admin demo goes inside)', () => {
    const getPath = renderAt('/', <PlatformHeader />)
    click(container.querySelector('button[aria-label="Login - 3 Roles"]'))
    expect(document.body.textContent).toContain('3 Logins')
    const demoButtons = [...document.body.querySelectorAll('button')].filter(b => b.textContent.includes('Demo View'))
    click(demoButtons[2]) // platform admin card
    expect(getPath()).toBe('/platform-admin')
  })
})

describe('login page honours the role picker', () => {
  it('?role=admin preselects Platform Admin and demo=1 fills credentials', () => {
    renderAt('/login?role=admin&demo=1', (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    ))
    const emailInput = container.querySelector('input[type="email"]')
    const pwdInput = container.querySelector('input[type="password"]')
    expect(emailInput.value).toBe('admin@tncolleges.in')
    expect(pwdInput.value).toBe('admin1234')
    expect(container.textContent).toContain('Demo credentials fill pannitten')
    expect(byText('Login as PLATFORM ADMIN')).toBeTruthy()
  })

  it('without demo flag the form stays empty and role defaults to student', () => {
    renderAt('/login', (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    ))
    expect(container.querySelector('input[type="email"]').value).toBe('')
    expect(byText('Login as STUDENT')).toBeTruthy()
  })
})
