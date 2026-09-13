import React from 'react';
import { WebsiteSettings } from '../types';
import { FounderPhoto } from '../components/FounderPhoto';
import {
  MapPin,
  Mail,
  Phone,
  Target,
  Compass,
  CheckCircle2,
  Cpu,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AboutPageProps {
  settings: WebsiteSettings;
  onNavigate: (tab: string) => void;
  onOpenEnquiry: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate, onOpenEnquiry }) => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Top Breadcrumb / Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <MapPin className="w-3.5 h-3.5" />
          Varanasi, Uttar Pradesh, India
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          About SrijanTech & Founder
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          {settings.tagline}
        </p>
      </div>

      {/* Founder & About SrijanTech Section */}
      <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT SIDE: Exact Founder Photo */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <FounderPhoto photoUrl={settings.founder_photo_url || '/assets/founder.png'} size="xl" />
        </div>

        {/* RIGHT SIDE: Structured Founder & Company Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              SrijanTech
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Srijan Singh
            </h2>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-cyan-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Founder &amp; Director
            </div>
          </div>

          {/* Primary Statement Block */}
          <blockquote className="p-4 rounded-2xl bg-slate-950/80 border-l-4 border-cyan-400 border-y border-r border-slate-800 text-slate-200 text-sm sm:text-base leading-relaxed italic">
            &ldquo; SrijanTech is a digital solutions company focused on building modern websites, web applications, e-commerce platforms, and reliable digital experiences for businesses and organizations. &rdquo;
          </blockquote>

          {/* Professional Company Introduction */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Based in the historic city of Varanasi, Uttar Pradesh, SrijanTech delivers production-grade web engineering designed for tangible commercial reliability. We work closely with business founders, educational institutions, healthcare centers, retailers, and entrepreneurs to architect digital systems that load fast, scale smoothly, and convert visitors into long-term clients.
            </p>
          </div>

          {/* Technology-Focused Approach */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Technology-Focused Approach
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every project is constructed on modern, robust web standards: React, TypeScript, Vite, Tailwind CSS, PostgreSQL, and native Indian payment architectures including dynamic UPI QR settlement. We reject bloated monolithic site builders in favor of clean, performant, and fully maintainable source code.
            </p>
          </div>

          {/* Mission & Vision Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
              <Target className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Mission</span>
                <span className="text-slate-400">Deliver clean, high-impact digital products through technical clarity.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Vision</span>
                <span className="text-slate-400">Build world-class web software that empowers businesses to scale.</span>
              </div>
            </div>
          </div>

          {/* Contact Badges & CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenEnquiry}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25 transition-all"
            >
              <span>Start Your Project →</span>
            </button>

            <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span>Varanasi, Uttar Pradesh, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white font-['Outfit']">Our Vision</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{settings.vision}</p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white font-['Outfit']">Our Mission</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{settings.mission}</p>
        </div>
      </div>

      {/* Varanasi Heritage & Modern Tech Synergy */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
            Rooted in Varanasi
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
            Global Technical Standards from the Cultural Capital
          </h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Varanasi is celebrated for ancient heritage, timeless wisdom, and bustling commerce.
            At SrijanTech, we honor this heritage by introducing modern, cutting-edge digital
            craftsmanship—building enterprise-grade web applications with the same devotion and
            enduring quality that defines our city.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <h5 className="font-bold text-white mb-1">Local Business Empowerment</h5>
            <p className="text-slate-400">
              Enabling Varanasi retailers, schools, and artisans to compete with digital leaders nationwide.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <h5 className="font-bold text-white mb-1">Modern Indian UPI</h5>
            <p className="text-slate-400">
              Zero-friction QR and instant payments engineered directly for Indian consumers and merchants.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <h5 className="font-bold text-white mb-1">Architectural Integrity</h5>
            <p className="text-slate-400">
              Strict adherence to clean code, semantic TypeScript, and reliable relational databases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
