import React, { useState } from 'react';
import { MapPin, ShieldCheck, Sparkles, Upload } from 'lucide-react';

interface FounderPhotoProps {
  photoUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onPhotoChange?: (newUrl: string) => void;
}

export const FounderPhoto: React.FC<FounderPhotoProps> = ({
  photoUrl = '/assets/founder.png',
  className = '',
  size = 'lg',
  onPhotoChange,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(photoUrl || '/assets/founder.png');
  const [hasError, setHasError] = useState<boolean>(false);

  // Keep state in sync if prop changes
  React.useEffect(() => {
    if (photoUrl) {
      setImgSrc(photoUrl);
      setHasError(false);
    }
  }, [photoUrl]);

  const sizeClasses = {
    sm: 'w-24 h-28',
    md: 'w-52 h-64',
    lg: 'w-72 h-96 sm:w-84 sm:h-[430px]',
    xl: 'w-80 h-[460px] sm:w-96 sm:h-[500px]',
  };

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback gracefully to bundled SVG asset
      setImgSrc('/assets/founder.svg');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImgSrc(result);
          if (onPhotoChange) {
            onPhotoChange(result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Subtle SrijanTech Ambient Cyan / Blue Glow */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-cyan-500/30 via-blue-600/20 to-sky-400/20 blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

      {/* Main Image Frame - Rounded Rectangle with Subtle Cyan Border */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/40 flex flex-col items-center justify-center ${sizeClasses[size]}`}
      >
        <img
          src={imgSrc}
          alt="Srijan Singh - Founder & Director, SrijanTech"
          onError={handleImageError}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]"
          loading="eager"
        />

        {/* Founder & Director Official Insignia Pill */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse" />
            <div>
              <div className="text-white text-xs font-bold font-['Outfit'] leading-tight">
                Srijan Singh
              </div>
              <div className="text-[10px] text-cyan-400 font-medium">
                Founder &amp; Director
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-semibold text-cyan-300">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>Verified</span>
          </div>
        </div>

        {/* Quick Photo Upload Trigger (For easy updates if user provides new photo) */}
        {onPhotoChange && (
          <label className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700 text-slate-300 text-xs cursor-pointer transition-all opacity-0 group-hover:opacity-100 shadow-md">
            <Upload className="w-3.5 h-3.5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};
