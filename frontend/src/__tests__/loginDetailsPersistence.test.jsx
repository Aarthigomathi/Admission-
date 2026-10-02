// Account details should be loaded again after login for each portal role.
// @vitest-environment jsdom
import React from 'react'
import { act } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'
import { getCollegeCustomData } from '../lib/collegeStorage.js'

let container
let root

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  window.alert = vi.fn()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

const renderLogin = (path) => {
  act(() => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/student/dashboard" element={<div data-route="student">Student dashboard</div>} />
          <Route path="/admin" element={<div data-route="college">College dashboard</div>} />
          <Route path="/platform-admin" element={<div data-route="admin">Platform admin</div>} />
          <Route path="/college/signup" element={<div data-route="college-signup">College signup</div>} />
        </Routes>
      </MemoryRouter>
    )
  })
  return container
}

const renderLoginToCollegeDashboard = (path) => {
  act(() => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <LanguageProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </LanguageProvider>
      </MemoryRouter>
    )
  })
  return container
}

const setInput = (input, value) => {
  const setter = Object.getOwnPropertyDescriptor(input.constructor.prototype, 'value').set
  act(() => {
    setter.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

const submit = (target) => act(() => {
  target.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
})

describe('login account detail persistence', () => {
  it('restores the saved student account by normalized email and password', () => {
    const student = {
      id: 701,
      email: 'student@example.com',
      password: 'student-pass',
      fullName: 'Saved Student',
      fatherMobile: '9876500001',
      motherMobile: '9876500002',
      schoolCollege: 'Government Higher Secondary School, Coimbatore',
      interestedCourse: 'B.E Computer Science',
      preferredDistrict: 'Coimbatore',
      role: 'STUDENT',
    }
    localStorage.setItem('tn_students', JSON.stringify([student]))
    const page = renderLogin('/login?role=student')

    setInput(page.querySelector('input[type="email"]'), 'STUDENT@EXAMPLE.COM')
    setInput(page.querySelector('input[type="password"]'), 'student-pass')
    submit(page)

    expect(page.querySelector('[data-route="student"]')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('tn_current_student'))).toEqual(student)
    expect(JSON.parse(localStorage.getItem('tn_current_student')).fatherMobile).toBe('9876500001')
  })

  it('does not silently create a blank demo profile when credentials do not match', () => {
    localStorage.setItem('tn_students', JSON.stringify([{
      id: 702, email: 'student@example.com', password: 'correct-pass', fullName: 'Saved Student'
    }]))
    const page = renderLogin('/login?role=student')

    setInput(page.querySelector('input[type="email"]'), 'student@example.com')
    setInput(page.querySelector('input[type="password"]'), 'wrong-pass')
    submit(page)

    expect(page.querySelector('[data-route="student"]')).toBeNull()
    expect(localStorage.getItem('tn_current_student')).toBeNull()
    expect(page.textContent).toContain('email or password is incorrect')
  })

  it('restores the college account without removing its saved profile sections', () => {
    const college = {
      id: 'KCE253',
      slug: 'karpagam-college-of-engineering',
      name: 'Karpagam College of Engineering',
      email: 'office@kce.ac.in',
      loginUsername: 'kce_253',
      loginPassword: 'college-pass',
      district: 'Coimbatore',
      courses: [],
      departments: [],
      branding: {},
    }
    const savedCollegeData = {
      about: { fullText: 'Previously saved KCE information' },
      courses: [{ id: 1, name: 'Computer Science' }],
    }
    localStorage.setItem('tn_registered_colleges', JSON.stringify([college]))
    localStorage.setItem('tn_college_data_KCE253', JSON.stringify(savedCollegeData))
    const page = renderLogin('/login?role=college')

    setInput(page.querySelector('input[type="text"]'), 'KCE_253')
    setInput(page.querySelector('input[type="password"]'), 'college-pass')
    submit(page)

    expect(page.querySelector('[data-route="college"]')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('tn_current_college')).id).toBe('KCE253')
    expect(getCollegeCustomData('KCE253')).toEqual(savedCollegeData)
  })

  it('opens the saved college dashboard instead of returning to the details form', () => {
    const college = {
      id: 709,
      slug: 'saved-college-709',
      name: 'Saved College Dashboard',
      email: 'saved@college.in',
      loginUsername: 'saved_college',
      loginPassword: 'saved-pass',
      district: 'Coimbatore',
      courses: [],
      departments: [],
      branding: {},
    }
    const savedDetails = { about: { fullText: 'Saved about section' } }
    localStorage.setItem('tn_registered_colleges', JSON.stringify([college]))
    localStorage.setItem('tn_college_data_709', JSON.stringify(savedDetails))
    const page = renderLoginToCollegeDashboard('/login?role=college')

    setInput(page.querySelector('input[type="text"]'), 'saved_college')
    setInput(page.querySelector('input[type="password"]'), 'saved-pass')
    submit(page)

    expect(page.textContent).toContain('Saved College Dashboard')
    expect(page.textContent).not.toContain('Login to your college admin portal')
    expect(getCollegeCustomData('709')).toEqual(savedDetails)
  })

  it('keeps platform-admin and other account data when the admin logs in again', () => {
    const otherAdmin = { email: 'other@tncolleges.in', role: 'PLATFORM_ADMIN', savedPreference: 'Chennai' }
    localStorage.setItem('tn_platform_admin_accounts', JSON.stringify({
      'admin@tncolleges.in': { email: 'admin@tncolleges.in', role: 'PLATFORM_ADMIN', savedPreference: 'Coimbatore' },
      'other@tncolleges.in': otherAdmin,
    }))
    localStorage.setItem('tn_students', JSON.stringify([{ id: 703, email: 'student@example.com', fullName: 'Saved Student' }]))
    const page = renderLogin('/login?role=admin')

    setInput(page.querySelector('input[type="email"]'), 'ADMIN@TNCOLLEGES.IN')
    setInput(page.querySelector('input[type="password"]'), 'admin1234')
    submit(page)

    expect(page.querySelector('[data-route="admin"]')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('tn_platform_admin'))).toEqual({ email: 'admin@tncolleges.in', role: 'PLATFORM_ADMIN' })
    const adminAccounts = JSON.parse(localStorage.getItem('tn_platform_admin_accounts'))
    expect(adminAccounts['admin@tncolleges.in']).toMatchObject({ savedPreference: 'Coimbatore', role: 'PLATFORM_ADMIN' })
    expect(adminAccounts['other@tncolleges.in']).toEqual(otherAdmin)
    expect(JSON.parse(localStorage.getItem('tn_students'))[0].fullName).toBe('Saved Student')
  })
})
