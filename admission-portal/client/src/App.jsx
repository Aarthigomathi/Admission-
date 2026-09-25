import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/ui.jsx';

import Home from './pages/student/Home.jsx';
import Explore from './pages/student/Explore.jsx';
import CollegeDetail from './pages/student/CollegeDetail.jsx';
import LiveSeats from './pages/student/LiveSeats.jsx';
import TrackStatus from './pages/student/TrackStatus.jsx';

import CollegeLogin from './pages/college/Login.jsx';
import CollegeRegister from './pages/college/Register.jsx';
import DashboardLayout from './pages/college/DashboardLayout.jsx';
import Overview from './pages/college/Overview.jsx';
import ProfileEditor from './pages/college/ProfileEditor.jsx';
import ImportSite from './pages/college/ImportSite.jsx';
import Applications from './pages/college/Applications.jsx';
import Enquiries from './pages/college/Enquiries.jsx';
import SectionManager from './pages/college/SectionManager.jsx';
import Settings from './pages/college/Settings.jsx';

export function NotFound() {
  const location = useLocation();
  return (
    <Layout>
      <div className="container section center">
        <h1>Page not found</h1>
        <p className="muted">
          Nothing lives at <code>{location.pathname}</code>.
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" to="/">
            Back to home
          </Link>
          <Link className="btn btn-outline" to="/colleges">
            Explore colleges
          </Link>
        </div>
      </div>
    </Layout>
  );
}

/** Student-facing + college-facing route table. */
export default function App() {
  return (
    <Routes>
      {/* students */}
      <Route path="/" element={<Home />} />
      <Route path="/colleges" element={<Explore />} />
      <Route path="/colleges/:slug" element={<CollegeDetail />} />
      <Route path="/seats" element={<LiveSeats />} />
      <Route path="/track" element={<TrackStatus />} />

      {/* colleges */}
      <Route path="/college/login" element={<CollegeLogin />} />
      <Route path="/college/register" element={<CollegeRegister />} />
      <Route path="/college/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="profile" element={<ProfileEditor />} />
        <Route path="import" element={<ImportSite />} />
        <Route path="applications" element={<Applications />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="section/:section" element={<SectionManager />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
