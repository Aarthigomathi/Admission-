import { useEffect, useRef, useState } from 'react'
import { FolderOpen, Upload, Eye, Download, Trash2, RefreshCw, Check, AlertTriangle, Loader2, FileText, Image as ImageIcon } from 'lucide-react'
import { useLanguage } from '../../lib/languageContext'
import StudentDocumentPreview from './StudentDocumentPreview'
import {
  ACCEPTED_MIME, STUDENT_DOCUMENTS, getStudentDocuments, hasFile, isPdfDoc, prepareDocument,
  saveStudentDocumentsWithFallback, syncStudentDocumentCounters, documentsSummary,
  formatFileSize, downloadDocument
} from '../../lib/studentDocuments'

/**
 * "My Documents & Certificates" - student area.
 * Upload, view (preview with zoom/scroll), download, replace and delete certificates.
 */
export default function StudentDocuments({ studentId, className = '' }) {
  const { t, language } = useLanguage()
  const [docs, setDocs] = useState({})
  const [busyKey, setBusyKey] = useState('')
  const [notice, setNotice] = useState(null)          // { type: 'ok' | 'warn' | 'error', text }
  const [preview, setPreview] = useState(null)        // { doc, key }
  const fileRefs = useRef({})

  const load = () => setDocs(getStudentDocuments(studentId))

  useEffect(() => { load() }, [studentId])

  const summary = documentsSummary(studentId)
  const uploadedCount = STUDENT_DOCUMENTS.filter(d => docs[d.key]?.name).length

  const persist = nextDocs => {
    const result = saveStudentDocumentsWithFallback(studentId, nextDocs)
    if (!result.ok) {
      setNotice({ type: 'error', text: language === 'ta' ? 'சேமிக்க முடியவில்லை - browser storage நிரம்பிவிட்டது' : 'Could not save - browser storage is full' })
      return false
    }
    if (result.dropped.length > 0) {
      const names = result.dropped.map(key => t(STUDENT_DOCUMENTS.find(d => d.key === key)?.labelKey || key)).join(', ')
      setNotice({ type: 'warn', text: language === 'ta' ? `Storage குறைவு - ${names} நீக்கப்பட்டது` : `Storage was low - ${names} could not be kept` })
    }
    setDocs(result.docs)
    syncStudentDocumentCounters(studentId, result.docs)
    return true
  }

  const handleFile = async (key, file) => {
    if (!file) return
    setBusyKey(key)
    setNotice(null)
    try {
      const payload = await prepareDocument(file)
      const next = { ...docs, [key]: payload }
      if (persist(next)) {
        setNotice({ type: 'ok', text: language === 'ta' ? 'பதிவேற்றம் முடிந்தது' : 'Uploaded successfully' })
      }
    } catch (error) {
      const reason = error?.message
      const message = reason === 'too-large'
        ? (language === 'ta' ? 'கோப்பு மிகப் பெரியது (4MB க்கு கீழ் இருக்க வேண்டும்)' : 'File is too large (keep it under 4 MB)')
        : reason === 'unsupported'
          ? (language === 'ta' ? 'PDF, JPG, PNG மட்டும் ஏற்கப்படும்' : 'Only PDF, JPG, PNG and WEBP are supported')
          : (language === 'ta' ? 'கோப்பை படிக்க முடியவில்லை' : 'Could not read that file')
      setNotice({ type: 'error', text: message })
    } finally {
      setBusyKey('')
      if (fileRefs.current[key]) fileRefs.current[key].value = ''
    }
  }

  const handleDelete = key => {
    const next = { ...docs }
    delete next[key]
    if (persist(next)) {
      setNotice({ type: 'ok', text: language === 'ta' ? 'நீக்கப்பட்டது' : 'Removed' })
    }
  }

  return (
    <div className={`rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 ${className}`} id="documents">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-[#1A3263] flex items-center gap-2">
            <FolderOpen size={16} className="text-[#FAB95B]" />
            {language === 'ta' ? 'எனது ஆவணங்கள் & சான்றிதழ்கள்' : 'My Documents & Certificates'}
          </h3>
          <p className="text-[11px] text-[#547792] mt-1">
            {language === 'ta'
              ? 'சான்றிதழ்களை பதிவேற்றி, பார்த்து, பதிவிறக்கலாம். புகைப்படம்/PDF - அளவு 4MB க்கு கீழ்.'
              : 'Upload your certificates, preview them and download when needed. Photos or PDF, under 4 MB each.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">{uploadedCount} / {STUDENT_DOCUMENTS.length} {language === 'ta' ? 'பதிவேற்றப்பட்டது' : 'uploaded'}</span>
          {summary.missingRequired.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold flex items-center gap-1">
              <AlertTriangle size={11} /> {summary.missingRequired.length} {language === 'ta' ? 'கட்டாயம்' : 'required pending'}
            </span>
          )}
        </div>
      </div>

      {notice && (
        <div className={`mt-4 rounded-[12px] px-3 py-2 text-[11.5px] font-medium flex items-center gap-2 ${
          notice.type === 'error' ? 'bg-red-50 border-2 border-red-200 text-red-700'
            : notice.type === 'warn' ? 'bg-[#FAB95B]/20 border-2 border-[#FAB95B]/50 text-[#1A3263]'
              : 'bg-emerald-50 border-2 border-emerald-200 text-emerald-700'
        }`}>
          {notice.type === 'error' ? <AlertTriangle size={13} /> : <Check size={13} />} {notice.text}
        </div>
      )}

      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        {STUDENT_DOCUMENTS.map(meta => {
          const doc = docs[meta.key]
          const isBusy = busyKey === meta.key
          const uploaded = !!doc?.name
          return (
            <div
              key={meta.key}
              className={`rounded-[14px] border-2 p-3.5 ${uploaded ? 'bg-[#FAB95B]/10 border-[#FAB95B]/50' : 'bg-[#E8E2DB]/40 border-[#E8E2DB]'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-[#1A3263] flex items-center gap-1.5">
                    {t(meta.labelKey)} {meta.required && <span className="text-[#547792]">*</span>}
                    {uploaded && <Check size={13} className="text-emerald-600 shrink-0" />}
                  </div>
                  <div className="text-[10.5px] text-[#547792] mt-0.5">{meta.desc}</div>
                  {uploaded ? (
                    <div className="mt-1.5 text-[10.5px] text-[#1A3263]/80 flex items-center gap-1.5 min-w-0">
                      {isPdfDoc(doc) ? <FileText size={11} className="shrink-0" /> : <ImageIcon size={11} className="shrink-0" />}
                      <span className="truncate max-w-[190px] font-medium">{doc.name}</span>
                      <span className="text-[#547792] shrink-0">{formatFileSize(doc.size)}</span>
                    </div>
                  ) : (
                    <div className="mt-1.5 text-[10.5px] text-[#547792]">{language === 'ta' ? 'இன்னும் பதிவேற்றவில்லை' : 'Not uploaded yet'}</div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <label className={`h-8 px-3 rounded-full text-[10.5px] font-bold grid place-items-center cursor-pointer ${uploaded ? 'bg-white border-2 border-[#E8E2DB] text-[#1A3263]' : 'bg-[#1A3263] text-[#FAB95B]'}`}>
                    <span className="flex items-center gap-1.5">
                      {isBusy ? <Loader2 size={12} className="animate-spin" /> : uploaded ? <RefreshCw size={12} /> : <Upload size={12} />}
                      {isBusy ? (language === 'ta' ? 'படிக்கிறது' : 'Reading')
                        : uploaded ? (language === 'ta' ? 'மாற்று' : 'Replace')
                          : (language === 'ta' ? 'பதிவேற்று' : 'Upload')}
                    </span>
                    <input
                      ref={el => { fileRefs.current[meta.key] = el }}
                      type="file"
                      accept={ACCEPTED_MIME}
                      className="hidden"
                      disabled={isBusy}
                      onChange={e => handleFile(meta.key, e.target.files?.[0])}
                    />
                  </label>

                  {uploaded && hasFile(doc) && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => setPreview({ doc, key: meta.key })} title={language === 'ta' ? 'பார்' : 'View'} aria-label="View document" className="h-7 w-7 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]">
                        <Eye size={12} />
                      </button>
                      <button onClick={() => downloadDocument(doc)} title={language === 'ta' ? 'பதிவிறக்கு' : 'Download'} aria-label="Download document" className="h-7 w-7 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]">
                        <Download size={12} />
                      </button>
                      <button onClick={() => handleDelete(meta.key)} title={language === 'ta' ? 'நீக்கு' : 'Remove'} aria-label="Remove document" className="h-7 w-7 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-red-500 hover:border-red-300">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                  {uploaded && !hasFile(doc) && (
                    <span className="text-[10px] text-[#547792]">{language === 'ta' ? 'பெயர் மட்டும் சேமிக்கப்பட்டது' : 'Name only saved'}</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 rounded-[12px] bg-[#1A3263] text-[#E8E2DB]/85 px-4 py-3 text-[11px] leading-[1.55]">
        {language === 'ta'
          ? 'உங்கள் ஆவணங்கள் உங்கள் browser இல் மட்டுமே சேமிக்கப்படும். கல்லூரிக்கு நீங்கள் சம்மதித்து அனுப்பினால் மட்டுமே பகிரப்படும்.'
          : 'Your documents stay in your own browser. Nothing is shared with a college unless you send an enquiry and give consent.'}
      </div>

      {preview && (
        <StudentDocumentPreview
          doc={preview.doc}
          docKey={preview.key}
          label={t(STUDENT_DOCUMENTS.find(d => d.key === preview.key)?.labelKey || preview.key)}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  )
}
