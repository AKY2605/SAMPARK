import { Page } from '../types';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: Props) {
  return (
    <footer className="bg-navy-soft border-t border-slate-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <span className="font-display font-bold text-white text-sm">Sampark</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Varanasi Civic Issue Resolution Platform.<br />
              Report · Track · Verify.
            </p>
            <div className="mt-4 p-2.5 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">One Civic Window</p>
              <div className="flex flex-wrap gap-1.5">
                {['Web', 'Mobile', 'WhatsApp', 'Phone'].map((ch) => (
                  <span key={ch} className="text-[10px] text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">{ch}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Services</p>
            <div className="space-y-1.5">
              {(
                [
                  ['Report Issue', 'report'],
                  ['Track Complaint', 'track'],
                  ['Civic Map', 'map'],
                  ['Statistics', 'statistics'],
                  ['Municipal Login', 'dashboard'],
                ] as [string, Page][]
              ).map(([label, page]) => (
                <button
                  key={page}
                  onClick={() => onNavigate(page)}
                  className="block text-sm text-slate-400 hover:text-white transition-colors text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Contact</p>
            <div className="space-y-2 text-xs text-slate-400">
              <p>Nagar Nigam Varanasi</p>
              <p>Varanasi, Uttar Pradesh — 221002</p>
              <p>helpdesk@civictrack.varanasi.gov.in</p>
              <p>1800-XXX-XXXX (Toll Free)</p>
            </div>
            <div className="mt-4 space-y-1">
              <button className="block text-xs text-slate-500 hover:text-slate-300">Privacy Policy</button>
              <button className="block text-xs text-slate-500 hover:text-slate-300">RTI</button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-[10px] text-slate-600 leading-relaxed">
            Prototype / demonstration platform. Not an official government service unless formally adopted by Varanasi Nagar Nigam. All data shown is fictional and for demonstration purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
