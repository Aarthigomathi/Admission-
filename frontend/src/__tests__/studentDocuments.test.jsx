// @vitest-environment jsdom
// Student certificates: upload -> store -> view (zoom preview) -> download -> delete.
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/studentDocuments.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import StudentDocuments from '../components/student/StudentDocuments.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'
import {
  STUDENT_DOCUMENTS, getStudentDocuments, saveStudentDocuments, documentsSummary,
  prepareDocument, formatFileSize, documentsByteSize
} from '../lib/studentDocuments.js'

const SMALL_PDF = new File(['%PDF-1.4 tiny'], 'tenth-marksheet.pdf', { type: 'application/pdf' })

let container, root

beforeEach(() => {
  localStorage.clear()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

const render = ui =>
  act(async () => {
    root.render(
      <MemoryRouter>
        <LanguageProvider>{ui}</LanguageProvider>
      </MemoryRouter>
    )
  })

const click = el => act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
const byLabel = text => [...container.querySelectorAll('button, label')].find(b => b.textContent.includes(text))

describe('document storage', () => {
  it('lists 10 certificate slots, 6 of them required', () => {
    expect(STUDENT_DOCUMENTS.length).toBe(10)
    expect(STUDENT_DOCUMENTS.filter(d => d.required).length).toBe(6)
  })

  it('reads a PDF pick into a data URL payload', async () => {
    const payload = await prepareDocument(SMALL_PDF)
    expect(payload.name).toBe('tenth-marksheet.pdf')
    expect(payload.type).toBe('application/pdf')
    expect(payload.dataUrl.startsWith('data:application/pdf')).toBe(true)
    expect(payload.uploadedAt).toBeTruthy()
  })

  it('rejects unsupported files and oversized files', async () => {
    await expect(prepareDocument(new File(['x'], 'notes.txt', { type: 'text/plain' }))).rejects.toThrow('unsupported')
    const huge = { name: 'big.pdf', type: 'application/pdf', size: 5 * 1024 * 1024 }
    await expect(prepareDocument(huge)).rejects.toThrow('too-large')
  })

  it('saves, summarises and reports byte size', () => {
    const docs = {
      tenthMarksheet: { name: 'x.pdf', size: 1024, dataUrl: 'data:application/pdf;base64,AAAA' },
      photo: { name: 'p.jpg', size: 2048, dataUrl: 'data:image/jpeg;base64,AAAA' }
    }
    expect(saveStudentDocuments(7, docs).ok).toBe(true)
    expect(Object.keys(getStudentDocuments(7)).length).toBe(2)
    const summary = documentsSummary(7)
    expect(summary.uploaded).toBe(2)
    expect(summary.withFile).toBe(2)
    expect(summary.missingRequired.length).toBe(4)     // 6 required - 2 uploaded (tenthMarksheet + photo)
    expect(documentsByteSize(docs)).toBeGreaterThan(0)
    expect(formatFileSize(2048)).toBe('2 KB')
  })

  it('keeps legacy name-only records readable', () => {
    localStorage.setItem('tn_student_docs_9', JSON.stringify({ tc: 'my-tc.pdf' }))
    const docs = getStudentDocuments(9)
    expect(docs.tc.name).toBe('my-tc.pdf')
    expect(docs.tc.nameOnly).toBe(true)
    expect(documentsSummary(9).uploaded).toBe(1)
  })
})

describe('student documents panel', () => {
  it('shows all 10 slots, an upload counter and required-pending warning', async () => {
    await render(<StudentDocuments studentId={11} />)
    const text = container.textContent
    expect(text).toContain('My Documents & Certificates')
    expect(text).toContain('0 / 10 uploaded')
    expect(text).toContain('6 required pending')
    // one upload control per slot
    expect([...container.querySelectorAll('input[type="file"]')].length).toBe(10)
    expect(text).toContain('10th Mark Sheet')
    expect(text).toContain('Aadhar Card')
  })

  it('opens the preview with zoom + rotate controls for an uploaded image', async () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgo='
    saveStudentDocuments(12, { photo: { name: 'photo.png', type: 'image/png', size: 4096, dataUrl, uploadedAt: new Date().toISOString() } })
    await render(<StudentDocuments studentId={12} />)
    expect(container.textContent).toContain('1 / 10 uploaded')
    click(container.querySelector('button[aria-label="View document"]'))
    const text = container.textContent
    expect(text).toContain('Zoom in')
    expect(text).toContain('Zoom out')
    expect(text).toContain('Rotate')
    expect(text).toContain('photo.png')

    // zoom in moves from 100% to 125%, rotate is available
    click(byLabel('Zoom in'))
    expect(container.textContent).toContain('125%')
    expect(container.querySelector('img[alt="photo.png"]')).toBeTruthy()
    click(byLabel('Rotate'))
    expect(container.querySelector('img[alt="photo.png"]').style.transform).toContain('rotate(90deg)')
  })

  it('deletes a document and keeps storage in sync', async () => {
    saveStudentDocuments(13, { tc: { name: 'tc.pdf', type: 'application/pdf', size: 999, dataUrl: 'data:application/pdf;base64,AAAA' } })
    localStorage.setItem('tn_current_student', JSON.stringify({ id: 13, fullName: 'Doc Student' }))
    await render(<StudentDocuments studentId={13} />)
    click(container.querySelector('button[aria-label="Remove document"]'))
    expect(getStudentDocuments(13).tc).toBeUndefined()
    expect(JSON.parse(localStorage.getItem('tn_current_student')).documentsUploaded).toBe(0)
    expect(container.textContent).toContain('0 / 10 uploaded')
  })

  it('downloads through a blob URL (URL.createObjectURL mocked)', async () => {
    const createObjectURL = vi.fn(() => 'blob:mock')
    const revokeObjectURL = vi.fn()
    global.URL.createObjectURL = createObjectURL
    global.URL.revokeObjectURL = revokeObjectURL
    saveStudentDocuments(14, { aadharCard: { name: 'aadhar.pdf', type: 'application/pdf', size: 512, dataUrl: 'data:application/pdf;base64,AAAA' } })
    await render(<StudentDocuments studentId={14} />)
    click(container.querySelector('button[aria-label="Download document"]'))
    expect(createObjectURL).toHaveBeenCalled()
  })
})
