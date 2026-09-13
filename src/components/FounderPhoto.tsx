import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Upload, Camera, Check, Sparkles } from 'lucide-react';

interface FounderPhotoProps {
  photoUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onPhotoChange?: (newUrl: string) => void;
  showUploadControls?: boolean;
}

export const FounderPhoto: React.FC<FounderPhotoProps> = ({
  photoUrl,
  className = '',
  size = 'xl',
  onPhotoChange,
  showUploadControls = true,
}) => {
  // Candidate fallback list
  const fallbackList = ['/assets/founder.jpeg', '/assets/founder.jpg', '/assets/founder.png', '/assets/founder.svg'];
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string>(() => {
    // 1. Check localStorage first for user uploaded real photo
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('srijantech_founder_photo');
      if (stored) return stored;
    }
    return photoUrl || fallbackList[0];
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when prop changes
  useEffect(() => {
    if (photoUrl) {
      setImgSrc(photoUrl);
    }
  }, [photoUrl]);

  // Listen to global founder photo updates
  useEffect(() => {
    const handleGlobalUpdate = (e: CustomEvent<string>) => {
      if (e.detail) {
        setImgSrc(e.detail);
      }
    };
    window.addEventListener('founder_photo_updated' as any, handleGlobalUpdate);
    return () => {
      window.removeEventListener('founder_photo_updated' as any, handleGlobalUpdate);
    };
  }, []);

  const handleImageError = () => {
    if (candidateIndex < fallbackList.length - 1) {
      const nextIndex = candidateIndex + 1;
      setCandidateIndex(nextIndex);
      setImgSrc(fallbackList[nextIndex]);
    }
  };

  const processAndUploadFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      if (!base64Data) {
        setIsUploading(false);
        return;
      }

      // 1. Instant local display & storage
      setImgSrc(base64Data);
      try {
        localStorage.setItem('srijantech_founder_photo', base64Data);
      } catch (err) {
        console.warn('Could not store photo in localStorage quota:', err);
      }

      // Notify parent & global listeners
      if (onPhotoChange) {
        onPhotoChange(base64Data);
      }
      window.dispatchEvent(new CustomEvent('founder_photo_updated', { detail: base64Data }));

      // 2. Persist to server filesystem (/public/assets/founder.jpeg) for Git & Vercel deployment
      try {
        const res = await fetch('/api/upload-founder-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Data }),
        });
        if (res.ok) {
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3500);
        }
      } catch (err) {
        console.error('Server sync error for founder photo:', err);
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const sizeClasses = {
    sm: 'w-28 h-36',
    md: 'w-56 h-72',
    lg: 'w-72 h-96 sm:w-80 sm:h-[440px]',
    xl: 'w-full max-w-[360px] h-[430px] sm:h-[480px]',
  };

  return (
    <div className={`relative group flex flex-col items-center ${className}`}>
      {/* SrijanTech Ambient Cyan Glow */}
      <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-cyan-500/25 via-blue-600/20 to-sky-400/15 blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

      {/* Main Image Frame - Responsive Aspect Ratio, Rounded Rectangle, Cyan Border */}
      <div
        className={`relative overflow-hidden rounded-[2rem] bg-slate-950 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/50 flex flex-col items-center justify-center ${sizeClasses[size]}`}
      >
        <img
          src={imgSrc}
          alt="Srijan Singh - Founder & Director, SrijanTech"
          onError={handleImageError}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.015]"
          loading="eager"
        />

        {/* Small Badge: "Founder & Director" (as explicitly specified) */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse" />
            <div>
              <div className="text-white text-xs font-bold font-['Outfit'] leading-tight">
                Srijan Singh
              </div>
              <div className="text-[10px] text-cyan-400 font-semibold tracking-wide">
                Founder &amp; Director
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-semibold text-cyan-300">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>SrijanTech</span>
          </div>
        </div>

        {/* Quick Upload / Sync Button Overlay for the real photo */}
        {showUploadControls && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Click to select/update your real founder photo (photo offical.jpeg)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-lg transition-all cursor-pointer opacity-90 group-hover:opacity-100"
            >
              {isUploading ? (
                <>
                  <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : uploadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Photo Saved</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Update Photo</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
