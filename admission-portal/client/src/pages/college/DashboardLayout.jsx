import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../api.js';
import { useAuth, useSocketEvent, useToast } from '../../hooks.jsx';
import { Layout, Loader, ProgressRing } from '../../components/ui.jsx';
import { ENTITIES, SECTION_GROUPS } from '../../entities.js';
import { initials } from '../../lib/format.js';

export default function DashboardLayout() {
  const { session, loading, college, completeness } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    if (!loading && !session) navigate('/college/login', { replace: true });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;
    api.dashboard().then((d) => setCounts(d.counts)).catch(() => {});
  }, [session, location.pathname]);

  useSocketEvent('application:created', (row) => {
    toast.live(`New application: ${row.student_name} · ${row.course_name}`);
    setCounts((c) => (c ? { ...c, applications: c.applications + 1, newApplications: c.newApplications + 1 } : c));
  });
  useSocketEvent('enquiry:created', (row) => {
    toast.live(`New enquiry from ${row.name}`);
    setCounts((c) => (c ? { ...c, enquiries: c.enquiries + 1, newEnquiries: c.newEnquiries + 1 } : c));
  });

  if (loading || !session) {
    return (
      <Layout>
        <Loader label="Checking your session…" />
      </Layout>
    );
  }

  const item = (to, icon, label, count) => (
    <NavLink key={to} to={to} end className={({ isActive }) => `dash-nav-item${isActive ? ' active' : ''}`}>
      <span>{icon}</span>
      <span className="truncate">{label}</span>
      {count !== undefined && count !== null && <span className="count">{count}</span>}
    </NavLink>
  );

  return (
    <Layout>
      <div className="container dash">
        <aside className="dash-side">
          <div className="dash-college">
            <div className="cc-logo-mini">
              {college?.logo_url ? <img src={college.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : initials(college?.name)}
            </div>
            <div style={{ minWidth: 0 }}>
              <b className="truncate" style={{ display: 'block' }}>
                {college?.name}
              </b>
              <span className="small muted">College dashboard</span>
            </div>
          </div>

          <nav className="dash-nav">
            {item('/college/dashboard', '📊', 'Overview')}
            {item('/college/dashboard/profile', '🏫', 'College profile')}
            {item('/college/dashboard/import', '🌐', 'Import from website')}

            <div className="dash-group">Admissions</div>
            {item('/college/dashboard/applications', '📝', 'Applications', counts?.newApplications || null)}
            {item('/college/dashboard/enquiries', '💬', 'Enquiries', counts?.newEnquiries || null)}
            {item('/college/dashboard/section/courses', '🎓', 'Courses & seats', counts?.courses || null)}

            {SECTION_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="dash-group">{group.label}</div>
                {group.sections
                  .filter((s) => s !== 'courses')
                  .map((section) => item(`/college/dashboard/section/${section}`, ENTITIES[section].icon, ENTITIES[section].plural, counts?.[section] || null))}
              </div>
            ))}

            <div className="dash-group">Account</div>
            {item('/college/dashboard/settings', '⚙️', 'Settings & security')}
          </nav>

          <div className="divider" />
          <div className="row" style={{ gap: '0.6rem', justifyContent: 'center' }}>
            <ProgressRing value={completeness?.percentage ?? 0} />
          </div>
          <p className="small muted center" style={{ marginTop: '0.5rem' }}>
            Profile completeness
          </p>
          <a className="btn btn-outline btn-sm btn-block" href={`/colleges/${college?.slug}`} target="_blank" rel="noreferrer">
            Preview public page ↗
          </a>
        </aside>

        <main className="dash-main">
          <Outlet context={{ counts, setCounts }} />
          <div className="card card-pad small muted no-print">
            Tip: everything you save here is visible to students immediately — seat counts and admission status update
            live, without any refresh.{' '}
            <Link to="/college/dashboard/import">Use the website import assistant</Link> to fill sections quickly.
          </div>
        </main>
      </div>
    </Layout>
  );
}
