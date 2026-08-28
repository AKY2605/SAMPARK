import { useState } from 'react';
import { issues } from '../data';
import { Issue } from '../types';
import StatusBadge from '../components/StatusBadge';

const progressSteps = ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Verified'];

const stepIndex: Record<string, number> = {
  pending: 0,
  assigned: 1,
  'in-progress': 2,
  resolved: 3,
  'sla-breached': 2,
};

const activityLog: Record<string, { time: string; text: string; type: 'info' | 'warn' | 'success' }[]> = {
  'VNS-20481': [
    { time: '2026-08-17 · 11:42', text: 'Complaint assigned to Public Works Department, Junior Engineer Ramesh Kumar.', type: 'info' },
    { time: '2026-08-17 · 14:05', text: 'Field inspection initiated at BHU Lanka Gate site. Team dispatched.', type: 'info' },
    { time: '2026-08-17 · 09:14', text: 'Complaint registered. Auto-categorised as Drainage (High severity). SLA: 24h.', type: 'info' },
  ],
  'VNS-20471': [
    { time: '2026-08-16 · 09:15', text: 'SLA breached. Complaint automatically escalated to Municipal Commissioner, Varanasi Nagar Nigam.', type: 'warn' },
    { time: '2026-08-15 · 19:30', text: 'SLA warning: 4h remaining. Sanitation Division notified.', type: 'warn' },
    { time: '2026-08-15 · 07:45', text: 'Complaint registered. SLA: 12h.', type: 'info' },
  ],
  'VNS-20465': [
    { time: '2026-08-15 · 10:30', text: 'Resolution verified by citizen. Ticket closed.', type: 'success' },
    { time: '2026-08-15 · 08:00', text: 'Streetlight repaired near Cantt Bus Stand. Resolution photo uploaded.', type: 'success' },
    { time: '2026-08-14 · 22:10', text: 'Assigned to Electrical Division, Technician Suresh.', type: 'info' },
    { time: '2026-08-14 · 20:00', text: 'Complaint registered. SLA: 24h.', type: 'info' },
  ],
};

function defaultLog(issue: Issue) {
  return [
    { time: `${issue.reportedDate} · ${issue.reportedTime}`, text: `Complaint registered. Category: ${issue.category}. SLA: ${issue.slaDuration}.`, type: 'info' as const },
  ];
}

interface Props {
  initialId?: string;
}

