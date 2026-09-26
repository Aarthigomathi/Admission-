// Regression tests for the Academics page:
//  - the Academics section must NOT be on the home page any more
//  - the Academics page lists ONLY departments that have a Department Page saved
//    from the admin "Department Pages (KCE Layout)" tab
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/academicsHodSection.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { saveCollegeData } from '../lib/collegeStorage'
import CollegePage from '../pages/college/CollegePage.jsx'

const HOD_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AAAwAB/AL+i4bAAAAAElFTkSuQmCC'
const HERO_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AAAwAB/AL+i4bAAAAAElFTkSuQmCC'

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn()
})

const seed = ({ departments = [], deptPages = {} }) => {
  const college = {
    id: 'C1', slug: 'test-college', name: 'Test Engineering College', shortName: 'TEC',
    city: 'Coimbatore', district: 'Coimbatore', type: 'Private', affiliation: 'Anna University',
    accreditation: 'NAAC A+', email: 'info@test.edu', phone: '+91 98765 43210',
  }
  localStorage.setItem('tn_registered_colleges', JSON.stringify([college]))
  saveCollegeData('C1', 'departments', departments)
  saveCollegeData('C1', 'deptPages', deptPages)
}

const renderPage = () => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => {
    root.render(
      <MemoryRouter initialEntries={['/college/test-college']}>
        <Routes><Route path="/college/:slug" element={<CollegePage />} /></Routes>
      </MemoryRouter>
    )
  })
  return container
}

const depts = [
  { id: 101, name: 'Computer Science and Engineering', hod: 'Dr. Ramesh Kumar', hodDesignation: 'Head of Department', hodQualification: 'Ph.D, M.E CSE', hodImage: HOD_IMG, facultyCount: '25' },
  { id: 102, name: 'Electronics and Communication Engineering', hod: 'Dr. Meena Raj', hodDesignation: 'Professor & Head', hodQualification: 'Ph.D', facultyCount: '18' },
]

const openAcademicsPage = (c) => {
  const link = [...c.querySelectorAll('a')].find(a => a.textContent.trim() === 'Academics')
  expect(link).toBeTruthy()
  act(() => { link.click() })
}

describe('Academics', () => {
  it('is not rendered on the home page', () => {
    seed({ departments: depts, deptPages: { 101: { heroImage: HERO_IMG, aboutText: ['Well equipped labs.'] } } })
    const c = renderPage()
    expect(c.querySelector('#departments')).toBeNull()
    expect(c.textContent).not.toContain('View HOD Profile')
  })

  it('shows only the departments that have a Department Page', () => {
    seed({
      departments: depts,
      deptPages: {
        101: { heroImage: HERO_IMG, aboutText: ['Well equipped labs and smart classrooms.'], courses: ['B.E CSE', 'M.E CSE'], labs: ['AI Lab', 'IoT Lab'], faculty: [{ name: 'A' }, { name: 'B' }] },
      },
    })
    const c = renderPage()
    openAcademicsPage(c)
    expect(c.textContent).toContain('Academics')
    expect(c.textContent).toContain('Department of Computer Science and Engineering')
    expect(c.textContent).toContain('Well equipped labs and smart classrooms.')
    expect(c.textContent).toContain('2 Courses')
    expect(c.textContent).toContain('2 Labs')
    // dept 102 has no Department Page -> must not be listed
    expect(c.textContent).not.toContain('Department of Electronics and Communication Engineering')
    // HOD chip still shown for the published department
    expect(c.textContent).toContain('Dr. Ramesh Kumar')
    expect(c.textContent).toContain('1 Published')
  })

  it('shows an empty state when no department page is published', () => {
    seed({ departments: depts, deptPages: {} })
    const c = renderPage()
    openAcademicsPage(c)
    expect(c.textContent).toContain('No department pages published yet')
    expect(c.textContent).not.toContain('Department of Computer Science and Engineering')
  })

  it('navigates to the department page from an Academics card', () => {
    seed({ departments: depts, deptPages: { 101: { heroImage: HERO_IMG, aboutText: ['Well equipped labs.'] } } })
    const c = renderPage()
    openAcademicsPage(c)
    const btn = [...c.querySelectorAll('button')].find(b => b.textContent.includes('Read More'))
    expect(btn).toBeTruthy()
    act(() => { btn.click() })
    // DeptPage renders the HOD profile for that department
    expect(c.textContent).toContain('HOD Profile')
    expect(c.textContent).toContain('Dr. Ramesh Kumar')
  })
})
