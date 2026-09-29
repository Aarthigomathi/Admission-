// HOD Profile section of the department page:
//  - a professional portrait card when the department has a HOD photo
//  - an initials monogram card (never a broken/empty frame) when there is no photo
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/deptPageHodProfile.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { saveCollegeData } from '../lib/collegeStorage'
import { hodInitials } from '../lib/hodProfile'
import CollegePage from '../pages/college/CollegePage.jsx'

const HOD_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AAAwAB/AL+i4bAAAAAElFTkSuQmCC'

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn()
})

const seed = (departments) => {
  const college = {
    id: 'C1', slug: 'test-college', name: 'Test Engineering College', shortName: 'TEC',
    city: 'Coimbatore', district: 'Coimbatore', type: 'Private', affiliation: 'Anna University',
    accreditation: 'NAAC A+', email: 'info@test.edu', phone: '+91 98765 43210',
  }
  localStorage.setItem('tn_registered_colleges', JSON.stringify([college]))
  saveCollegeData('C1', 'departments', departments)
  saveCollegeData('C1', 'deptPages', { 101: { heroImage: HOD_IMG, aboutText: ['Well equipped labs.'] } })
}

const openDeptPage = () => {
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
  const academics = [...container.querySelectorAll('a')].find(a => a.textContent.trim() === 'Academics')
  act(() => { academics.click() })
  const readMore = [...container.querySelectorAll('button')].find(b => b.textContent.includes('Read More'))
  act(() => { readMore.click() })
  return container
}

describe('hodInitials', () => {
  it('drops titles and takes two initials', () => {
    expect(hodInitials('Dr. Ramesh Kumar')).toBe('RK')
    expect(hodInitials('Prof. Meena Raj')).toBe('MR')
    expect(hodInitials('Thiru S. Karthik')).toBe('SK')
  })
  it('handles a single word and empty input', () => {
    expect(hodInitials('Mahesh')).toBe('M')
    expect(hodInitials('')).toBe('H')
    expect(hodInitials('Dr.')).toBe('D')
  })
})

describe('Department page - HOD profile', () => {
  it('frames the uploaded photo professionally (portrait crop, name plate, facts)', () => {
    seed([{
      id: 101, name: 'Computer Science and Engineering', hod: 'Dr. Ramesh Kumar',
      hodDesignation: 'Head of Department', hodQualification: 'Ph.D, M.E CSE',
      hodExperience: '22 years', hodImage: HOD_IMG, facultyCount: '25',
    }])
    const c = openDeptPage()
    expect(c.textContent).toContain('HOD Profile')
    const img = c.querySelector(`img[src="${HOD_IMG}"][alt="Dr. Ramesh Kumar"]`)
    expect(img).toBeTruthy()
    // head-safe crop inside a 4:5 portrait frame
    expect(img.className).toContain('object-top')
    expect(img.className).toContain('object-cover')
    // name plate + supporting facts
    expect(c.textContent).toContain('Dr. Ramesh Kumar')
    expect(c.textContent).toContain('Head of Department')
    expect(c.textContent).toContain('Ph.D, M.E CSE')
    expect(c.textContent).toContain('Experience')
    expect(c.textContent).toContain('22 years')
    expect(c.textContent).toContain('Faculty Members')
    expect(c.textContent).toContain('25')
  })

  it('shows an initials monogram instead of an empty frame when there is no photo', () => {
    seed([{
      id: 101, name: 'Electronics and Communication Engineering', hod: 'Dr. Meena Raj',
      hodDesignation: 'Professor & Head', hodQualification: 'Ph.D', facultyCount: '18',
    }])
    const c = openDeptPage()
    expect(c.querySelector('img[alt="Dr. Meena Raj"]')).toBeNull()
    expect(c.textContent).toContain('MR')
    expect(c.textContent).toContain('Head of Department')   // monogram caption
    expect(c.textContent).toContain('Professor & Head')     // designation
    expect(c.textContent).toContain('Department Leadership')// bio fallback label
    expect(c.textContent).toContain('Dr. Meena Raj heads the Department of Electronics and Communication Engineering')
  })
})
