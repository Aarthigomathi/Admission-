// @vitest-environment jsdom
// College registration can be resumed from a local draft after leaving or refreshing.
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import CollegeSignup from '../pages/auth/CollegeSignup.jsx'

const DRAFT_KEY = 'tn_college_signup_draft_v1'
let container
let root

const mount = () => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root.render(
      <MemoryRouter>
        <CollegeSignup />
      </MemoryRouter>
    )
  })
}

const unmount = () => {
  if (!root) return
  act(() => root.unmount())
  container.remove()
  root = null
  container = null
}

const type = async (input, value) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  await act(async () => {
    setter.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

const inputByPlaceholder = placeholder =>
  [...container.querySelectorAll('input')].find(input => input.placeholder === placeholder)

const click = async button => act(async () => {
  button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await Promise.resolve()
})

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  vi.spyOn(window, 'alert').mockImplementation(() => {})
})

afterEach(() => {
  unmount()
  vi.restoreAllMocks()
})

describe('college registration draft', () => {
  it('saves the form from the top-right button and restores it without storing the password', async () => {
    mount()
    await type(inputByPlaceholder('e.g. Your College Name'), 'Sample College')
    await type(inputByPlaceholder('principal@yourcollege.edu'), 'office@sample.edu')
    await type(inputByPlaceholder('e.g. thiagarajar_admin'), 'sample_admin')
    await type(inputByPlaceholder('Create password'), 'do-not-store-this')

    const saveButton = [...container.querySelectorAll('button')].find(button => button.textContent.trim() === 'Save as Draft')
    await click(saveButton)

    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY))
    expect(draft.data.collegeName).toBe('Sample College')
    expect(draft.data.email).toBe('office@sample.edu')
    expect(draft.data.username).toBe('sample_admin')
    expect(draft.data.password).toBeUndefined()
    expect(container.textContent).toContain('Draft saved in this browser')

    unmount()
    mount()
    expect(inputByPlaceholder('e.g. Your College Name').value).toBe('Sample College')
    expect(inputByPlaceholder('principal@yourcollege.edu').value).toBe('office@sample.edu')
    expect(inputByPlaceholder('e.g. thiagarajar_admin').value).toBe('sample_admin')
    expect(inputByPlaceholder('Create password').value).toBe('')
    expect(container.textContent).toContain('Draft restored')
    expect(container.textContent).toContain('enter your password')
  })

  it('auto-saves changed registration details after a short pause', async () => {
    mount()
    await type(inputByPlaceholder('e.g. Your College Name'), 'Auto Save College')
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 800)) })

    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY))
    expect(draft.data.collegeName).toBe('Auto Save College')
    expect(draft.data.password).toBeUndefined()
  })
})
