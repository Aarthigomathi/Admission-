import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import PlatformHeader from './components/platform/PlatformHeader'
import PlatformHome from './pages/platform/Home'
import SearchPage from './pages/platform/SearchPage'
import CollegePage from './pages/college/CollegePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentSignup from './pages/auth/StudentSignup'
import CollegeSignup from './pages/auth/CollegeSignup'
import Login from './pages/auth/Login'
import StudentDashboard from './pages/student/Dashboard'
import StudentSaved from './pages/student/Saved'
import StudentCompare from './pages/student/Compare'
import StudentEnquiries from './pages/student/Enquiries'
import PlatformAdminDashboard from './pages/platformAdmin/PlatformAdminDashboard'
import { activityTracker, ACTIVITY_TYPES } from './lib/activityTracker'
import { LanguageProvider } from './lib/languageContext'

function ActivityTrackerWrapper({ children }) {
  const location = useLocation()
  useEffect(() => {
    const match = location.pathname.match(/\/college\/([^/]+)/)
    if (match) {
      const slug = match[1]
      import('./lib/colleges').then(({ colleges }) => {
        const college = colleges.find(c => c.slug === slug)
        if (college) {
          activityTracker.recordActivity({
            collegeId: college.id,
            activityType: ACTIVITY_TYPES.COLLEGE_VIEW,
            metadata: { collegeName: college.name, slug, url: location.pathname }
          })
        }
      })
    }
  }, [location.pathname])
  return children
}

function LegacyCompareRedirect() {
  return <Navigate to="/student/compare" replace />
}
function LegacySavedRedirect() {
  return <Navigate to="/student/saved" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ActivityTrackerWrapper>
          <PlatformHeader />
        <Routes>
          <Route path="/" element={<PlatformHome />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/compare" element={<LegacyCompareRedirect />} />
          <Route path="/saved" element={<LegacySavedRedirect />} />
          
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/college/signup" element={<CollegeSignup />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/saved" element={<StudentSaved />} />
          <Route path="/student/compare" element={<StudentCompare />} />
          <Route path="/student/enquiries" element={<StudentEnquiries />} />
          
          <Route path="/college/:slug" element={<CollegePage />} />
          <Route path="/college/:slug/:section" element={<CollegePage />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/:section" element={<AdminDashboard />} />
          
          <Route path="/platform-admin" element={<PlatformAdminDashboard />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ActivityTrackerWrapper>
      </LanguageProvider>
    </BrowserRouter>
  )
}
