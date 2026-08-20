import { useState } from 'react';
import { issues } from '../data';
import { Issue, IssueCategory, IssueStatus } from '../types';
import CityMap from '../components/CityMap';
import StatusBadge from '../components/StatusBadge';

const categoryFilters: (IssueCategory | 'All')[] = ['All', 'Roads & Potholes', 'Drainage', 'Garbage', 'Streetlights', 'Water'];
const statusFilters: (IssueStatus | 'All')[] = ['All', 'pending', 'in-progress', 'resolved', 'sla-breached'];
const statusLabel: Record<IssueStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  'sla-breached': 'SLA Breached',
};

export default function CivicMap() {
  const [catFilter, setCatFilter] = useState<IssueCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = issues.filter((i) => {
    const matchCat = catFilter === 'All' || i.category === catFilter;
    const matchStatus = statusFilter === 'All' || i.status === statusFilter;
    const matchSearch =
      !search ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase()) ||
      i.ward.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const selected = issues.find((i) => i.id === selectedId) || null;

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden">
      {/* Filter bar */}
      <div className="bg-surface border-b border-border px-4 py-2.5 space-y-2 shrink-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-muted uppercase tracking-wide mr-1 shrink-0">Category</span>
          {categoryFilters.map((f) => (
            <button
              key={f}
              onClick={() => setCatFilter(f as IssueCategory | 'All')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                catFilter === f ? 'bg-primary text-white' : 'bg-muted-bg text-muted hover:text-navy hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
          <div className="w-px h-4 bg-border mx-1" />
          <span className="text-xs font-semibold text-muted uppercase tracking-wide mr-1 shrink-0">Status</span>
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f as IssueStatus | 'All')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === f ? 'bg-navy text-white' : 'bg-muted-bg text-muted hover:text-navy hover:bg-slate-100'
              }`}
            >
              {f === 'All' ? 'All' : statusLabel[f as IssueStatus]}
            </button>
          ))}
          <div className="ml-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ward / area / ticket..."
              className="border border-border rounded-md px-2.5 py-1 text-xs w-48 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="text-[10px] text-muted font-mono">
          Showing <strong className="text-navy">{filtered.length}</strong> of {issues.length} issues
        </div>
      </div>

      {/* Map + side panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className={`flex-1 p-3 overflow-hidden transition-all ${selected ? 'md:mr-0' : ''}`}>
          <div className="h-full rounded-xl overflow-hidden border border-border shadow-sm">
            <CityMap
              issues={filtered}
              selectedId={selectedId || undefined}
              onMarkerClick={(id) => setSelectedId(id === selectedId ? null : id)}
            />
          </div>
        </div>

        {/* Side panel */}
        {selected && (
          <div className="w-72 shrink-0 border-l border-border bg-surface overflow-y-auto">
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] text-primary font-semibold">{selected.id}</span>
                  <h3 className="font-display font-bold text-navy text-sm leading-snug mt-0.5">{selected.title}</h3>
                </div>
                <button onClick={() => setSelectedId(null)} className="text-muted hover:text-navy text-sm shrink-0 mt-0.5">✕</button>
              </div>

              <StatusBadge status={selected.status} size="md" />

              <div className="space-y-2 text-xs">
                {[
                  { label: 'Category', value: selected.category },
                  { label: 'Location', value: selected.location },
                  { label: 'Ward', value: selected.ward },
                  { label: 'Department', value: selected.department },
                  { label: 'Reported', value: selected.reportedDate },
                  { label: 'SLA', value: selected.slaDuration },
                ].map((f) => (
                  <div key={f.label} className="flex items-start gap-1.5">
                    <span className="font-semibold text-muted w-20 shrink-0">{f.label}:</span>
                    <span className="text-navy">{f.value}</span>
                  </div>
                ))}
              </div>

              {/* SLA */}
              {selected.slaBreached ? (
                <div className="bg-critical-bg text-critical-text text-xs font-semibold rounded-lg px-2.5 py-2">
                  ⚠ SLA Breached · Escalated
                </div>
              ) : selected.slaRemaining === 'Resolved' ? (
                <div className="bg-resolved-bg text-resolved-text text-xs font-semibold rounded-lg px-2.5 py-2">
                  ✓ Resolved within SLA
                </div>
              ) : (
                <div className="bg-info-bg text-info-text text-xs font-semibold rounded-lg px-2.5 py-2 font-mono">
                  ⏱ {selected.slaRemaining} remaining
                </div>
              )}

              {/* Confirmations */}
              <div className="bg-muted-bg rounded-lg px-3 py-2 text-xs">
                <span className="font-semibold text-navy">{selected.confirmations}</span>
                <span className="text-muted"> citizens affected</span>
                {selected.relatedReports > 1 && (
                  <span className="text-muted"> · {selected.relatedReports} related reports</span>
                )}
              </div>

              <p className="text-xs text-muted leading-relaxed">{selected.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
