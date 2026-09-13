import React from 'react';
import { PricingPlan } from '../types';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface PricingPageProps {
  pricing: PricingPlan[];
  onSelectPlan: (plan: PricingPlan) => void;
  onOpenEnquiry: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  pricing,
  onSelectPlan,
  onOpenEnquiry,
}) => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Transparent Investment
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight mt-2">
          Simple, Fair Pricing with Clear Milestones
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Predictable costs with zero hidden maintenance surprises. All plans include direct
          consultation, clean code ownership, and structured advance payment terms.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricing.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between transition-all ${
              plan.is_popular
                ? 'bg-slate-900 border-2 border-cyan-500/70 shadow-2xl shadow-cyan-500/10 relative scale-105 z-10'
                : 'bg-slate-900/60 border border-slate-800'
            }`}
          >
            <div>
              {plan.badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-2xl font-bold text-white font-['Outfit']">{plan.name}</h3>
              <p className="text-xs text-slate-300 mt-2 min-h-[36px] leading-relaxed">
                {plan.short_description}
              </p>

              <div className="my-6 pt-4 border-t border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                  {plan.price_type === 'custom_quote' ? 'Estimate Base' : 'Starting From'}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
                    ₹{plan.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-mono text-slate-400">INR</span>
                </div>
                <div className="mt-2 text-[11px] text-cyan-400 font-medium">
                  {plan.advance_percentage}% Advance to initiate project
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 mb-8 text-xs text-slate-300">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-semibold shadow-md transition-all ${
                  plan.is_popular
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {plan.price_type === 'custom_quote'
                  ? 'Request Custom Quote'
                  : 'Select & Pay Advance'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Security & Milestones Notice */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 max-w-3xl mx-auto flex items-center gap-4 text-xs text-slate-400">
        <ShieldCheck className="w-8 h-8 text-cyan-400 flex-shrink-0" />
        <div>
          <strong className="text-slate-200 block text-sm font-['Outfit'] mb-0.5">
            Transparent Milestone Terms &amp; Indian UPI
          </strong>
          All transactions are conducted in Indian Rupees (INR) via official UPI (7269068483@ptyes)
          or bank gateway. You receive a verified Tax Invoice and downloadable PDF receipt for each
          payment stage.
        </div>
      </div>
    </div>
  );
};
