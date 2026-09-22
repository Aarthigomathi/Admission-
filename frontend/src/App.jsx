import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PlatformHeader from './components/platform/PlatformHeader'
import PlatformHome from './pages/platform/Home'
import SearchPage from './pages/platform/SearchPage'
import CollegePage from './pages/college/CollegePage'
import AdminDashboard from './pages/admin/AdminDashboard'

function ComparePage() {
  return (
    <div className="min-h-screen bg-[#fbfaf8] p-8">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-display text-[32px] font-bold">Compare Colleges</h1>
        <p className="text-zinc-500 mt-2">Select colleges to compare side-by-side — courses, fees, placements, facilities.</p>
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {[1,2,3].map(i=>(
            <div key={i} className="rounded-[24px] bg-white border-2 border-dashed p-12 text-center">
              <div className="text-3xl">➕</div>
              <div className="font-medium mt-4">Add College {i}</div>
              <div className="text-[12px] text-zinc-400 mt-1">Search and select</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <PlatformHeader />
      <Routes>
        <Route path="/" element={<PlatformHome />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/saved" element={<SearchPage />} />
        <Route path="/college/:slug" element={<CollegePage />} />
        <Route path="/college/:slug/:section" element={<CollegePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:section" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
