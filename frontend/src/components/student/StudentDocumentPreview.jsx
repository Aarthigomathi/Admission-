import { useEffect, useMemo, useRef, useState } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw, Maximize2, Download, ExternalLink, FileText, Image as ImageIcon, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../../lib/languageContext'
import { documentBlobUrl, downloadDocument, formatFileSize, isPdfDoc } from '../../lib/studentDocuments'

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3]

/** data: URL -> Uint8Array for pdf.js (needs the raw bytes, not the URL) */
function dataUrlToBytes(dataUrl) {
  const [, payload = ''] = String(dataUrl || '').split(',')
  const binary = atob(payload)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/**
 * Certificate preview.
 * Images render straight from the data URL; PDFs are rasterised with pdf.js onto a
 * canvas because browsers block the built-in PDF viewer inside sandboxed frames
 * ("This page has been blocked by Chrome"). Falls back to download/open links.
 */
export default function StudentDocumentPreview({ doc, docKey, label, onClose }) {
  const { language } = useLanguage()
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [pdfStatus, setPdfStatus] = useState('idle')     // idle | loading | ready | error
  const canvasRef = useRef(null)
  const pdfRef = useRef(null)
  const isPdf = isPdfDoc(doc)
  const blobUrl = useMemo(() => doc?.dataUrl ? documentBlobUrl(doc) : '', [doc])

  useEffect(() => () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }, [blobUrl])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') setZoom(z => Math.min(3, Number((z + 0.25).toFixed(2))))
      if (e.key === '-') setZoom(z => Math.max(0.5, Number((z - 0.25).toFixed(2))))
      if (e.key.toLowerCase() === 'r') setRotation(r => (r + 90) % 360)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // ---- PDF: load once, then render the selected page onto the canvas ----
  useEffect(() => {
    if (!isPdf || !doc?.dataUrl) return
    let cancelled = false
    setPdfStatus('loading')
    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
        const task = pdfjs.getDocument({ data: dataUrlToBytes(doc.dataUrl) })
        const pdf = await task.promise
        if (cancelled) return
        pdfRef.current = pdf
        setPageCount(pdf.numPages || 1)
        setPage(1)
        setPdfStatus('ready')
      } catch {
        if (!cancelled) setPdfStatus('error')
      }
    })()
    return () => { cancelled = true }
  }, [isPdf, doc?.dataUrl])

  useEffect(() => {
    if (!isPdf || pdfStatus !== 'ready' || !pdfRef.current || !canvasRef.current) return
    let cancelled = false
    ;(async () => {
      try {
        const pdf = pdfRef.current
        const target = Math.min(Math.max(page, 1), pdf.numPages || 1)
        const pdfPage = await pdf.getPage(target)
        if (cancelled || !canvasRef.current) return
        const baseWidth = 1100                                    // render crisp, zoom with CSS
        const base = pdfPage.getViewport({ scale: 1 })
        const scale = Math.min(2.2, Math.max(0.6, baseWidth / (base.width || baseWidth)))
        const viewport = pdfPage.getViewport({ scale })
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        await pdfPage.render({ canvas, canvasContext: ctx, viewport }).promise
      } catch {
        if (!cancelled) setPdfStatus('error')
      }
    })()
    return () => { cancelled = true }
  }, [isPdf, pdfStatus, page])

  if (!doc) return null

  const zoomOut = () => setZoom(z => ZOOM_STEPS.filter(s => s < z - 0.01).pop() || 0.5)
  const zoomIn = () => setZoom(z => ZOOM_STEPS.find(s => s > z + 0.01) || 3)
  const fit = () => { setZoom(1); setRotation(0) }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1A3263]/70 backdrop-blur-sm p-2 sm:p-6" onClick={onClose}>
      <div className="w-full max-w-[1000px] rounded-[20px] bg-white border-2 border-[#FAB95B]/40 overflow-hidden shadow-[0_24px_80px_rgba(26,50,99,0.35)]" onClick={e => e.stopPropagation()}>

        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1A3263] px-4 sm:px-6 py-3">
          <div className="min-w-0 flex items-center gap-3">
            <div className="h-9 w-9 rounded-[10px] bg-[#FAB95B] text-[#1A3263] grid place-items-center shrink-0">
              {isPdf ? <FileText size={16} /> : <ImageIcon size={16} />}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-white truncate">{doc.name || 'Document'}</div>
              <div className="text-[10.5px] text-[#E8E2DB]/70">
                {label || docKey} • {formatFileSize(doc.size)}
                {doc.uploadedAt ? ` • ${new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''}
              </div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close preview" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 py-3 border-b-2 border-[#E8E2DB] bg-[#E8E2DB]/40">
          {!(isPdf && pdfStatus === 'error') && (
            <>
              <button onClick={zoomOut} disabled={zoom <= 0.5} aria-label="Zoom out" className="h-9 px-3 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5 disabled:opacity-40">
                <ZoomOut size={14} /> {language === 'ta' ? 'சிறிதாக்கு' : 'Zoom out'}
              </button>
              <span className="h-9 px-3 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[11px] font-bold text-[#1A3263] min-w-[62px]">{Math.round(zoom * 100)}%</span>
              <button onClick={zoomIn} disabled={zoom >= 3} aria-label="Zoom in" className="h-9 px-3 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5 disabled:opacity-40">
                <ZoomIn size={14} /> {language === 'ta' ? 'பெரிதாக்கு' : 'Zoom in'}
              </button>
              <button onClick={() => setRotation(r => (r + 90) % 360)} aria-label="Rotate" className="h-9 px-3 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5">
                <RotateCw size={14} /> {language === 'ta' ? 'சுழற்று' : 'Rotate'}
              </button>
              <button onClick={fit} className="h-9 px-3 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5">
                <Maximize2 size={14} /> {language === 'ta' ? 'சரிசெய்' : 'Fit'}
              </button>
            </>
          )}

          {isPdf && pdfStatus === 'ready' && pageCount > 1 && (
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} aria-label="Previous page" className="h-9 w-9 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] disabled:opacity-40">
                <ChevronLeft size={15} />
              </button>
              <span className="text-[11px] font-bold text-[#1A3263] px-1">{page} / {pageCount}</span>
              <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page >= pageCount} aria-label="Next page" className="h-9 w-9 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] disabled:opacity-40">
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          <div className="flex-1" />
          {blobUrl && (
            <a href={blobUrl} target="_blank" rel="noreferrer" className="h-9 px-4 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5">
              <ExternalLink size={13} /> {language === 'ta' ? 'புதிய தாவலில்' : 'Open in new tab'}
            </a>
          )}
          <button onClick={() => downloadDocument(doc)} className="h-9 px-4 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5">
            <Download size={13} /> {language === 'ta' ? 'பதிவிறக்கு' : 'Download'}
          </button>
        </div>

        {/* viewport - scrolls when the document is bigger than the frame */}
        <div className="max-h-[68vh] overflow-auto bg-[#E8E2DB]/50 p-3 sm:p-5">
          {isPdf ? (
            pdfStatus === 'error' ? (
              <div className="rounded-[14px] bg-white border-2 border-[#FAB95B]/40 p-6 text-center">
                <AlertTriangle size={22} className="text-[#FAB95B] mx-auto" />
                <div className="text-[13px] font-bold text-[#1A3263] mt-3">
                  {language === 'ta' ? 'இந்த browser இல் PDF preview கிடையாது' : 'PDF preview is not available in this view'}
                </div>
                <div className="text-[11.5px] text-[#547792] mt-1.5 leading-[1.6] max-w-[420px] mx-auto">
                  {language === 'ta'
                    ? '"Download" கொடுத்து கோப்பை திறங்கள் - உங்கள் சான்றிதழ் சேமிக்கப்பட்டு விட்டது.'
                    : 'Use Download to open the file - your certificate is saved safely in your account.'}
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button onClick={() => downloadDocument(doc)} className="h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-1.5"><Download size={14} /> {language === 'ta' ? 'பதிவிறக்கு' : 'Download'}</button>
                  {blobUrl && (
                    <a href={blobUrl} target="_blank" rel="noreferrer" className="h-10 px-5 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[12px] flex items-center gap-1.5"><ExternalLink size={14} /> {language === 'ta' ? 'புதிய தாவலில்' : 'Open in new tab'}</a>
                  )}
                </div>
              </div>
            ) : (
              <div className="min-h-[40vh] grid place-items-center">
                {pdfStatus === 'loading' && (
                  <div className="flex items-center gap-2 text-[12px] text-[#547792]">
                    <Loader2 size={16} className="animate-spin" /> {language === 'ta' ? 'PDF ஏற்றப்படுகிறது...' : 'Loading PDF...'}
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  style={{ transform: `scale(${zoom}) rotate(${rotation}deg)`, transformOrigin: 'center center', display: pdfStatus === 'ready' ? 'block' : 'none' }}
                  className="max-w-full rounded-[12px] border-2 border-[#E8E2DB] bg-white shadow-sm transition-transform duration-150"
                />
              </div>
            )
          ) : (
            <div className="min-h-[40vh] grid place-items-center">
              <img
                src={doc.dataUrl}
                alt={doc.name || 'document'}
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)`, transformOrigin: 'center center' }}
                className="max-w-full rounded-[12px] border-2 border-[#E8E2DB] bg-white transition-transform duration-150"
              />
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-2.5 text-[10.5px] text-[#547792] border-t-2 border-[#E8E2DB]">
          {language === 'ta'
            ? 'சிறிதா தெரிஞ்சா Zoom in pannunga illa scroll pannunga • Esc - moodu'
            : 'Too small? Use Zoom in or scroll inside the frame • Esc to close'}
        </div>
      </div>
    </div>
  )
}
