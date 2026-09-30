import { useEffect, useMemo, useState } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw, Maximize2, Download, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react'
import { useLanguage } from '../../lib/languageContext'
import { documentBlobUrl, downloadDocument, formatFileSize, isPdfDoc } from '../../lib/studentDocuments'

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3]

/**
 * Certificate preview - images zoom / rotate inside a scrollable viewport,
 * PDFs open in a scrollable frame with an "open in new tab" fallback.
 */
export default function StudentDocumentPreview({ doc, docKey, label, onClose }) {
  const { language } = useLanguage()
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
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
          {!isPdf && (
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
            blobUrl ? (
              <iframe title={doc.name || 'document'} src={blobUrl} className="w-full h-[62vh] rounded-[12px] border-2 border-[#E8E2DB] bg-white" />
            ) : (
              <div className="h-[40vh] grid place-items-center text-[12px] text-[#547792]">{language === 'ta' ? 'PDF காட்ட முடியவில்லை - பதிவிறக்கி பாருங்கள்' : 'PDF preview unavailable - please download'}</div>
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
          {isPdf
            ? (language === 'ta' ? 'PDF scroll pannalaam • Esc - moodu' : 'Scroll inside the frame • Esc to close')
            : (language === 'ta' ? 'சிறிதா தெரிஞ்சா Zoom in pannunga illa scroll pannunga • Esc - moodu' : 'Too small? Use Zoom in or scroll • Esc to close')}
        </div>
      </div>
    </div>
  )
}
