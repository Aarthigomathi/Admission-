// Regression tests for the admin sidebar: the standalone "Departments with HOD"
// section was removed on request, so only "Department Pages (KCE Layout)" must
// remain (and it must still render for an existing department).
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/adminDepartmentsHod.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { saveCollegeData } from '../lib/collegeStorage'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn()
  window.alert = vi.fn()
})

const seed = (departments) => {
  const college = { id: 'C1', slug: 'test-college', name: 'Test Engineering College', city: 'Coimbatore', district: 'Coimbatore', type: 'Private', affiliation: 'Anna University' }
  localStorage.setItem('tn_registered_colleges', JSON.stringify([college]))
  localStorage.setItem('tn_current_college', JSON.stringify({ id: 'C1' }))
  saveCollegeData('C1', 'departments', departments)
}

const renderDashboard = () => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => { root.render(<MemoryRouter initialEntries={['/admin']}><AdminDashboard /></MemoryRouter>) })
  return container
}

const menuLabels = (c) => [...c.querySelectorAll('a, button')].map(el => el.textContent.trim())

describe('Admin sidebar - Departments with HOD removed', () => {
  it('no longer shows the "Departments with HOD" menu item', () => {
    seed([{ id: 101, name: 'Computer Science and Engineering', hod: 'Dr. Ramesh Kumar', facultyCount: '25' }])
    const c = renderDashboard()
    const labels = menuLabels(c)
    expect(labels.some(l => l.startsWith('Departments with HOD'))).toBe(false)
    // ...but the Department Pages tab is still there
    expect(labels.some(l => l.startsWith('Department Pages (KCE Layout)'))).toBe(true)
  })

  it('still opens Department Pages for the existing departments', () => {
    seed([
      { id: 101, name: 'Computer Science and Engineering', hod: 'Dr. Ramesh Kumar', hodImage: 'data:image/png;base64,iVBORw0KGgo=', facultyCount: '25' },
      { id: 102, name: 'Electronics and Communication Engineering', hod: 'Dr. Meena Raj', facultyCount: '18' },
    ])
    const c = renderDashboard()
    const link = [...c.querySelectorAll('a, button')].find(el => el.textContent.trim().startsWith('Department Pages (KCE Layout)'))
    expect(link).toBeTruthy()
    act(() => { link.click() })
    expect(c.textContent).toContain('Department Pages (KCE Layout)')
    // department picker still lists both departments
    expect(c.textContent).toContain('Computer Science and Engineering')
    expect(c.textContent).toContain('Electronics and Communication Engineering')
  })

  it('keeps existing department data intact (only the admin tab was removed)', () => {
    seed([
      { id: 101, name: 'Computer Science and Engineering', hod: 'Dr. Ramesh Kumar', hodImage: 'data:image/png;base64,iVBORw0KGgo=', facultyCount: '25' },
      { id: 102, name: 'Electronics and Communication Engineering', hod: 'Dr. Meena Raj', facultyCount: '18' },
    ])
    // stored departments are untouched, so the website Academics section keeps working
    const stored = JSON.parse(localStorage.getItem('tn_college_data_C1') || '{}')
    expect(stored.departments.length).toBe(2)
    expect(stored.departments[0].hod).toBe('Dr. Ramesh Kumar')
    expect(stored.departments[0].hodImage).toBe('data:image/png;base64,iVBORw0KGgo=')
  })
})
