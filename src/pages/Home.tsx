import { useState } from 'react';
import { issues, categoryStats } from '../data';
import { Page } from '../types';
import StatusBadge from '../components/StatusBadge';

interface Props {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

const today = new Date();
const dayName = today.toLocaleDateString('en-IN', { weekday: 'long' });
const dateStr = today.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

// Sidebar: informational/help links — NOT the same as the top nav
const sidebarItems: {
  type: 'link' | 'divider' | 'info';
  label?: string;
  sub?: string;
  page?: Page;
  emoji?: string;
}[] = [
  { type: 'link', emoji: '🎖️', label: 'Rewards & Certificates', sub: 'Earn vouchers & certificates', page: 'rewards' },
  { type: 'link', emoji: '💰', label: 'Community Fund', sub: 'Track & raise civic funds', page: 'fund' },
  { type: 'divider' },
  { type: 'link', emoji: '📢', label: 'Announcements', sub: 'Municipal notices & news', page: 'announcements' },
  { type: 'link', emoji: '❓', label: 'FAQ & Help', sub: 'Common questions answered', page: 'faq' },
  { type: 'divider' },
  { type: 'info', emoji: '⏱', label: 'SLA Policy', sub: 'Garbage 12h · Roads 48h · Others 24h' },
  { type: 'info', emoji: '📞', label: 'Helpdesk', sub: '1800-XXX-XXXX (Toll Free)' },
  { type: 'divider' },
  { type: 'link', emoji: '🏛️', label: 'Municipal Login', sub: 'Officer / admin access', page: 'dashboard' },
];

// Tiles: 2 primary actions + 2 new pages (not in top nav)
const tiles: { label: string; desc: string; page: Page; bg: string; icon: string }[] = [
  {
    label: 'Report an Issue',
    desc: 'File a geo-tagged civic complaint',
    page: 'report',
    bg: '#1E40AF',
    icon: '📋',
  },
  {
    label: 'Track Complaint',
    desc: 'Enter your ticket ID for status',
    page: 'track',
    bg: '#B45309',
    icon: '🔍',
  },
  {
    label: 'Rewards & Certificates',
    desc: 'Earn vouchers and a contribution certificate',
    page: 'rewards',
    bg: '#6D28D9',
    icon: '🎖️',
  },
  {
    label: 'Community Fund',
    desc: 'Raise money to fix civic problems directly',
    page: 'fund',
    bg: '#0F766E',
    icon: '💰',
  },
];

const slaRules = [
  { cat: 'Garbage', sla: '12h', color: '#DC2626' },
  { cat: 'Drainage', sla: '24h', color: '#D97706' },
  { cat: 'Streetlights', sla: '24h', color: '#D97706' },
  { cat: 'Water', sla: '24h', color: '#D97706' },
  { cat: 'Roads', sla: '48h', color: '#0369A1' },
];

function SlaCell({ remaining, breached }: { remaining: string; breached: boolean }) {
  if (remaining === 'Resolved') return <span className="text-resolved text-xs font-medium">Resolved</span>;
  if (breached) return <span className="text-critical text-xs font-semibold">Breached</span>;
  const hrs = parseInt(remaining);
  return <span className={`text-xs font-mono ${hrs < 4 ? 'text-warning font-semibold' : 'text-muted'}`}>{remaining}</span>;
}

const severityColors: Record<string, string> = {
  critical: '#B91C1C', high: '#B45309', medium: '#0369A1', low: '#15803D',
};
const severityBg: Record<string, string> = {
  critical: '#FEE2E2', high: '#FEF3C7', medium: '#E0F2FE', low: '#DCFCE7',
};

export default function Home({ onNavigate }: Props) {
  const recentIssues = issues.slice(0, 5);
  const maxCount = Math.max(...categoryStats.map((c) => c.count));

  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(issues.map((i) => [i.id, i.upvotes]))
  );
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({});

  const trendingIssues = [...issues].sort((a, b) => (upvoteCounts[b.id] ?? 0) - (upvoteCounts[a.id] ?? 0));

