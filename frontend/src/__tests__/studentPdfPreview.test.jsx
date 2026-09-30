// @vitest-environment jsdom
// Regression test for the Chrome "This page has been blocked by Chrome" report:
// a PDF certificate must never be embedded in an <iframe> (the browser PDF viewer is
// blocked inside sandboxed frames). PDFs are rasterised with pdf.js instead, and if
// that is unavailable the preview degrades to a download card - never a blank page.
//
// Dev-only deps (not in package.json):  npm i --no-save vitest jsdom
// Run:  npx vitest run src/__tests__/studentPdfPreview.test.jsx
import { describe, it, expect, beforeEach } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import StudentDocuments from '../components/student/StudentDocuments.jsx'
import { LanguageProvider } from '../lib/languageContext.jsx'
import { saveStudentDocuments } from '../lib/studentDocuments.js'

const PDF_DOC = {
  name: 'twelfth-marksheet.pdf',
  type: 'application/pdf',
  size: 2048,
  uploadedAt: new Date().toISOString(),
  dataUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQo='  // "%PDF-1.4" header bytes
}

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

describe('PDF certificate preview', () => {
  it('never embeds the PDF in an iframe (that is what Chrome blocks)', async () => {
    saveStudentDocuments(21, { twelfthMarksheet: PDF_DOC })
    await render(<StudentDocuments studentId={21} />)
    click(container.querySelector('button[aria-label="View document"]'))
    // let the lazy pdf.js import settle (jsdom cannot rasterise, so it must fall back)
    await act(async () => { await new Promise(r => setTimeout(r, 300)) })

    expect(container.querySelector('iframe')).toBeNull()
    expect(container.querySelector('embed')).toBeNull()
    expect(container.querySelector('object')).toBeNull()
    expect(container.textContent).not.toContain('blocked by Chrome')
  })

  it('shows a usable preview frame or a download fallback, plus download controls', async () => {
    saveStudentDocuments(22, { twelfthMarksheet: PDF_DOC })
    await render(<StudentDocuments studentId={22} />)
    click(container.querySelector('button[aria-label="View document"]'))
    await act(async () => { await new Promise(r => setTimeout(r, 300)) })

    const text = container.textContent
    const showsFrame = text.includes('Loading PDF') || !!container.querySelector('canvas')
    const showsFallback = text.includes('PDF preview is not available in this view')
    expect(showsFrame || showsFallback).toBe(true)

    if (showsFallback) {
      // fallback must still offer the certificate itself
      expect(text).toContain('Open in new tab')
      expect([...container.querySelectorAll('button')].some(b => b.textContent.includes('Download'))).toBe(true)
      expect(container.textContent).toContain('twelfth-marksheet.pdf')
    }
  })

  it('keeps images on the plain img preview path', async () => {
    saveStudentDocuments(23, { photo: { name: 'photo.png', type: 'image/png', size: 1024, dataUrl: 'data:image/png;base64,iVBORw0KGgo=' } })
    await render(<StudentDocuments studentId={23} />)
    click(container.querySelector('button[aria-label="View document"]'))
    expect(container.querySelector('img[alt="photo.png"]')).toBeTruthy()
    expect(container.querySelector('canvas')).toBeNull()
    expect(container.querySelector('iframe')).toBeNull()
  })
})