export default function TrackComplaint({ initialId }: Props) {
  const [query, setQuery] = useState(initialId || '');
  const [searched, setSearched] = useState(!!initialId);
  const [citizenVote, setCitizenVote] = useState<'fixed' | 'problem' | null>(null);

  const issue = issues.find((i) => i.id.toLowerCase() === query.trim().toLowerCase());
  const log = issue ? (activityLog[issue.id] || defaultLog(issue)) : [];
  const currentStep = issue ? stepIndex[issue.status] ?? 0 : 0;

  const handleSearch = () => setSearched(true);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy mb-1">Track Complaint</h1>
        <p className="text-muted text-sm">Enter your ticket ID to see the current status and activity.</p>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter complaint ID, e.g. VNS-20481"
          className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm font-mono text-navy placeholder:text-slate-400 focus:outline-none focus:border-primary"
        />
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors"
        >
          Track
        </button>
      </div>

      {/* Not found */}
      {searched && !issue && query && (
        <div className="bg-muted-bg border border-border rounded-xl p-6 text-center">
          <p className="text-muted text-sm">No complaint found for <span className="font-mono font-semibold text-navy">{query}</span>.</p>
          <p className="text-xs text-muted mt-1">Try: VNS-20481, VNS-20476, VNS-20471, VNS-20465, VNS-20459</p>
        </div>
      )}

      {/* Ticket panel */}
      {searched && issue && (
        <div className="space-y-4">
          {/* Header card */}
          <div className={`bg-surface rounded-xl border overflow-hidden shadow-sm ${issue.slaBreached ? 'border-critical' : 'border-border'}`}>
            {issue.slaBreached && (
              <div className="bg-critical-bg px-4 py-2 border-b border-critical">
                <p className="text-xs font-semibold text-critical-text flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  SLA Breached · Automatically Escalated to Executive Officer
                </p>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="font-mono text-xs text-primary font-semibold">{issue.id}</span>
                  <h2 className="font-display font-bold text-navy text-base leading-snug mt-0.5">{issue.title}</h2>
                </div>
                <StatusBadge status={issue.status} size="md" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                {[
                  { label: 'Location', value: issue.location },
                  { label: 'Department', value: issue.department },
                  { label: 'Reported', value: `${issue.reportedDate} · ${issue.reportedTime}` },
                  { label: 'SLA', value: issue.slaDuration },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">{f.label}</p>
                    <p className="text-navy text-xs font-medium">{f.value}</p>
                  </div>
                ))}
              </div>

              {/* SLA countdown */}
              {!issue.slaBreached && issue.slaRemaining !== 'Resolved' && (
                <div className={`rounded-lg px-3 py-2 text-sm font-semibold flex items-center gap-2 ${
                  parseInt(issue.slaRemaining) < 4 ? 'bg-warning-bg text-warning-text' : 'bg-info-bg text-info-text'
                }`}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-mono">{issue.slaRemaining}</span>
                  <span className="font-normal text-xs opacity-80">remaining in SLA window</span>
                </div>
              )}
              {issue.slaRemaining === 'Resolved' && (
                <div className="rounded-lg px-3 py-2 text-sm bg-resolved-bg text-resolved-text font-semibold flex items-center gap-2">
                  <span>✓</span> Resolved within SLA
                </div>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">Progress</h3>
            <div className="flex items-center gap-0">
              {progressSteps.map((label, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <div key={label} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        done ? 'bg-resolved text-white' : active ? 'bg-primary text-white ring-4 ring-primary-soft' : 'bg-muted-bg text-muted border border-border'
                      }`}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span className={`text-[10px] mt-1 text-center leading-tight font-medium ${active ? 'text-primary' : done ? 'text-resolved' : 'text-muted'}`}>
                        {label}
                      </span>
                    </div>
                    {i < progressSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mt-[-14px] ${done ? 'bg-resolved' : 'bg-border'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related reports */}
          {issue.relatedReports > 1 && (
            <div className="bg-surface rounded-xl border border-border px-4 py-3 flex items-center gap-3">
              <span className="text-lg">👥</span>
              <div>
                <p className="text-sm font-semibold text-navy">
                  {issue.relatedReports} related reports · {issue.confirmations} citizen confirmations · 1 civic issue
                </p>
                <p className="text-xs text-muted">Multiple citizens have reported the same problem at this location.</p>
              </div>
            </div>
          )}

          {/* Citizen verification (resolved only) */}
          {issue.status === 'resolved' && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Citizen Verification</h3>
              {citizenVote === null ? (
                <>
                  <p className="text-sm text-navy mb-3">
                    The department has marked this issue as resolved. Please verify.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCitizenVote('fixed')}
                      className="flex-1 py-2 bg-resolved-bg text-resolved-text font-semibold text-sm rounded-lg border border-resolved hover:bg-green-100"
                    >
                      ✓ Issue Fixed
                    </button>
                    <button
                      onClick={() => setCitizenVote('problem')}
                      className="flex-1 py-2 bg-critical-bg text-critical-text font-semibold text-sm rounded-lg border border-red-200 hover:bg-red-100"
                    >
                      ✗ Still a Problem
                    </button>
                  </div>
                </>
              ) : citizenVote === 'fixed' ? (
                <div className="flex items-center gap-2 text-sm text-resolved-text bg-resolved-bg rounded-lg px-3 py-2.5 font-semibold">
                  <span>✓</span> Thank you! Issue verified as resolved.
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-critical-text bg-critical-bg rounded-lg px-3 py-2.5 font-semibold">
                  <span>⚠</span> Ticket Reopened · Department notified for re-inspection.
                </div>
              )}
            </div>
          )}

          {/* Activity log */}
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Activity</h3>
            <div className="space-y-3">
              {log.map((entry, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    entry.type === 'success' ? 'bg-resolved' : entry.type === 'warn' ? 'bg-warning' : 'bg-primary'
                  }`} />
                  <div>
                    <p className="font-mono text-[10px] text-muted mb-0.5">{entry.time}</p>
                    <p className="text-navy text-xs leading-relaxed">{entry.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hint when empty */}
      {!searched && (
        <div className="bg-muted-bg rounded-xl border border-border p-6 text-center">
          <div className="text-3xl mb-3">🎫</div>
          <p className="text-sm text-muted">Enter a ticket ID to see its status, timeline, and SLA countdown.</p>
          <p className="text-xs text-slate-400 mt-2">Example: VNS-20481 · VNS-20471 · VNS-20465</p>
        </div>
      )}
    </div>
  );
}
