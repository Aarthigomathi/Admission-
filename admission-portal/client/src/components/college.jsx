import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Field, Modal, Select, TextInput, Checkbox, useStats } from './ui.jsx';
import { api } from '../api.js';
import { useToast } from '../hooks.jsx';
import { compact, dateLabel, initials, inr, isVideo, pct, seatTone, statusBadgeClass, youtubeId } from '../lib/format.js';

export function CollegeCard({ college, onSeatUpdate }) {
  const seatsAvailable = Math.max(0, (college.seats_total || 0) - (college.seats_filled || 0));
  const tone = seatTone(seatsAvailable, college.seats_total);
  const barClass = tone === 'danger' ? 'danger' : tone === 'warn' ? 'warn' : '';
  const filledPct = college.seats_total ? Math.min(100, ((college.seats_filled || 0) / college.seats_total) * 100) : 0;

  return (
    <article className="college-card">
      <div className="cc-cover">
        {college.cover_url ? (
          <img src={college.cover_url} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
        ) : null}
        <div className="badges">
          {college.featured ? <span className="badge badge-amber">★ Featured</span> : null}
          {college.hostel_available ? <span className="badge badge-navy">Hostel</span> : null}
          {college.transport_available ? <span className="badge badge-navy">Transport</span> : null}
        </div>
        <div className="cc-logo">
          {college.logo_url ? (
            <img src={college.logo_url} alt={`${college.name} logo`} onError={(e) => (e.currentTarget.style.display = 'none')} />
          ) : (
            initials(college.name)
          )}
        </div>
      </div>
      <div className="cc-body">
        <div>
          <Link to={`/colleges/${college.slug}`}>
            <h3 style={{ marginBottom: '0.15rem' }}>{college.name}</h3>
          </Link>
          <div className="cc-meta">
            <span>📍 {[college.city, college.state].filter(Boolean).join(', ')}</span>
            {college.type && <span>🏛️ {college.type}</span>}
            {college.established_year && <span>🎓 Est. {college.established_year}</span>}
          </div>
        </div>

        {college.accreditation && <div className="badge badge-blue">{String(college.accreditation).split(',')[0]}</div>}

        <div className="cc-stats">
          <div className="cc-stat">
            <b>{college.course_count ?? 0}</b>
            <span>Courses</span>
          </div>
          <div className="cc-stat">
            <b>{college.media_count ?? 0}</b>
            <span>Photos</span>
          </div>
          <div className="cc-stat">
            <b>{college.highest_package ? inr(college.highest_package, { compact: true }) : '—'}</b>
            <span>Highest pkg</span>
          </div>
        </div>

        <div>
          <div className="row-between small">
            <span className={seatsAvailable > 0 ? '' : 'muted'}>
              {seatsAvailable > 0 ? <b>{seatsAvailable} seats available</b> : <b>Admissions closed</b>}
            </span>
            <span className="muted mono">
              {college.seats_filled || 0}/{college.seats_total || 0}
            </span>
          </div>
          <div className={`seat-bar ${barClass}`} data-college={college.id}>
            <span style={{ width: `${filledPct}%` }} />
          </div>
        </div>

        <div className="row small muted" style={{ gap: '0.7rem' }}>
          {college.placement_percentage ? <span>📈 {pct(college.placement_percentage)} placed</span> : null}
          {college.faculty_count ? <span>👩‍🏫 {college.faculty_count} faculty</span> : null}
          {college.next_deadline ? <span>🗓️ Apply by {dateLabel(college.next_deadline)}</span> : null}
        </div>
      </div>
      <div className="cc-foot">
        <Link className="btn btn-primary btn-sm" to={`/colleges/${college.slug}`}>
          View details
        </Link>
        <Link className="btn btn-outline btn-sm" to={`/colleges/${college.slug}?tab=courses`}>
          Courses &amp; seats
        </Link>
      </div>
    </article>
  );
}

