import React, { useState } from 'react';

interface ProjectImageProps {
  src: string;
  alt: string;
  className?: string;
  slug?: string;
  category?: string;
  title?: string;
}

export const ProjectImage: React.FC<ProjectImageProps> = ({
  src,
  alt,
  className = '',
  slug = '',
  category = '',
  title = '',
}) => {
  // Try order: original src (e.g. .webp) -> .jpg -> .svg -> inline vector illustration
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [errorStage, setErrorStage] = useState<number>(0);

  const handleError = () => {
    if (errorStage === 0) {
      // Stage 1: Try .jpg if it was .webp
      if (currentSrc.endsWith('.webp')) {
        setCurrentSrc(currentSrc.replace(/\.webp$/, '.jpg'));
        setErrorStage(1);
        return;
      }
      if (currentSrc.endsWith('.svg')) {
        // Try webp or jpg
        const base = currentSrc.replace(/\.svg$/, '');
        setCurrentSrc(`${base}.webp`);
        setErrorStage(1);
        return;
      }
    }

    if (errorStage === 1) {
      // Stage 2: Try .svg if jpg failed
      const base = currentSrc.replace(/\.(webp|jpg|png)$/, '');
      setCurrentSrc(`${base}.svg`);
      setErrorStage(2);
      return;
    }

    // Stage 3: Render inline SVG fallback
    setErrorStage(3);
  };

  if (errorStage >= 3) {
    return (
      <div
        className={`w-full h-full min-h-[180px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center border border-slate-800 ${className}`}
      >
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-2 text-cyan-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-xs font-bold text-white tracking-tight">{title || 'Live Website Preview'}</div>
        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{category || 'SrijanTech Concept'}</div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      referrerPolicy="no-referrer"
      loading="lazy"
      className={`object-cover object-top w-full h-full transition-transform duration-500 group-hover/card:scale-105 ${className}`}
    />
  );
};
