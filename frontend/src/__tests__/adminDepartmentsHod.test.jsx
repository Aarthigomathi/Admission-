// Regression tests for the admin "Departments with HOD" section:
// per-department HOD photo upload and edit support.
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

const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AAAwAB/AL+i4bAAAAAElFTkSuQmCC'

const readStore = (id) => JSON.parse(localStorage.getItem(`tn_college_data_${id}`) || '{}')

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

const openDepartments = (c) => {
  const link = [...c.querySelectorAll('a, button')].find(el => el.textContent.trim().startsWith('Departments with HOD'))
  expect(link).toBeTruthy()
  act(() => { link.click() })
}

describe('Admin - Departments with HOD', () => {
  it('shows the section and lets you add a HOD photo to an existing department', async () => {
    seed([{ id: 101, name: 'Computer Science and Engineering', hod: 'Dr. Ramesh Kumar', facultyCount: '25' }])
    const c = renderDashboard()
    openDepartments(c)
    expect(c.textContent).toContain('Departments with HOD')
    expect(c.textContent).toContain('Add HOD Photo')

    const fileInput = [...c.querySelectorAll('input[type="file"]')].find(i => {
      const lbl = i.closest('label')
      return lbl && (lbl.textContent.includes('Add HOD Photo') || lbl.textContent.includes('Change HOD Photo'))
    })
    expect(fileInput).toBeTruthy()
    const file = new File([new Uint8Array([1, 2, 3])], 'hod.png', { type: 'image/png' })
    await act(async () => {
      Object.defineProperty(fileInput, 'files', { value: [file], configurable: true })
      fileInput.dispatchEvent(new Event('change', { bubbles: true }))
      await new Promise(r => setTimeout(r, 250))
    })

    const stored = readStore('C1')
    expect(String(stored.departments[0].hodImage)).toMatch(/^data:image\/png;base64,/)
    expect(c.textContent).toContain('Change HOD Photo')
  })

  it('loads a department into the form for editing and saves the change', async () => {
    seed([{ id: 101, name: 'Computer Science and Engineering', hod: 'Dr. Ramesh Kumar', hodImage: TINY_PNG, facultyCount: '25' }])
    const c = renderDashboard()
    openDepartments(c)

    const editBtn = [...c.querySelectorAll('button')].find(b => b.textContent.trim() === 'Edit')
    act(() => { editBtn.click() })
    expect(c.textContent).toContain('Editing: Computer Science and Engineering')

    const nameInput = c.querySelector('#dept-form-top input')
    expect(nameInput.value).toBe('Computer Science and Engineering')

    const updateBtn = [...c.querySelectorAll('button')].find(b => b.textContent.includes('Update Department'))
    expect(updateBtn).toBeTruthy()
    act(() => {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(nameInput, 'Computer Science and Engineering (AI)')
      nameInput.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await act(async () => {
      updateBtn.click()
      await new Promise(r => setTimeout(r, 250))
    })

    const stored = readStore('C1')
    expect(stored.departments[0].name).toBe('Computer Science and Engineering (AI)')
    expect(stored.departments[0].hodImage).toBe(TINY_PNG)
    expect(c.textContent).toContain('Computer Science and Engineering (AI)')
  })
})