export function Gallery({ items = [] }) {
  const [open, setOpen] = useState(null);
  const images = items.filter((m) => m.type !== 'Video');
  const videos = items.filter((m) => m.type === 'Video');
  const all = [...images, ...videos];
  if (!all.length) return <p className="muted">The college has not published photos yet.</p>;

  return (
    <>
      <div className="gallery">
        {all.map((item) => (
          <figure className="gallery-item" key={item.id ?? item.url} onClick={() => setOpen(item)} style={{ margin: 0 }}>
            {item.type === 'Video' ? (
              youtubeId(item.url) ? (
                <img src={`https://img.youtube.com/vi/${youtubeId(item.url)}/hqdefault.jpg`} alt={item.title} loading="lazy" />
              ) : (
                <video src={item.url} muted playsInline preload="metadata" />
              )
            ) : (
              <img src={item.url} alt={item.title} loading="lazy" onError={(e) => (e.currentTarget.style.opacity = 0.2)} />
            )}
            <figcaption>
              {item.type === 'Video' ? '▶ ' : ''}
              {item.title}
            </figcaption>
          </figure>
        ))}
      </div>
      {open && (
        <div className="lightbox" onClick={() => setOpen(null)}>
          {isVideo(open.url) ? (
            youtubeId(open.url) ? (
              <iframe
                title={open.title}
                width="1000"
                height="560"
                src={`https://www.youtube.com/embed/${youtubeId(open.url)}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video src={open.url} controls autoPlay style={{ maxHeight: '84vh' }} />
            )
          ) : (
            <img src={open.url} alt={open.title} />
          )}
        </div>
      )}
    </>
  );
}

export function SeatTable({ rows = [], onApply, showCollege = false, flashId }) {
  if (!rows.length) return <p className="muted">No course-wise seat data published yet.</p>;
  return (
    <div className="card">
      {rows.map((row) => {
        const intake = row.intake_seats || row.intake || 0;
        const filled = row.filled_seats || row.filled || 0;
        const available = row.available ?? Math.max(0, intake - filled);
        const tone = seatTone(available, intake);
        return (
          <div className={`seat-row${flashId === (row.id ?? row.course_id) ? ' flash' : ''}`} key={row.id ?? row.course_id ?? row.name}>
            <div>
              <b>{row.name || row.course_name}</b>
              <div className="small muted">
                {[row.level, row.duration, showCollege ? row.college_name : null].filter(Boolean).join(' · ')}
              </div>
              <div className={`seat-bar ${tone === 'danger' ? 'danger' : tone === 'warn' ? 'warn' : ''}`}>
                <span style={{ width: `${intake ? Math.min(100, (filled / intake) * 100) : 0}%` }} />
              </div>
            </div>
            <div className="center">
              <b className="mono">{intake}</b>
              <div className="small muted">Intake</div>
            </div>
            <div className="center">
              <b className="mono">{filled}</b>
              <div className="small muted">Filled</div>
            </div>
            <div className="center">
              <b className="mono" style={{ color: available > 0 ? 'var(--green)' : 'var(--red)' }}>
                {available}
              </b>
              <div className="small muted">Available</div>
            </div>
            <div className="center">
              <span className={`badge ${statusBadgeClass(row.admission_status || row.status)}`}>{row.admission_status || row.status || '—'}</span>
              {row.application_deadline && <div className="small muted">by {dateLabel(row.application_deadline)}</div>}
            </div>
            {onApply && (
              <div className="right">
                <button
                  className="btn btn-sm btn-primary"
                  disabled={available <= 0 || row.admission_status === 'Closed'}
                  onClick={() => onApply(row)}
                >
                  {available > 0 ? 'Apply' : 'Waitlist'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const EMPTY_APPLICATION = {
  student_name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  category: '',
  board_university: '',
  qualifying_exam: '',
  marks_obtained: '',
  percentage: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  statement: '',
};

/** Application form used from the college page and the course list. */
export function ApplyModal({ college, courses = [], course, onClose, onDone }) {
  const toast = useToast();
  const [selected, setSelected] = useState(course?.id || '');
  const [form, setForm] = useState({ ...EMPTY_APPLICATION });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const activeCourse = courses.find((c) => String(c.id) === String(selected));
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setError('');
    if (!agree) return setError('Please confirm that the information provided is correct.');
    setBusy(true);
    try {
      const res = await api.apply({
        college_id: college.id,
        course_id: Number(selected),
        ...form,
        percentage: form.percentage === '' ? null : Number(form.percentage),
      });
      setResult(res);
      toast.success(res.message);
      onDone?.(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <Modal
        title="Application submitted 🎉"
        subtitle={college.name}
        onClose={onClose}
        footer={
          <>
            <a className="btn btn-outline" href={`/track?application_no=${result.application.application_no}&email=${encodeURIComponent(form.email)}`}>
              Track this application
            </a>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </>
        }
      >
        <div className="stack">
          <div className="alert alert-success">
            <span>✅</span>
            <div>{result.message}</div>
          </div>
          <dl className="kv">
            <div className="kv-row">
              <dt>Application number</dt>
              <dd>
                <b className="mono">{result.application.application_no}</b>
              </dd>
            </div>
            <div className="kv-row">
              <dt>Course</dt>
              <dd>{result.application.course_name}</dd>
            </div>
            <div className="kv-row">
              <dt>Status</dt>
              <dd>
                <span className={`badge ${statusBadgeClass(result.application.status)}`}>{result.application.status}</span>
              </dd>
            </div>
            <div className="kv-row">
              <dt>Seats available</dt>
              <dd>{result.availableSeats}</dd>
            </div>
            <div className="kv-row">
              <dt>Admission office</dt>
              <dd>
                {result.college.email} · {result.college.phone}
              </dd>
            </div>
          </dl>
          <p className="small muted" style={{ margin: 0 }}>
            Keep your application number safe — the college will contact you by email and the status updates here in
            real time.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Apply for admission"
      subtitle={`${college.name}${activeCourse ? ` · ${activeCourse.name}` : ''}`}
      onClose={onClose}
      size="wide"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit} disabled={busy || !selected}>
            {busy ? 'Submitting…' : 'Submit application'}
          </button>
        </>
      }
    >
      <div className="stack">
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        <Field label="Course you are applying for" required>
          <Select
            value={selected}
            onChange={setSelected}
            placeholder="Choose a course"
            options={courses.map((c) => ({
              value: c.id,
              label: `${c.name} · ${c.level || ''} · ${Math.max(0, (c.intake_seats || 0) - (c.filled_seats || 0))} seats left${c.admission_status === 'Closed' ? ' (closed)' : ''}`,
            }))}
          />
        </Field>

        {activeCourse && (
          <div className="alert alert-info" style={{ display: 'block' }}>
            <b>Eligibility:</b> {activeCourse.eligibility || 'As per the college notification.'}
            <div style={{ marginTop: '0.4rem' }}>
              <b>Admission criteria:</b> {activeCourse.admission_criteria || 'Merit based'}
              {activeCourse.application_deadline ? ` · Apply by ${dateLabel(activeCourse.application_deadline)}` : ''}
              {activeCourse.tuition_fee ? ` · Tuition fee ${inr(activeCourse.tuition_fee)}` : ''}
            </div>
          </div>
        )}

        <div className="form-grid">
          <Field label="Full name" required>
            <TextInput value={form.student_name} onChange={set('student_name')} placeholder="As per your Class 12 marksheet" />
          </Field>
          <Field label="Email" required>
            <TextInput value={form.email} onChange={set('email')} type="email" placeholder="you@example.com" />
          </Field>
          <Field label="Mobile number" required>
            <TextInput value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Date of birth">
            <TextInput value={form.dob} onChange={set('dob')} type="date" />
          </Field>
          <Field label="Gender">
            <Select value={form.gender} onChange={set('gender')} options={['Male', 'Female', 'Prefer not to say']} />
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={set('category')} options={['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority']} />
          </Field>
          <Field label="Board / University">
            <TextInput value={form.board_university} onChange={set('board_university')} placeholder="e.g. Tamil Nadu State Board" />
          </Field>
          <Field label="Qualifying examination">
            <TextInput value={form.qualifying_exam} onChange={set('qualifying_exam')} placeholder="e.g. TNEA / VITEEE / Class 12" />
          </Field>
          <Field label="Marks obtained">
            <TextInput value={form.marks_obtained} onChange={set('marks_obtained')} placeholder="e.g. 1080 / 1200" />
          </Field>
          <Field label="Percentage" hint="Between 0 and 100">
            <TextInput value={form.percentage} onChange={set('percentage')} type="number" min="0" max="100" step="0.01" />
          </Field>
          <Field label="City">
            <TextInput value={form.city} onChange={set('city')} />
          </Field>
          <Field label="State">
            <TextInput value={form.state} onChange={set('state')} />
          </Field>
          <Field label="Address" className="col-span-2">
            <TextInput value={form.address} onChange={set('address')} />
          </Field>
          <Field label="Why do you want to join this course?" className="col-span-2" hint="Optional — helps the college shortlist you">
            <textarea className="textarea" rows={3} value={form.statement} onChange={(e) => set('statement', e.target.value)} />
          </Field>
        </div>

        <Checkbox
          checked={agree}
          onChange={setAgree}
          label="I confirm the details above are correct and I agree to be contacted by the college about this application."
        />
      </div>
    </Modal>
  );
}

export function EnquiryModal({ college, course, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', message: course ? `I would like to know more about ${course.name}.` : '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await api.enquire({ college_id: college.id, course_id: course?.id, ...form });
      setDone(true);
      toast.success('Enquiry sent');
      // note: kept simple — the response is echoed back to the student
      setForm((f) => ({ ...f, message: res.message }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={done ? 'Enquiry sent' : 'Send an enquiry'}
      subtitle={college.name}
      onClose={onClose}
      footer={
        done ? (
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        ) : (
          <>
            <button className="btn btn-outline" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={submit} disabled={busy}>
              {busy ? 'Sending…' : 'Send enquiry'}
            </button>
          </>
        )
      }
    >
      {done ? (
        <div className="alert alert-success">
          <span>✅</span>
          <div>
            <b>Thank you!</b> Your enquiry has reached the college admission office.
            <div className="small" style={{ marginTop: '0.3rem' }}>
              They will reply to you at <b>{form.email}</b>. Admission contact: {college.admission_email || college.email}
              {college.phone ? ` · ${college.phone}` : ''}
            </div>
          </div>
        </div>
      ) : (
        <div className="stack">
          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {course && (
            <div className="alert alert-info">
              About: <b>{course.name}</b>
            </div>
          )}
          <div className="form-grid">
            <Field label="Your name" required>
              <TextInput value={form.name} onChange={set('name')} />
            </Field>
            <Field label="Email" required>
              <TextInput value={form.email} onChange={set('email')} type="email" />
            </Field>
            <Field label="Mobile number">
              <TextInput value={form.phone} onChange={set('phone')} />
            </Field>
            <Field label="City">
              <TextInput value={form.city} onChange={set('city')} />
            </Field>
            <Field label="Your question" required className="col-span-2">
              <textarea className="textarea" rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} />
            </Field>
          </div>
        </div>
      )}
    </Modal>
  );
}

/** Small floating summary used on the college page. */
export function LiveCollegeBadge({ collegeId, updatedAt }) {
  return (
    <span className="badge badge-green" title={`College data id ${collegeId} · refreshed ${new Date().toISOString()}`}>
      <span className="dot dot-live" /> Live data {updatedAt ? `· updated ${dateLabel(updatedAt)}` : ''}
    </span>
  );
}

export function CollegeHighlights({ college, seatsSummary, compactMode = false }) {
  const stats = useStats();
  const items = [
    { label: 'Courses', value: seatsSummary?.courses ?? '—' },
    { label: 'Departments', value: seatsSummary?.departments ?? '—' },
    { label: 'Total seats', value: seatsSummary?.totalSeats ?? '—' },
    { label: 'Seats available', value: seatsSummary?.availableSeats ?? '—', tone: 'var(--green-soft)' },
    { label: 'Highest package', value: seatsSummary?.highestPackage ? inr(seatsSummary.highestPackage, { compact: true }) : '—' },
    { label: 'Average package', value: seatsSummary?.averagePackage ? inr(seatsSummary.averagePackage, { compact: true }) : '—' },
  ];
  if (compactMode) items.pop();
  return (
    <div className="grid-3" style={{ gap: '0.7rem' }}>
      {items.map((item) => (
        <div className="stat" key={item.label} style={item.tone ? { background: item.tone } : undefined}>
          <div className="stat-label">{item.label}</div>
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>
            {item.value}
          </div>
        </div>
      ))}
      {college?.profile_completeness !== undefined && (
        <div className="stat">
          <div className="stat-label">Profile completeness</div>
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>
            {college.profile_completeness}%
          </div>
          <div className="stat-sub">{compact(stats?.seatsAvailable || 0)} seats open across the portal</div>
        </div>
      )}
    </div>
  );
}
