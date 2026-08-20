import { useState } from 'react';
import { categoryStats, wardStats } from '../data';

// ── Complaint Status Pie ──────────────────────────────────────────────────────
const statusSlices = [
  { label: 'Resolved',    count: 643,  color: '#16A34A' },
  { label: 'In Progress', count: 287,  color: '#0284C7' },
  { label: 'Assigned',    count: 156,  color: '#7C3AED' },
  { label: 'Pending',     count: 142,  color: '#D97706' },
  { label: 'SLA Breached',count: 56,   color: '#DC2626' },
];

function StatusPie() {
  const [hovered, setHovered] = useState<string | null>(null);
  const total = statusSlices.reduce((s, x) => s + x.count, 0);
  const cx = 100, cy = 100, r = 80;

  // Build SVG path arcs
  let cumAngle = -90; // start at top
  const paths = statusSlices.map((slice) => {
    const angle = (slice.count / total) * 360;
    const startRad = (cumAngle * Math.PI) / 180;
    const endRad   = ((cumAngle + angle) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const large = angle > 180 ? 1 : 0;
    const midRad = ((cumAngle + angle / 2) * Math.PI) / 180;
    const midAngle = cumAngle + angle / 2;
    cumAngle += angle;
    return { ...slice, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, midRad, midAngle, pct: Math.round((slice.count / total) * 100) };
  });

  const active = hovered ? paths.find((p) => p.label === hovered) : null;

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <h2 className="text-sm font-semibold text-navy mb-4">Complaint Status Breakdown</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG donut */}
        <div className="relative shrink-0" style={{ width: 200, height: 200 }}>
          <svg viewBox="0 0 200 200" width="200" height="200">
            {paths.map((p) => {
              const isActive = hovered === p.label;
              const scale = isActive ? 1.04 : 1;
              return (
                <path
                  key={p.label}
                  d={p.d}
                  fill={p.color}
                  opacity={hovered && !isActive ? 0.45 : 1}
                  stroke="white"
                  strokeWidth="2"
                  style={{ transform: `scale(${scale})`, transformOrigin: '100px 100px', transition: 'all 0.15s ease', cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(p.label)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
            {/* Centre hole */}
            <circle cx="100" cy="100" r="48" fill="white" />
            {/* Centre text */}
            {active ? (
              <>
                <text x="100" y="94" textAnchor="middle" fontSize="18" fontWeight="800" fill={active.color} fontFamily="inherit">{active.pct}%</text>
                <text x="100" y="110" textAnchor="middle" fontSize="9.5" fill="#64748B" fontFamily="inherit">{active.count} issues</text>
              </>
            ) : (
              <>
                <text x="100" y="96" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0F172A" fontFamily="inherit">{total}</text>
                <text x="100" y="112" textAnchor="middle" fontSize="9.5" fill="#64748B" fontFamily="inherit">Total Complaints</text>
              </>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {paths.map((p) => (
            <div
              key={p.label}
              className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"
              style={{ backgroundColor: hovered === p.label ? `${p.color}12` : 'transparent' }}
              onMouseEnter={() => setHovered(p.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              <span className="flex-1 text-sm font-medium text-navy">{p.label}</span>
              <span className="font-mono text-sm font-bold text-navy">{p.count}</span>
              <span className="text-xs text-muted w-9 text-right">{p.pct}%</span>
              <div className="w-20 h-1.5 bg-muted-bg rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
              </div>
            </div>
          ))}
          <p className="text-[10px] text-slate-400 pt-1 pl-3">Hover a slice or row to highlight · Total: {total} complaints</p>
        </div>
      </div>
    </div>
  );
}

const dateFilters = ['Today', '7 Days', '30 Days', 'Custom'];

const kpis = [
  { value: '1,284', label: 'Total Reports', sub: '+47 today' },
  { value: '643', label: 'Resolved', sub: '50.1% resolution rate' },
  { value: '87%', label: 'SLA Compliance', sub: '↑ 3% from last week' },
  { value: '38h', label: 'Avg. Resolution', sub: 'Target: 36h' },
];

const resolutionTimes = [
  { label: 'Roads', hours: 52 },
  { label: 'Drainage', hours: 34 },
  { label: 'Garbage', hours: 18 },
  { label: 'Streetlights', hours: 28 },
  { label: 'Water', hours: 22 },
  { label: 'Other', hours: 44 },
];

const maxHours = Math.max(...resolutionTimes.map((r) => r.hours));
const maxCount = Math.max(...categoryStats.map((c) => c.count));

export default function Statistics() {
  const [dateFilter, setDateFilter] = useState('30 Days');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy mb-1">Civic Statistics</h1>
          <p className="text-muted text-sm">Pratapgarh Nagar Palika · Public Transparency Dashboard</p>
        </div>
        <div className="flex gap-1 bg-muted-bg rounded-lg p-1">
          {dateFilters.map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                dateFilter === f ? 'bg-surface text-navy shadow-sm border border-border' : 'text-muted hover:text-navy'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Demo label */}
      <div className="flex items-center gap-2 text-xs text-warning-text bg-warning-bg border border-warning rounded-lg px-3 py-2">
        <span>⚠</span>
        <span>Prototype / Demo Data — All numbers are fictional and for illustration purposes only.</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-surface rounded-xl border border-border p-4">
            <p className="font-display text-3xl font-extrabold text-navy leading-none mb-1">{k.value}</p>
            <p className="text-xs font-semibold text-muted">{k.label}</p>
            <p className="text-[10px] text-slate-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Status pie chart */}
      <StatusPie />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Issues by Category */}
        <div className="bg-surface rounded-xl border border-border p-4">
          <h2 className="text-sm font-semibold text-navy mb-4">Issues by Category</h2>
          <div className="space-y-3">
            {categoryStats.map((c) => {
              const pct = Math.round((c.count / maxCount) * 100);
              const resolvedPct = Math.round((c.resolved / c.count) * 100);
              return (
                <div key={c.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-navy">{c.category}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted">{c.count}</span>
                      <span className="font-semibold text-resolved">{resolvedPct}% resolved</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted-bg rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resolution Time */}
        <div className="bg-surface rounded-xl border border-border p-4">
          <h2 className="text-sm font-semibold text-navy mb-4">Avg. Resolution Time (hours)</h2>
          <div className="space-y-3">
            {resolutionTimes.map((r) => {
              const pct = Math.round((r.hours / maxHours) * 100);
              const color = r.hours > 48 ? '#DC2626' : r.hours > 30 ? '#D97706' : '#16A34A';
              return (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-navy">{r.label}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color }}>{r.hours}h</span>
                  </div>
                  <div className="h-2 bg-muted-bg rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#16A34A]" />Under 30h (Good)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#D97706]" />30–48h (Warning)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#DC2626]" />Over 48h</span>
          </div>
        </div>
      </div>

      {/* SLA Compliance Chart */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <h2 className="text-sm font-semibold text-navy mb-4">SLA Compliance by Department</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { dept: 'PWD Roads Division', compliant: 82, total: 420 },
            { dept: 'Sanitation Division', compliant: 91, total: 312 },
            { dept: 'Electrical Division', compliant: 96, total: 156 },
            { dept: 'Jal Nigam', compliant: 78, total: 98 },
            { dept: 'Public Works Dept.', compliant: 84, total: 267 },
            { dept: 'Other Departments', compliant: 88, total: 31 },
          ].map((d) => {
            const color = d.compliant >= 90 ? '#16A34A' : d.compliant >= 80 ? '#D97706' : '#DC2626';
            const circumference = 2 * Math.PI * 28;
            const strokeDash = (d.compliant / 100) * circumference;
            return (
              <div key={d.dept} className="flex items-center gap-3">
                <div className="relative w-14 h-14 shrink-0">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#F1F5F9" strokeWidth="6" />
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      stroke={color}
                      strokeWidth="6"
                      strokeDasharray={`${strokeDash} ${circumference}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[11px] font-bold" style={{ color }}>{d.compliant}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy leading-tight">{d.dept}</p>
                  <p className="text-[10px] text-muted mt-0.5">{d.total} total issues</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ward table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-navy">Issues by Ward</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted-bg">
                <th className="text-left px-4 py-2 text-[11px] font-semibold text-muted uppercase tracking-wide">Ward</th>
                <th className="text-right px-4 py-2 text-[11px] font-semibold text-muted uppercase tracking-wide">Total</th>
                <th className="text-right px-4 py-2 text-[11px] font-semibold text-muted uppercase tracking-wide">Resolved</th>
                <th className="text-right px-4 py-2 text-[11px] font-semibold text-muted uppercase tracking-wide">Pending</th>
                <th className="text-left px-4 py-2 text-[11px] font-semibold text-muted uppercase tracking-wide">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {wardStats.map((w) => {
                const rate = Math.round((w.resolved / w.total) * 100);
                const pending = w.total - w.resolved;
                return (
                  <tr key={w.ward} className="hover:bg-muted-bg transition-colors">
                    <td className="px-4 py-2 font-medium text-navy text-sm">{w.ward}</td>
                    <td className="px-4 py-2 text-right font-mono text-sm text-muted">{w.total}</td>
                    <td className="px-4 py-2 text-right font-mono text-sm text-resolved">{w.resolved}</td>
                    <td className="px-4 py-2 text-right font-mono text-sm text-warning">{pending}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted-bg rounded-full overflow-hidden max-w-24">
                          <div
                            className="h-full bg-resolved rounded-full"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-resolved w-8">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
