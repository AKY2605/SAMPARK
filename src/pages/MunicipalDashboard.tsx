import React, { useState } from 'react';
import { issues as allIssues } from '../data';
import { IssueStatus, Issue } from '../types';
import StatusBadge from '../components/StatusBadge';

const deptOptions = ['All', 'PWD Roads Division', 'Sanitation Division', 'Electrical Division', 'Jal Nigam', 'Public Works Department'];
const statusOptions: (IssueStatus | 'All')[] = ['All', 'pending', 'assigned', 'in-progress', 'sla-breached', 'resolved'];

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h1 className="font-display text-xl font-bold text-navy">Municipal Login</h1>
          <p className="text-muted text-sm mt-1">Sampark Admin · Pratapgarh Nagar Palika</p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Email / Employee ID</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@nagar.pratapgarh.gov.in"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={onLogin}
            className="w-full py-2.5 bg-navy text-white font-semibold text-sm rounded-lg hover:bg-navy-soft transition-colors"
          >
            Sign In
          </button>
          <p className="text-[10px] text-center text-slate-400">
            Demo: Click Sign In to enter the admin dashboard
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MunicipalDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All');
  const [ticketIssues, setTicketIssues] = useState<Issue[]>(allIssues);
  const [actionTarget, setActionTarget] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  const filtered = ticketIssues.filter((i) => {
    const matchDept = deptFilter === 'All' || i.department === deptFilter;
    const matchStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchDept && matchStatus;
  });

  const open = ticketIssues.filter((i) => i.status !== 'resolved').length;
  const warning = ticketIssues.filter((i) => !i.slaBreached && i.status !== 'resolved' && parseInt(i.slaRemaining) < 5).length;
  const breached = ticketIssues.filter((i) => i.slaBreached).length;
  const resolvedToday = 4;

  const markResolved = (id: string) => {
    setTicketIssues((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: 'resolved' as IssueStatus, slaRemaining: 'Resolved', slaBreached: false } : i
      )
    );
    setActionTarget(null);
  };

  const markInProgress = (id: string) => {
    setTicketIssues((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: 'in-progress' as IssueStatus } : i
      )
    );
    setActionTarget(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-navy">Municipal Dashboard</h1>
          <p className="text-muted text-xs mt-0.5">Pratapgarh Nagar Palika · Officer View · Demo Data</p>
        </div>
        <button
          onClick={() => setLoggedIn(false)}
          className="text-xs text-muted hover:text-navy border border-border px-3 py-1.5 rounded-md"
        >
          Sign Out
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { value: open, label: 'Open Issues', color: 'text-primary' },
          { value: warning, label: 'SLA Warning', color: 'text-warning' },
          { value: breached, label: 'SLA Breached', color: 'text-critical' },
          { value: resolvedToday, label: 'Resolved Today', color: 'text-resolved' },
        ].map((k) => (
          <div key={k.label} className="bg-surface rounded-xl border border-border p-4">
            <p className={`font-display text-3xl font-extrabold leading-none mb-1 ${k.color}`}>{k.value}</p>
            <p className="text-xs font-semibold text-muted">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="border border-border rounded-lg px-3 py-1.5 text-xs text-navy focus:outline-none focus:border-primary bg-surface"
        >
          {deptOptions.map((d) => <option key={d}>{d}</option>)}
        </select>
        <div className="flex gap-1">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-navy text-white' : 'bg-muted-bg text-muted hover:text-navy'
              }`}
            >
              {s === 'All' ? 'All' : s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted-bg border-b border-border">
                {['Ticket', 'Issue', 'Location', 'Department', 'Status', 'SLA', 'Action'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((issue) => (
                <React.Fragment key={issue.id}>
                  <tr
                    className={`hover:bg-muted-bg transition-colors ${issue.slaBreached ? 'bg-red-50/50' : ''}`}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-primary">{issue.id}</span>
                    </td>
                    <td className="px-4 py-2.5 max-w-[180px]">
                      <p className="font-medium text-navy text-xs leading-snug truncate">{issue.title}</p>
                      <p className="text-[10px] text-muted">{issue.category}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-muted">{issue.ward}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-muted">{issue.department.split(' ').slice(0, 2).join(' ')}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-4 py-2.5">
                      {issue.slaBreached ? (
                        <span className="text-xs font-semibold text-critical">Breached</span>
                      ) : issue.slaRemaining === 'Resolved' ? (
                        <span className="text-xs text-resolved">Done</span>
                      ) : (
                        <span className={`text-xs font-mono ${parseInt(issue.slaRemaining) < 5 ? 'text-warning font-semibold' : 'text-muted'}`}>
                          {issue.slaRemaining}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => setActionTarget(actionTarget === issue.id ? null : issue.id)}
                        className="text-xs text-primary font-medium hover:underline"
                      >
                        Actions
                      </button>
                    </td>
                  </tr>

                  {/* Inline action panel */}
                  {actionTarget === issue.id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 bg-muted-bg border-b border-border">
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-xs font-semibold text-muted mr-2">Quick Actions:</span>
                          {issue.status !== 'in-progress' && issue.status !== 'resolved' && (
                            <button
                              onClick={() => markInProgress(issue.id)}
                              className="px-3 py-1 bg-info-bg text-info-text text-xs font-semibold rounded-md border border-blue-200 hover:bg-blue-100"
                            >
                              Mark In Progress
                            </button>
                          )}
                          {issue.status !== 'resolved' && (
                            <button
                              onClick={() => markResolved(issue.id)}
                              className="px-3 py-1 bg-resolved-bg text-resolved-text text-xs font-semibold rounded-md border border-green-200 hover:bg-green-100"
                            >
                              Mark Resolved
                            </button>
                          )}
                          <div className="flex gap-1.5 ml-2">
                            <input
                              type="text"
                              value={noteInput}
                              onChange={(e) => setNoteInput(e.target.value)}
                              placeholder="Add a note..."
                              className="border border-border rounded-md px-2 py-1 text-xs w-48 focus:outline-none focus:border-primary bg-white"
                            />
                            <button
                              onClick={() => setNoteInput('')}
                              className="px-2.5 py-1 bg-navy text-white text-xs font-medium rounded-md"
                            >
                              Add Note
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted">No issues match the selected filters.</div>
        )}
      </div>
    </div>
  );
}
