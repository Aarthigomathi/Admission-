import { useState } from 'react'
import { Upload, X, Image as ImageIcon, Video, FileText, Link as LinkIcon, Check, GripVertical } from 'lucide-react'

export default function MediaLibrary({ college, onSelect }) {
  const [activeTab, setActiveTab] = useState('images')
  const [images, setImages] = useState(college.gallery || [])
  const [uploading, setUploading] = useState(false)

  const handleUpload = (e) => {
    const files = Array.from(e.target.files)
    setUploading(true)
    // Simulate upload - in real app, upload to S3/Cloudinary via backend
    setTimeout(() => {
      const newImages = files.map(f => URL.createObjectURL(f))
      setImages(prev => [...newImages, ...prev])
      setUploading(false)
    }, 1000)
  }

  return (
    <div className="rounded-[24px] bg-white border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[16px] flex items-center gap-2"><ImageIcon size={18} /> Media Library - {college.shortName}</h3>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('images')} className={`h-9 px-4 rounded-full text-[12px] font-semibold border ${activeTab==='images'?'bg-zinc-900 text-white border-zinc-900':'bg-white'}`}>Images ({images.length})</button>
          <button onClick={() => setActiveTab('videos')} className={`h-9 px-4 rounded-full text-[12px] font-semibold border ${activeTab==='videos'?'bg-zinc-900 text-white':'bg-white'}`}>Videos</button>
          <button onClick={() => setActiveTab('docs')} className={`h-9 px-4 rounded-full text-[12px] font-semibold border ${activeTab==='docs'?'bg-zinc-900 text-white':'bg-white'}`}>Documents</button>
        </div>
      </div>

      {/* Upload Area - College can add images */}
      <div className="rounded-[20px] border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center hover:border-zinc-900 hover:bg-zinc-50 transition-colors group">
        <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" id="media-upload" />
        <label htmlFor="media-upload" className="cursor-pointer">
          <div className="h-14 w-14 rounded-[16px] bg-white border shadow-sm grid place-items-center mx-auto group-hover:scale-105 transition-transform">
            <Upload size={24} />
          </div>
          <div className="font-semibold text-[14px] mt-4">Click to upload or drag and drop</div>
          <div className="text-[12px] text-zinc-500 mt-1">PNG, JPG, WEBP up to 10MB each - Campus images, events, facilities</div>
          <div className="mt-4 inline-flex h-9 px-5 rounded-full bg-zinc-900 text-white text-[12px] font-semibold items-center gap-2"><Upload size={14} /> Upload Images</div>
        </label>
        {uploading && <div className="mt-4 text-[12px] text-amber-600 font-medium animate-pulse">Uploading... College images will appear uniquely on website with correct alignment</div>}
      </div>

      {/* Image Grid - Shows how images will appear uniquely */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div key={i} className="group relative rounded-[16px] overflow-hidden border bg-zinc-50 aspect-[4/3]">
            <img src={img} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
              <div className="flex gap-2">
                <button className="flex-1 h-8 rounded-full bg-white text-black text-[11px] font-bold">Use</button>
                <button className="h-8 w-8 rounded-full bg-white/20 backdrop-blur text-white grid place-items-center"><X size={14} /></button>
              </div>
            </div>
            <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-white/90 backdrop-blur grid place-items-center">
              <GripVertical size={12} />
            </div>
            {i < 3 && <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-amber-400 text-black text-[10px] font-bold">Hero</span>}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[16px] bg-blue-50 border border-blue-200 p-4">
        <div className="text-[12px] font-bold text-blue-800 flex items-center gap-1.5"><Check size={14} /> Auto Alignment Guarantee</div>
        <div className="text-[12px] text-blue-700/80 mt-1 leading-[1.5]">Images added here automatically appear on public website with premium card layout, correct aspect ratio, lazy loading, and unique college branding. No broken alignment - platform controls grid system.</div>
      </div>
    </div>
  )
}
