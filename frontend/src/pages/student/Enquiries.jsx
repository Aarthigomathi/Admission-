import { useState, useEffect } from 'react'
import { colleges } from '../../lib/colleges'
import { MessageCircle, Shield, Send, CheckCircle2, Clock, Building2 } from 'lucide-react'
import { activityTracker, ACTIVITY_TYPES } from '../../lib/activityTracker'
import StudentHeader from '../../components/student/StudentHeader'
import { useLanguage } from '../../lib/languageContext'

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [form, setForm] = useState({ collegeId: colleges[0]?.id || 101, courseId: '', question: '', contactMethod: 'Email', consent: false })
  const [success, setSuccess] = useState(false)
  const { t, language } = useLanguage()

  useEffect(() => {
    setEnquiries(JSON.parse(localStorage.getItem('tn_enquiries') || '[]'))
  }, [])

  const selectedCollege = colleges.find(c=>c.id===Number(form.collegeId))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.consent) {
      alert("Please give consent to share your info with college for enquiry - Privacy rule")
      return
    }
    const currentStudent = JSON.parse(localStorage.getItem('tn_current_student') || 'null')
    const newEnquiry = {
      id: Date.now(),
      student_id: currentStudent?.id || 1,
      student_name: currentStudent?.fullName || "Demo Student",
      student_email: currentStudent?.email || "student@demo.com",
      college_id: Number(form.collegeId),
      college_name: selectedCollege?.name || "College",
      course_id: form.courseId,
      question: form.question,
      contact_method: form.contactMethod,
      status: "New",
      consent_given: true,
      personal_info_shared: true,
      created_at: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0]
    }
    const updated = [newEnquiry, ...enquiries]
    setEnquiries(updated)
    localStorage.setItem('tn_enquiries', JSON.stringify(updated))
    
    activityTracker.recordActivity({
      collegeId: Number(form.collegeId),
      courseId: form.courseId ? Number(form.courseId) : null,
      activityType: ACTIVITY_TYPES.ENQUIRY,
      metadata: { collegeName: selectedCollege?.name, question: form.question, consent: true, personalInfoShared: true },
      personalInfoShared: true
    })

    setSuccess(true)
    setForm({ collegeId: form.collegeId, courseId: '', question: '', contactMethod: 'Email', consent: false })
    setTimeout(()=>setSuccess(false), 4000)
  }

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <StudentHeader />
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8 py-8">
        <h1 className="font-display text-[28px] font-bold text-[#1A3263] flex items-center gap-3"><MessageCircle className="text-[#FAB95B]" /> {language==='ta' ? `எனது விசாரணைகள் - ${enquiries.length}` : `My Enquiries - Consent-Based Only Real`} <span className="text-[11px] px-2 py-1 rounded-full bg-[#FAB95B] text-[#1A3263]">🌐 {language==='ta' ? 'தமிழ் / English - மாணவருக்கு மட்டும்' : 'Tamil / English - Only Student'}</span></h1>
        <p className="text-[13px] text-[#547792] mt-2">Enquiry system: Student selects College, Course, Question, Preferred Contact Method, Submit. College receives via dashboard with status New, Contacted, Follow-up, Interested, Closed. Only enquiry-related info shared with consent - Privacy protected.</p>

        <div className="mt-8 grid lg:grid-cols-[1fr_1.2fr] gap-8">
          <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6">
            <h3 className="font-bold text-[#1A3263]">New Enquiry - Real Colleges</h3>
            {success && (
              <div className="mt-4 p-4 rounded-[12px] bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-[12px] font-bold flex items-center gap-2"><CheckCircle2 size={16} /> Enquiry sent successfully with consent! College will contact you. Activity ENQUIRY tracked with personalInfoShared=true</div>
            )}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263]">Select College - Real</label>
                <select value={form.collegeId} onChange={e=>setForm({...form, collegeId: e.target.value})} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] font-medium">
                  {colleges.map(c=><option key={c.id} value={c.id}>{c.name} - {c.district}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263]">Select Course - Real from college</label>
                <select value={form.courseId} onChange={e=>setForm({...form, courseId: e.target.value})} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]">
                  <option value="">Select Course - Optional</option>
                  {selectedCollege?.courses.map(course=><option key={course.id} value={course.id}>{course.degree} - {course.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263]">Your Question</label>
                <textarea value={form.question} onChange={e=>setForm({...form, question: e.target.value})} required placeholder="Ask about admission, fees, eligibility, hostel, placement - Real enquiry" className="mt-2 w-full min-h-[100px] p-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263]">Preferred Contact Method</label>
                <select value={form.contactMethod} onChange={e=>setForm({...form, contactMethod: e.target.value})} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]">
                  <option>Email</option>
                  <option>Phone</option>
                  <option>WhatsApp</option>
                </select>
              </div>

              <div className="rounded-[12px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4">
                <label className="flex gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.consent} onChange={e=>setForm({...form, consent: e.target.checked})} className="mt-1" />
                  <span className="text-[11px] leading-[1.5] text-[#1A3263]"><strong>Consent to share:</strong> I agree to share my name, email, phone, education level, district, interested course with {selectedCollege?.shortName} for this enquiry only. I understand viewing college does NOT auto-share my info - only ENQUIRE NOW with consent shares. Platform protects my data.</span>
                </label>
              </div>

              <button type="submit" className="w-full h-12 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold border-2 border-[#FAB95B] flex items-center justify-center gap-2"><Send size={16} /> Send Enquiry - With Consent</button>
            </form>

            <div className="mt-6 rounded-[12px] bg-[#1A3263] text-white p-4">
              <div className="text-[11px] font-bold text-[#FAB95B] flex items-center gap-1"><Shield size={12} /> Privacy Rule - Core</div>
              <div className="text-[11px] text-[#E8E2DB]/80 mt-2 leading-[1.5]">Viewing college does NOT auto-send personal info. Only ENQUIRE NOW with consent shares. College sees aggregated views, NOT individual browsing unless enquiry with consent. Student data belongs to platform and must be protected.</div>
            </div>
          </div>

          <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6">
            <h3 className="font-bold text-[#1A3263]">My Enquiries - {enquiries.length} - Status Tracking</h3>
            <div className="mt-6 space-y-3 max-h-[700px] overflow-auto pr-1">
              {enquiries.length===0 ? (
                <div className="py-16 text-center">
                  <div className="text-4xl">💬</div>
                  <div className="font-semibold text-[#1A3263] mt-4">No enquiries yet - Real</div>
                  <div className="text-[12px] text-[#547792] mt-2">Your enquiries with status New/Contacted/Follow-up/Interested/Closed will appear here</div>
                </div>
              ) : enquiries.map(enq=>(
                <div key={enq.id} className="rounded-[16px] border-2 border-[#E8E2DB] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-[10px] bg-[#E8E2DB] grid place-items-center shrink-0"><Building2 size={16} className="text-[#1A3263]" /></div>
                      <div>
                        <div className="font-semibold text-[13px] text-[#1A3263]">{enq.college_name}</div>
                        <div className="text-[11px] text-[#547792] mt-1">{enq.date} • {enq.time} • Via {enq.contact_method}</div>
                        <div className="text-[12px] text-[#1A3263] mt-2 bg-[#E8E2DB]/50 rounded-[8px] p-2">{enq.question}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border-2 ${enq.status==='New' ? 'bg-[#FAB95B] border-[#FAB95B] text-[#1A3263]' : 'bg-white border-[#E8E2DB] text-[#547792]'}`}>{enq.status}</span>
                  </div>
                  <div className="mt-3 flex gap-2 text-[10px]">
                    <span className="px-2 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold flex items-center gap-1"><Clock size={10} /> {enq.status}</span>
                    <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">Consent ✓ Shared</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