  function handleUpvote(id: string) {
    if (upvoted[id]) return;
    setUpvoteCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setUpvoted((prev) => ({ ...prev, [id]: true }));
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-bg">

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-surface border-r border-border">

        {/* Platform identity */}
        <div className="px-5 py-5 border-b border-border">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center mb-3 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-navy text-sm leading-tight">Sampark</h2>
          <p className="text-[11px] text-muted mt-0.5 leading-snug">Varanasi Civic<br />Issue Portal</p>
        </div>

        {/* Help & info links */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {sidebarItems.map((item, i) => {
            if (item.type === 'divider') {
              return <div key={i} className="h-px bg-border mx-5 my-2" />;
            }
            if (item.type === 'link') {
              return (
                <button
                  key={i}
                  onClick={() => onNavigate(item.page!)}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-muted-bg group transition-colors"
                >
                  <span className="text-base shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-navy group-hover:text-primary-text leading-tight">{item.label}</p>
                    <p className="text-[10px] text-muted leading-none mt-0.5">{item.sub}</p>
                  </div>
                  <span className="ml-auto text-[10px] text-slate-300 group-hover:text-primary">›</span>
                </button>
              );
            }
            // type === 'info' — non-clickable
            return (
              <div key={i} className="flex items-center gap-3 px-5 py-2">
                <span className="text-base shrink-0 opacity-60">{item.emoji}</span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-muted leading-tight">{item.label}</p>
                  <p className="text-[10px] text-slate-400 leading-none mt-0.5">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Mini category chart */}
        <div className="px-5 py-4 border-t border-border">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-3">Issues by Category</p>
          <div className="space-y-2">
            {categoryStats.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-muted truncate pr-2">{c.category}</span>
                  <span className="text-[10px] font-mono text-navy shrink-0">{c.count}</span>
                </div>
                <div className="h-1.5 bg-muted-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(c.count / maxCount) * 100}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="px-5 py-3 border-t border-border bg-muted-bg">
          <p className="font-mono text-[10px] text-muted uppercase tracking-wide">{dayName}</p>
          <p className="text-xs font-semibold text-navy mt-0.5">{dateStr}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-resolved animate-pulse" />
            <span className="text-[10px] text-muted">Live · Demo Data</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Hero image */}
        <div className="relative w-full shrink-0" style={{ height: '300px' }}>
          <img
            src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=300&fit=crop&auto=format"
            alt="Scenic view of Varanasi Ghats and Kashi City"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/30 to-transparent" />

          <div className="absolute bottom-5 left-5 sm:left-6">
            <p className="text-white/60 text-[10px] font-mono uppercase tracking-widest mb-1">नगर निगम · Varanasi (Kashi)</p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
              नागरिक सेवा केंद्र
            </h1>
            <p className="text-white/80 text-sm mt-1 font-medium">Civic Issue Reporting & Resolution Platform</p>
          </div>

          {/* Date top-right like reference */}
          <div className="absolute top-4 right-4 text-right">
            <p className="text-white/90 text-xs font-mono leading-snug">
              {today.getFullYear()}/{String(today.getMonth() + 1).padStart(2, '0')}/{String(today.getDate()).padStart(2, '0')}
            </p>
            <p className="text-white/60 text-[11px]">{dayName}</p>
          </div>
        </div>

        {/* Action tiles — 2 core functions + 2 new pages */}
        <div className="grid grid-cols-2 lg:grid-cols-4 shrink-0">
          {tiles.map((tile) => (
            <button
              key={tile.page}
              onClick={() => onNavigate(tile.page)}
              className="group flex flex-col items-start gap-2 px-5 py-4 text-left hover:brightness-110 transition-all"
              style={{ backgroundColor: tile.bg }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shadow"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                {tile.icon}
              </div>
              <div>
                <p className="text-white font-display font-bold text-sm leading-tight">{tile.label}</p>
                <p className="text-white/65 text-[11px] leading-snug mt-0.5 hidden sm:block">{tile.desc}</p>
              </div>
              <span className="text-white/40 text-xs group-hover:text-white/80 transition-colors mt-auto">Go →</span>
            </button>
          ))}
        </div>

        {/* Scrollable lower section */}
        <div className="flex-1 overflow-y-auto bg-bg p-4 sm:p-5 space-y-4">

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: '1,284', label: 'Total Reports', sub: 'Since launch' },
              { value: '643', label: 'Resolved', sub: '50% resolution rate' },
              { value: '87%', label: 'SLA Compliance', sub: '↑ 3% this week' },
              { value: '38h', label: 'Avg. Resolution', sub: 'Target: 36h' },
            ].map((s) => (
              <div key={s.label} className="bg-surface rounded-xl border border-border px-4 py-3">
                <p className="font-display text-2xl font-extrabold text-navy leading-none">{s.value}</p>
                <p className="text-[11px] font-semibold text-muted mt-0.5">{s.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Trending Problems */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted-bg">
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <h2 className="text-sm font-semibold text-navy">Trending Problems</h2>
                <span className="text-[10px] bg-critical-bg text-critical-text font-bold px-2 py-0.5 rounded-full">Live</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted">Sorted by community upvotes</span>
                <button onClick={() => onNavigate('rewards')} className="text-xs text-primary font-medium hover:underline">
                  Rewards →
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['#', 'Problem', 'Reported By', 'Ward', 'Severity', 'Status', 'Upvotes'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {trendingIssues.map((issue, idx) => (
                    <tr key={issue.id} className="hover:bg-muted-bg transition-colors">
                      <td className="px-3 py-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold ${
                          idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-white' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-muted-bg text-muted'
                        }`}>
                          {idx + 1}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 max-w-[180px]">
                        <button
                          onClick={() => onNavigate('track', { id: issue.id })}
                          className="text-left group"
                        >
                          <p className="font-medium text-navy text-xs leading-snug truncate group-hover:text-primary">{issue.title}</p>
                          <p className="text-[10px] font-mono text-primary">{issue.id}</p>
                        </button>
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="text-xs text-navy whitespace-nowrap">{issue.reportedBy}</p>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-[11px] text-muted whitespace-nowrap">{issue.ward}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize whitespace-nowrap"
                          style={{ color: severityColors[issue.severity], backgroundColor: severityBg[issue.severity] }}
                        >
                          {issue.severity}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          onClick={() => handleUpvote(issue.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                            upvoted[issue.id]
                              ? 'border-primary bg-primary-soft text-primary-text cursor-default'
                              : 'border-border text-muted hover:border-primary hover:text-primary'
                          }`}
                        >
                          <span>{upvoted[issue.id] ? '▲' : '△'}</span>
                          <span className="font-mono">{upvoteCounts[issue.id] ?? issue.upvotes}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 bg-muted-bg border-t border-border">
              <p className="text-[10px] text-muted">Upvotes help prioritize issues. The citizen who reports & resolves a top-upvoted issue earns Rewards points.</p>
            </div>
          </div>

          {/* Two-column: recent issues + SLA policy */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-4">

            {/* Recent issues */}
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-navy">Recent Complaints</h2>
                <button onClick={() => onNavigate('map')} className="text-xs text-primary font-medium hover:underline">
                  View Map →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted-bg">
                      {['Issue', 'Ward', 'Status', 'SLA', 'Ticket'].map((h) => (
                        <th key={h} className="text-left px-4 py-2 text-[11px] font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentIssues.map((issue) => (
                      <tr
                        key={issue.id}
                        className="hover:bg-muted-bg transition-colors cursor-pointer"
                        onClick={() => onNavigate('track', { id: issue.id })}
                      >
                        <td className="px-4 py-2.5 max-w-[200px]">
                          <p className="font-medium text-navy text-xs leading-snug truncate">{issue.title}</p>
                          <p className="text-[10px] text-muted">{issue.category}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs text-muted">{issue.ward}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={issue.status} />
                        </td>
                        <td className="px-4 py-2.5">
                          <SlaCell remaining={issue.slaRemaining} breached={issue.slaBreached} />
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-mono text-xs text-primary">{issue.id}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SLA quick reference */}
            <div className="space-y-3">
              <div className="bg-surface rounded-xl border border-border p-4">
                <h2 className="text-sm font-semibold text-navy mb-3">SLA Processing Times</h2>
                <div className="space-y-2">
                  {slaRules.map((r) => (
                    <div key={r.cat} className="flex items-center justify-between">
                      <span className="text-xs text-muted">{r.cat}</span>
                      <span className="font-mono text-xs font-bold" style={{ color: r.color }}>{r.sla}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border text-[10px] text-muted leading-relaxed">
                  Monsoon season: Drainage & waterlogging SLA reduced to 12h until 30 Sep 2026.
                </div>
                <button
                  onClick={() => onNavigate('faq')}
                  className="mt-2 text-xs text-primary font-medium hover:underline block"
                >
                  More in FAQ →
                </button>
              </div>

              <div className="bg-surface rounded-xl border border-border p-4">
                <h2 className="text-sm font-semibold text-navy mb-2">Latest Notice</h2>
                <p className="text-[11px] font-semibold text-warning-text bg-warning-bg rounded px-2 py-1 mb-2">Urgent</p>
                <p className="text-xs text-navy font-medium leading-snug">Varanasi Cantt Station Road partial closure: 22–25 Aug, 10 PM–5 AM</p>
                <p className="text-[10px] text-muted mt-1">Use Collectorate / Kutchery Road as alternative.</p>
                <button
                  onClick={() => onNavigate('announcements')}
                  className="mt-2 text-xs text-primary font-medium hover:underline block"
                >
                  All Announcements →
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center pb-1">
            Prototype / demonstration platform · Not an official government service · All data is fictional
          </p>
        </div>
      </div>
    </div>
  );
}
