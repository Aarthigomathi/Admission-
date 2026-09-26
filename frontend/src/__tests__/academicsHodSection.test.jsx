// Regression tests for Academics + the department manager inside the
// "Department Pages (KCE Layout)" admin tab:
//  - Academics shows ONLY the departments the college added itself
//    (template/default departments must never appear)
//  - departments can be added and deleted from the Department Pages tab
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
import DeptPagesAdmin from '../components/admin/DeptPagesAdmin.jsx'

const HOD_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AAAwAB/AL+i4bAAAAAElFTkSuQmCC'

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn()
  window.alert = vi.fn()
  window.confirm = vi.fn(() => true)
})

const seed = ({ departments = [], deptPages = {} } = {}) => {
  const college = {
    id: 'C1', slug: 'test-college', name: 'Test Engineering College', shortName: 'TEC',
    city: 'Coimbatore', district: 'Coimbatore', type: 'Private', affiliation: 'Anna University',
    accreditation: 'NAAC A+', email: 'info@test.edu', phone: '+91 98765 43210',
    // template/default departments that must NEVER be shown
    departments: [
      { id: 9001, name: 'Civil Engineering', code: 'CIVIL', hod: 'Dr. L. Meena', faculty: 18 },
      { id: 9002, name: 'Information Technology', code: 'IT', hod: 'Dr. C. Deisy', faculty: 25 },
    ],
  }
  localStorage.setItem('tn_registered_colleges', JSON.stringify([college]))
  localStorage.setItem('tn_current_college', JSON.stringify({ id: 'C1' }))
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

const openAcademicsPage = (c) => {
  const link = [...c.querySelectorAll('a')].find(a => a.textContent.trim() === 'Academics')
  expect(link).toBeTruthy()
  act(() => { link.click() })
}

// stateful wrapper so setCustomData actually re-renders the admin like the real dashboard
function DeptAdminHarness() {
  const [customData, setCustomData] = React.useState(() => JSON.parse(localStorage.getItem('tn_college_data_C1') || '{}'))
  return <DeptPagesAdmin collegeId="C1" customData={customData} setCustomData={setCustomData} fullCollege={{}} />
}

const renderDeptAdmin = () => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => {
    root.render(
      <MemoryRouter>
        <DeptAdminHarness />
      </MemoryRouter>
    )
  })
  return container
}

describe('Academics - only the college own departments', () => {
  it('never shows template/default departments', () => {
    // college has not added any department of its own
    seed({ departments: [] })
    const c = renderPage()
    expect(c.querySelector('#departments')).toBeNull()
    openAcademicsPage(c)
    expect(c.textContent).not.toContain('Civil Engineering')
    expect(c.textContent).not.toContain('Information Technology')
    expect(c.textContent).toContain('No departments added yet')
  })

  it('lists the departments the college added, with HOD details', () => {
    seed({
      departments: [
        { id: 101, name: 'Information Technology', hod: 'Dr. C. Deisy', hodDesignation: 'Head of Department', hodImage: HOD_IMG },
        { id: 102, name: 'Computer Science and Engineering', hod: 'Dr. Ramesh Kumar' },
      ],
      deptPages: { 101: { heroImage: HOD_IMG, aboutText: ['Well equipped labs.'], courses: ['B.Tech IT'] } },
    })
    const c = renderPage()
    openAcademicsPage(c)
    expect(c.textContent).toContain('Department of Information Technology')
    expect(c.textContent).toContain('Dr. C. Deisy')
    expect(c.textContent).toContain('Well equipped labs.')
    // a department without saved page content still shows (it was added by the college)
    expect(c.textContent).toContain('Department of Computer Science and Engineering')
    // template ones must not leak in
    expect(c.textContent).not.toContain('Civil Engineering')
  })

  it('navigates to the department page from an Academics card', () => {
    seed({ departments: [{ id: 101, name: 'Information Technology', hod: 'Dr. C. Deisy', hodImage: HOD_IMG }] })
    const c = renderPage()
    openAcademicsPage(c)
    const btn = [...c.querySelectorAll('button')].find(b => b.textContent.includes('Read More'))
    expect(btn).toBeTruthy()
    act(() => { btn.click() })
    expect(c.textContent).toContain('HOD Profile')
    expect(c.textContent).toContain('Dr. C. Deisy')
  })
})

describe('Admin - department manager in Department Pages', () => {
  it('adds a department with HOD details', async () => {
    seed({ departments: [] })
    const c = renderDeptAdmin()
    expect(c.textContent).toContain('No departments added yet')

    const addBtn = [...c.querySelectorAll('button')].find(b => b.textContent.trim() === 'Add Department')
    act(() => { addBtn.click() })

    const nameInput = c.querySelector('input[placeholder="e.g. Information Technology"]')
    expect(nameInput).toBeTruthy()
    act(() => {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(nameInput, 'Artificial Intelligence and Data Science')
      nameInput.dispatchEvent(new Event('input', { bubbles: true }))
    })
    const hodInput = c.querySelector('input[placeholder="e.g. Dr. C. Deisy"]')
    act(() => {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(hodInput, 'Dr. S. Priya')
      hodInput.dispatchEvent(new Event('input', { bubbles: true }))
    })

    const submit = [...c.querySelectorAll('button')].filter(b => b.textContent.includes('Add Department')).pop()
    await act(async () => {
      submit.click()
      await new Promise(r => setTimeout(r, 250))
    })

    const stored = JSON.parse(localStorage.getItem('tn_college_data_C1') || '{}')
    expect(stored.departments.length).toBe(1)
    expect(stored.departments[0].name).toBe('Artificial Intelligence and Data Science')
    expect(stored.departments[0].hod).toBe('Dr. S. Priya')
  })

  it('deletes all departments in one click (clean slate)', async () => {
    seed({
      departments: [
        { id: 101, name: 'Information Technology', hod: 'Dr. C. Deisy' },
        { id: 102, name: 'Civil Engineering', hod: 'Dr. A. Sharma' },
      ],
      deptPages: { 101: { aboutText: ['a'] }, 102: { aboutText: ['b'] } },
    })
    const c = renderDeptAdmin()
    const clearBtn = [...c.querySelectorAll('button')].find(b => b.textContent.includes('Delete All'))
    expect(clearBtn).toBeTruthy()
    await act(async () => {
      clearBtn.click()
      await new Promise(r => setTimeout(r, 250))
    })
    const stored = JSON.parse(localStorage.getItem('tn_college_data_C1') || '{}')
    expect(stored.departments).toEqual([])
    expect(Object.keys(stored.deptPages || {})).toEqual([])
    expect(c.textContent).toContain('No departments added yet')
  })

  it('deletes a department and its saved page', async () => {
    seed({
      departments: [{ id: 101, name: 'Information Technology', hod: 'Dr. C. Deisy' }],
      deptPages: { 101: { aboutText: ['old'] } },
    })
    const c = renderDeptAdmin()
    expect(c.textContent).toContain('Information Technology')

    const delBtn = [...c.querySelectorAll('button')].find(b => b.getAttribute('title') === 'Delete Information Technology')
    expect(delBtn).toBeTruthy()
    await act(async () => {
      delBtn.click()
      await new Promise(r => setTimeout(r, 250))
    })

    const stored = JSON.parse(localStorage.getItem('tn_college_data_C1') || '{}')
    expect(stored.departments).toEqual([])
    expect(stored.deptPages['101']).toBeUndefined()
    expect(stored.deptPages[101]).toBeUndefined()
  })
})
