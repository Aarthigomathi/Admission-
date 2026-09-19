import React, { useState } from 'react';
import {
  X,
  Plus,
  Building2,
  Globe,
  MapPin,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Check,
  AlertCircle
} from 'lucide-react';

export default function AddCollegeModal({ isOpen, onClose, onAddCollege }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [tamilName, setTamilName] = useState('');
  const [shortName, setShortName] = useState('');
  const [code, setCode] = useState('');
  const [stream, setStream] = useState('Engineering');
  const [location, setLocation] = useState('');
  const [admissionUrl, setAdmissionUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [cutoffInfo, setCutoffInfo] = useState('');
  const [avgPackage, setAvgPackage] = useState('');
  const [annualFee, setAnnualFee] = useState('');
  const [coursesInput, setCoursesInput] = useState('B.E. Computer Science, B.Tech. AI & Data Science, B.Tech. IT');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter the College Name');
      return;
    }
    if (!admissionUrl.trim()) {
      setError('Please provide the official Admission Website URL');
      return;
    }

    let formattedUrl = admissionUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const coursesArray = coursesInput
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0)
      .map(c => ({
        name: c,
        duration: '4 Years',
        cutoff: cutoffInfo || 'Merit',
        seats: 60
      }));

    const initials = (shortName || name)
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 4)
      .toUpperCase();

    const newCollege = {
      id: `custom-clg-${Date.now()}`,
      name: name.trim(),
      tamilName: tamilName.trim(),
      shortName: shortName.trim() || name.trim().slice(0, 20),
      code: code.trim() || Math.floor(1000 + Math.random() * 9000).toString(),
      stream,
      type: 'Autonomous / Affiliated',
      location: location.trim() || 'Tamil Nadu',
      district: location.trim() || 'Tamil Nadu',
      established: 2000,
      nirfRank: 'Accredited Institution',
      accreditation: 'NAAC Accredited',
      rating: 4.6,
      reviewsCount: 320,
      logoUrl: logoUrl.trim() || '',
      badgeColor: 'from-blue-700 to-indigo-900',
      crestInitials: initials,
      crestSymbol: 'tower',
      admissionUrl: formattedUrl,
      applicationFee: '₹500',
      cutoffInfo: cutoffInfo.trim() || 'Merit Based',
      avgPackage: avgPackage.trim() || '₹6.5 LPA',
      highestPackage: '₹18.0 LPA',
      annualFee: annualFee.trim() || '₹85,000 / year',
      courses: coursesArray.length > 0 ? coursesArray : [
        { name: 'Undergraduate Program', duration: '4 Years', cutoff: 'Merit', seats: 60 }
      ],
      quotas: ['Single Window Counseling', 'Management Quota'],
      highlights: ['Modern Campus Infrastructure', 'Dedicated Placement Cell', 'Industry Collaborations'],
      deadline: '2026-06-30',
      helpline: '+91 98765 43210',
      email: 'admissions@college.edu',
      featured: false,
      isCustom: true
    };

    onAddCollege(newCollege);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Add New College / கல்லூரி சேர்க்க</h3>
              <p className="text-xs text-indigo-200">
                Include custom college with logo and official admission link
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                College Full Name (கல்லூரி பெயர்) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Government College of Technology (GCT)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tamil Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. அரசு தொழில்நுட்பக் கல்லூரி"
                  value={tamilName}
                  onChange={(e) => setTamilName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Short Name / Acronym
                </label>
                <input
                  type="text"
                  placeholder="e.g. GCT Coimbatore"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-900 block mb-1">
                Official Admission Website URL (சேர்க்கை இணையதள இணைப்பு) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-indigo-500 absolute left-3 top-3" />
                <input
                  type="url"
                  required
                  placeholder="https://examplecollege.edu.in/admissions"
                  value={admissionUrl}
                  onChange={(e) => setAdmissionUrl(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50/20"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Clicking "Enroll" in the Apply UI will directly open this link.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Stream
                </label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Arts & Science">Arts & Science</option>
                  <option value="Medical">Medical</option>
                  <option value="Management">Management</option>
                  <option value="Polytechnic">Polytechnic</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coimbatore, Tamil Nadu"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Counselling Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2005"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Logo Image URL (Optional - automatic crest generated if empty)
              </label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Cutoff Marks / Criteria
                </label>
                <input
                  type="text"
                  placeholder="e.g. 192.0 / 200"
                  value={cutoffInfo}
                  onChange={(e) => setCutoffInfo(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Avg Package
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹7.2 LPA"
                  value={avgPackage}
                  onChange={(e) => setAvgPackage(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Annual Fee
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹60,000 / year"
                  value={annualFee}
                  onChange={(e) => setAnnualFee(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Courses Offered (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. B.E. CSE, B.Tech. IT, B.E. ECE"
                value={coursesInput}
                onChange={(e) => setCoursesInput(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add College & Link</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
