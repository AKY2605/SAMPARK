import { useState } from 'react';
import { Page } from '../types';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navLinks: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Report Issue', page: 'report' },
  { label: 'Track Complaint', page: 'track' },
  { label: 'Civic Map', page: 'map' },
  { label: 'Statistics', page: 'statistics' },
  { label: 'Rewards', page: 'rewards' },
  { label: 'Community Fund', page: 'fund' },
];

export default function Header({ currentPage, onNavigate }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-6">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <span className="font-display font-bold text-navy text-[15px] leading-none tracking-tight">Sampark</span>
            <span className="text-[9px] font-semibold font-mono bg-muted-bg text-muted px-1.5 py-0.5 rounded uppercase tracking-wider">
              Varanasi
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? 'bg-primary-soft text-primary-text'
                    : 'text-muted hover:text-navy hover:bg-muted-bg'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 text-sm font-medium text-muted hover:text-navy border border-border rounded-md hover:border-slate-300 transition-colors"
            >
              Municipal Login
            </button>
            <button
              onClick={() => onNavigate('report')}
              className="px-3.5 py-1.5 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary-dark transition-colors shadow-sm"
            >
              Report an Issue
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <button
              onClick={() => onNavigate('report')}
              className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-md"
            >
              Report
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-muted hover:text-navy"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-2 space-y-0.5">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === link.page ? 'text-primary bg-primary-soft' : 'text-navy hover:bg-muted-bg'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }}
            className="block w-full text-left px-3 py-2 text-sm text-muted hover:bg-muted-bg rounded-md"
          >
            Municipal Login
          </button>
        </div>
      )}
    </header>
  );
}
