import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  Atom,
  Cog,
  Sparkles,
  BookOpen,
  Landmark,
  Award,
  Trees,
  Sun,
  Compass,
  Stethoscope,
  ShieldAlert
} from 'lucide-react';

const getSymbolIcon = (symbol, sizeClass = "w-5 h-5") => {
  switch (symbol) {
    case 'tower':
    case 'temple':
      return <Landmark className={sizeClass} />;
    case 'atom':
      return <Atom className={sizeClass} />;
    case 'gear':
      return <Cog className={sizeClass} />;
    case 'sparkles':
      return <Sparkles className={sizeClass} />;
    case 'book':
      return <BookOpen className={sizeClass} />;
    case 'award':
      return <Award className={sizeClass} />;
    case 'tree':
      return <Trees className={sizeClass} />;
    case 'sun':
      return <Sun className={sizeClass} />;
    case 'compass':
      return <Compass className={sizeClass} />;
    case 'stethoscope':
      return <Stethoscope className={sizeClass} />;
    case 'shield':
      return <ShieldAlert className={sizeClass} />;
    default:
      return <GraduationCap className={sizeClass} />;
  }
};

export default function CollegeLogo({ college, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false);

  const sizeDimensions = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-24 h-24 text-lg'
  };

  const dim = sizeDimensions[size] || sizeDimensions.md;
  const gradientClass = college.badgeColor || 'from-blue-600 to-indigo-800';

  // If user provided a real working image and it hasn't errored
  if (college.logoUrl && !imgError) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-white p-1.5 shadow-md border border-slate-200/80 overflow-hidden shrink-0 ${dim} ${className}`}>
        <img
          src={college.logoUrl}
          alt={`${college.name} Logo`}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {/* Subtle verified indicator ring */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 pointer-events-none" />
      </div>
    );
  }

  // Fallback Crest Emblem with authentic university styling
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${gradientClass} text-white shadow-md border-2 border-white/30 overflow-hidden shrink-0 transition-all duration-300 hover:shadow-lg ${dim} ${className}`}
      title={`${college.name} Crest`}
    >
      {/* Decorative inner circle ring */}
      <div className="absolute inset-1 rounded-xl border border-white/25 pointer-events-none" />
      
      {/* Background seal pattern */}
      <div className="absolute -bottom-2 -right-2 opacity-15 pointer-events-none">
        {getSymbolIcon(college.crestSymbol, "w-16 h-16")}
      </div>

      {/* Main Symbol & Initials */}
      <div className="relative z-10 flex flex-col items-center justify-center leading-none">
        <div className="mb-0.5 opacity-90 drop-shadow-sm">
          {getSymbolIcon(college.crestSymbol, size === 'sm' ? 'w-4 h-4' : size === 'lg' || size === 'xl' ? 'w-8 h-8' : 'w-5 h-5')}
        </div>
        <span className="font-black tracking-wider uppercase drop-shadow font-mono text-[0.7rem] scale-90 sm:scale-100">
          {college.crestInitials || college.shortName?.slice(0, 4) || 'CLG'}
        </span>
      </div>

      {/* Gold bottom accent */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 opacity-90" />
    </div>
  );
}
