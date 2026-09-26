// Regression tests for the Academics (Departments with HOD) section on the
// public college page: HOD photo + details must render and the HOD profile
// modal / department page must be reachable.
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

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn()
})

const seedCollege = (departments) => {
  const college = {
    id: 'C1',
    slug: 'test-college',
    name: 'Test Engineering College',
    shortName: 'TEC',
    city: 'Coimbatore',
    district: 'Coimbatore',
    type: 'Private',
    affiliation: 'Anna University',
    accreditation: 'NAAC A+',
    email: 'info@test.edu',
    phone: '+91 98765 43210',
  }
  localStorage.setItem('tn_registered_colleges', JSON.stringify([college]))
  saveCollegeData('C1', 'departments', departments)
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
  { id: 101, name: 'Computer Science and Engineering', hod: 'Dr. Ramesh Kumar', hodDesignation: 'Head of Department', hodQualification: 'Ph.D, M.E CSE', hodExperience: '15 years', hodImage: HOD_IMG, facultyCount: '25', hodEmail: 'hod.cse@test.edu', description: 'Well equipped labs.' },
  { id: 102, name: 'Electronics and Communication Engineering', hod: 'Dr. Meena Raj', hodDesignation: 'Professor & Head', hodQualification: 'Ph.D', hodExperience: '12 years', facultyCount: '18' },
]

describe('Academics section - Departments with HOD', () => {
  it('renders one card per department with the HOD photo and details', () => {
    seedCollege(depts)
    const c = renderPage()
    const section = c.querySelector('#departments')
    expect(section).toBeTruthy()
    expect(c.textContent).toContain('Academics')
    expect(c.textContent).toContain('Computer Science and Engineering')
    expect(c.textContent).toContain('Dr. Ramesh Kumar')
    expect(c.textContent).toContain('Qualification: Ph.D, M.E CSE')
    expect(c.textContent).toContain('25 Faculty members')
    // HOD photo for dept 1, initial fallback for dept 2 (no photo)
    const imgs = section.querySelectorAll('img')
    expect(imgs.length).toBe(1)
    expect(imgs[0].getAttribute('src')).toBe(HOD_IMG)
  })

  it('hides the section when no departments exist', () => {
    seedCollege([])
    const c = renderPage()
    expect(c.querySelector('#departments')).toBeNull()
  })

  it('opens the HOD profile modal when the HOD photo is tapped', () => {
    seedCollege(depts)
    const c = renderPage()
    const photoBtn = c.querySelector('#departments button')
    expect(photoBtn.textContent).toContain('View HOD Profile')
    act(() => { photoBtn.click() })
    expect(c.textContent).toContain('HOD Profile')
    expect(c.textContent).toContain('Dr. Ramesh Kumar')
    expect(c.textContent).toContain('hod.cse@test.edu')
    // department link inside the modal
    const modalBtns = [...c.querySelectorAll('button')].filter(b => b.textContent.includes('View Department'))
    expect(modalBtns.length).toBeGreaterThan(0)
  })

  it('navigates to the department page from the card button', () => {
    seedCollege(depts)
    const c = renderPage()
    const btn = [...c.querySelectorAll('#departments button')].find(b => b.textContent.includes('View Department'))
    act(() => { btn.click() })
    expect(c.textContent).toContain('HOD Profile') // DeptPage renders the HOD profile
    expect(c.textContent).toContain('Dr. Ramesh Kumar')
  })
})
