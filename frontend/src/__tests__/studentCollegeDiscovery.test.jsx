// @vitest-environment jsdom
// Student discovery starts with curated Tamil Nadu profiles while keeping
// registered-college counts separate for admin approval workflows.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import StudentDashboard from '../pages/student/Dashboard.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'
import { colleges as starterColleges } from '../lib/colleges.js'
import { getDiscoveryColleges, getPublicColleges } from '../lib/collegeStorage.js'

let container
let root
let scrollIntoView
let originalScrollIntoView

beforeEach(() => {
  localStorage.clear()
  originalScrollIntoView = Element.prototype.scrollIntoView
  scrollIntoView = vi.fn()
  Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  if (root) act(() => root.unmount())
  container?.remove()
  if (originalScrollIntoView) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: originalScrollIntoView })
  } else {
    delete Element.prototype.scrollIntoView
  }
})

async function renderDashboard(initialPath = '/student/dashboard') {
  localStorage.setItem('tn_current_student', JSON.stringify({
    id: 'test-student',
    fullName: 'Test Student',
    email: 'test@student.example',
    district: 'Coimbatore',
    city: 'Coimbatore',
    preferredDistrict: 'Coimbatore',
    educationLevel: '12th',
    percentage: '85',
    grade: 'Excellent - A',
    interestedCourse: 'B.E Computer Science',
    groupStream: 'Computer Science',
    hostelRequired: 'No',
    transportRequired: 'No'
  }))

  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[initialPath]}>
        <LanguageProvider>
          <StudentDashboard />
        </LanguageProvider>
      </MemoryRouter>
    )
  })
}

describe('student college discovery', () => {
  it('shows the curated starter colleges to students without counting them as signups', () => {
    const discovery = getDiscoveryColleges()

    expect(discovery).toHaveLength(starterColleges.length)
    expect(discovery.map(college => college.name)).toContain('PSG College of Technology')
    expect(discovery.every(college => college.isStarterListing)).toBe(true)
    expect(discovery.every(college => !college.verified)).toBe(true)
    expect(discovery.every(college => college.verificationStatus === 'STARTER LISTING')).toBe(true)
    expect(getPublicColleges()).toHaveLength(0)
  })

  it('adds college-submitted profiles alongside starters but keeps admin signups separate', () => {
    localStorage.setItem('tn_registered_colleges', JSON.stringify([{
      id: 9001,
      slug: 'new-college',
      name: 'New College of Tamil Nadu',
      shortName: 'New College',
      district: 'Chennai',
      city: 'Chennai',
      type: 'Engineering',
      verificationStatus: 'PENDING',
      courses: [],
      departments: [],
      branding: {}
    }]))

    const discovery = getDiscoveryColleges()
    const registered = discovery.find(college => college.id === 9001)

    expect(discovery).toHaveLength(starterColleges.length + 1)
    expect(registered.isStarterListing).toBe(false)
    expect(registered.listingSource).toBe('college')
    expect(getPublicColleges().map(college => college.name)).toEqual(['New College of Tamil Nadu'])
  })

  it('shows matching starter college cards on a newly created student dashboard', async () => {
    await renderDashboard()
    const text = container.textContent

    expect(text).toContain('Recommended for You')
    expect(text).toContain('PSG College of Technology')
    expect(text).toContain('Coimbatore Institute of Technology')
    expect(text).toContain('Kumaraguru College of Technology')
    expect(text).toContain('STARTER LISTING')
    expect(text).not.toContain('No Colleges Yet')

    const activityCards = [...container.querySelectorAll('.student-activity-card')]
    expect(activityCards).toHaveLength(4)
    expect(activityCards.every(card => card.querySelector('img')?.getAttribute('src'))).toBe(true)
  })

  it('scrolls straight to matching colleges after signup', async () => {
    await renderDashboard('/student/dashboard#recommended-colleges')

    expect(container.querySelector('#recommended-colleges')).toBeTruthy()
    expect(container.textContent).toContain('Recommended for You')
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })
})
