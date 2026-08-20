import { useState } from 'react';

function fmt(n: number) { return '₹' + n.toLocaleString('en-IN'); }
function pct(a: number, b: number) { return Math.min(100, Math.round((a / b) * 100)); }

// ── Tab 1: Government Budget Allocations ──────────────────────────────────────
const depts = [
  {
    name: 'Roads & Potholes',
    emoji: '🛣️',
    allotted: 4200000,
    spent: 2980000,
    color: '#1E40AF',
    source: 'State PWD Fund 2026–27',
  },
  {
    name: 'Drainage & Sewage',
    emoji: '🌊',
    allotted: 3100000,
    spent: 1640000,
    color: '#7C3AED',
    source: 'AMRUT 2.0 Grant',
  },
  {
    name: 'Streetlights & Electrical',
    emoji: '💡',
    allotted: 1500000,
    spent: 1120000,
    color: '#D97706',
    source: 'Municipal Revenue Fund',
  },
  {
    name: 'Garbage & Sanitation',
    emoji: '🗑️',
    allotted: 2600000,
    spent: 1890000,
    color: '#0F766E',
    source: 'SBM-U Phase II',
  },
  {
    name: 'Water Supply',
    emoji: '💧',
    allotted: 1800000,
    spent: 920000,
    color: '#0369A1',
    source: 'Jal Jeevan Mission',
  },
  {
    name: 'Parks & Public Spaces',
    emoji: '🌳',
    allotted: 700000,
    spent: 310000,
    color: '#15803D',
    source: 'Municipal Discretionary Fund',
  },
];

function FundTrackerTab() {
  const totalAllotted = depts.reduce((s, d) => s + d.allotted, 0);
  const totalSpent    = depts.reduce((s, d) => s + d.spent,    0);

  return (
    <div className="space-y-5">
      {/* Summary banner */}
      <div className="bg-surface rounded-2xl border border-border p-5">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">Municipal Budget · 2026–27</p>
            <p className="font-display text-3xl font-extrabold text-navy">{fmt(totalAllotted)}</p>
            <p className="text-sm text-muted mt-0.5">Total government allocation across all civic departments</p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-extrabold text-warning">{fmt(totalSpent)}</p>
            <p className="text-xs text-muted">spent so far · {pct(totalSpent, totalAllotted)}% utilised</p>
          </div>
        </div>
        <div className="h-3 bg-muted-bg rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct(totalSpent, totalAllotted)}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted mt-1.5">
          <span>₹0</span>
          <span>{fmt(totalAllotted - totalSpent)} remaining</span>
          <span>{fmt(totalAllotted)}</span>
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 bg-info-bg border border-info-text/20 rounded-xl px-4 py-3">
        <span className="text-lg shrink-0">🏛️</span>
        <p className="text-xs text-info-text leading-relaxed">
          These figures represent funds <strong>allotted by the Central and State Government</strong> to Pratapgarh Nagar Palika Parishad for the current financial year. Spending data is updated monthly. Source: U.P. Municipal Finance Cell.
        </p>
      </div>

      {/* Department breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {depts.map((d) => {
          const used = pct(d.spent, d.allotted);
          const remaining = d.allotted - d.spent;
          return (
            <div key={d.name} className="bg-surface rounded-2xl border border-border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${d.color}15` }}>
                    {d.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy leading-tight">{d.name}</p>
                    <p className="text-[10px] text-muted mt-0.5">{d.source}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Allotted</span>
                  <span className="font-mono font-bold text-navy">{fmt(d.allotted)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Spent</span>
                  <span className="font-mono font-semibold" style={{ color: d.color }}>{fmt(d.spent)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Remaining</span>
                  <span className="font-mono font-semibold text-resolved">{fmt(remaining)}</span>
                </div>
              </div>

              <div className="h-2 bg-muted-bg rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${used}%`, backgroundColor: d.color }} />
              </div>
              <p className="text-[10px] text-muted mt-1">{used}% utilised</p>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-400 text-center pb-1">
        Prototype data · Figures are illustrative and not from official government records
      </p>
    </div>
  );
}

// ── Tab 2: Community Fund ─────────────────────────────────────────────────────
const SEED_AMOUNT = 87500;

function CommunityFundTab() {
  const [total, setTotal] = useState(SEED_AMOUNT);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [done, setDone] = useState(false);

  function contribute() {
    const n = Number(amount);
    if (!n || n <= 0) return;
    setTotal((t) => t + n);
    setDone(true);
  }

  function reset() {
    setAmount('');
    setName('');
    setAnonymous(false);
    setDone(false);
  }

  return (
    <div className="space-y-5 max-w-xl mx-auto">

      {/* Fund balance */}
      <div className="bg-surface rounded-2xl border border-border p-6 text-center">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-2">Community Fund Balance</p>
        <p className="font-display text-5xl font-extrabold text-teal-700 leading-none">{fmt(total)}</p>
        <p className="text-sm text-muted mt-2">Raised by Pratapgarh citizens</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-resolved animate-pulse" />
          <span className="text-xs text-muted">Updated in real time</span>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-muted-bg rounded-xl px-4 py-3 flex items-start gap-3">
        <span className="text-xl shrink-0">ℹ️</span>
        <p className="text-xs text-muted leading-relaxed">
          This fund is used by the community to resolve civic issues that fall outside the government budget.
          When a reported problem needs urgent attention, citizens can vote to allocate from this fund.
          Contribute any amount to grow the pool.
        </p>
      </div>

      {/* Contribute box */}
      <div className="bg-surface rounded-2xl border border-border p-5">
        {done ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="font-display font-bold text-navy text-lg mb-1">Thank You!</h3>
            <p className="text-sm text-muted mb-4">Your contribution of <strong className="text-teal-700 font-mono">{fmt(Number(amount))}</strong> has been added to the Community Fund.</p>
            <button onClick={reset} className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark">
              Contribute Again
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-display font-semibold text-navy text-base mb-4">Add to the Fund</h3>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {['100', '250', '500', '1000'].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`py-2 text-sm font-semibold rounded-xl border transition-colors ${
                      amount === a ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-border text-muted hover:border-teal-400'
                    }`}
                  >
                    ₹{a}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Or enter custom amount (₹)"
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-navy focus:outline-none focus:border-teal-500"
              />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={anonymous}
                placeholder="Your name (optional)"
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500 disabled:opacity-40"
              />

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="rounded" />
                <span className="text-sm text-muted">Contribute anonymously</span>
              </label>

              <button
                onClick={contribute}
                disabled={!amount || Number(amount) <= 0}
                className="w-full py-3 bg-teal-700 text-white text-sm font-bold rounded-xl hover:bg-teal-800 disabled:opacity-40 transition-colors"
              >
                Contribute {amount ? fmt(Number(amount)) : '₹—'} to Fund
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                Demo only — no real payment is processed
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function CommunityFund() {
  const [tab, setTab] = useState<'tracker' | 'fund'>('tracker');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold font-mono text-primary uppercase tracking-widest mb-1">Civic Finance</p>
        <h1 className="font-display text-2xl font-bold text-navy mb-1">Funds</h1>
        <p className="text-muted text-sm">Government budget transparency and the citizen community fund.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted-bg rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setTab('tracker')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'tracker' ? 'bg-surface text-navy shadow-sm border border-border' : 'text-muted hover:text-navy'
          }`}
        >
          🏛️ Fund Tracker
        </button>
        <button
          onClick={() => setTab('fund')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'fund' ? 'bg-surface text-navy shadow-sm border border-border' : 'text-muted hover:text-navy'
          }`}
        >
          🤝 Community Fund
        </button>
      </div>

      {tab === 'tracker' ? <FundTrackerTab /> : <CommunityFundTab />}
    </div>
  );
}
