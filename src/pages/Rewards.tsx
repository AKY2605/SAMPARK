import { useState } from 'react';
import { issues } from '../data';

// ─── Tier config (based on upvotes received) ─────────────────────────────────
const tiers = [
  { name: 'Newcomer',           minUpvotes: 0,   maxUpvotes: 24,  medal: '⭐', color: '#94A3B8', bg: '#F8FAFC', perks: [] },
  { name: 'Active Citizen',     minUpvotes: 25,  maxUpvotes: 99,  medal: '🥉', color: '#92400E', bg: '#FEF3C7', perks: ['1 starter voucher'] },
  { name: 'Civic Champion',     minUpvotes: 100, maxUpvotes: 249, medal: '🥈', color: '#374151', bg: '#F3F4F6', perks: ['3 vouchers', 'Contribution Certificate'] },
  { name: 'Community Hero',     minUpvotes: 250, maxUpvotes: 499, medal: '🥇', color: '#D97706', bg: '#FFFBEB', perks: ['5 vouchers', 'Verified Certificate', 'Priority support'] },
  { name: 'Pratapgarh Guardian',minUpvotes: 500, maxUpvotes: Infinity, medal: '🏆', color: '#6D28D9', bg: '#F5F3FF', perks: ['All vouchers', 'Official Recognition Letter', 'Nagar Palika acknowledgement'] },
];

function getTier(upvotes: number) {
  return tiers.find((t) => upvotes >= t.minUpvotes && upvotes <= t.maxUpvotes) || tiers[0];
}

// ─── Leaderboard (derived from issues data) ───────────────────────────────────
const leaderboard = [...issues]
  .sort((a, b) => b.upvotes - a.upvotes)
  .map((issue) => ({
    name: issue.reportedBy,
    issueTitle: issue.title,
    issueId: issue.id,
    upvotes: issue.upvotes,
    status: issue.status,
    isResolved: issue.status === 'resolved',
    bonusPoints: issue.status === 'resolved' ? Math.round(issue.upvotes * 0.5) : 0,
  }));

// ─── Vouchers ─────────────────────────────────────────────────────────────────
const vouchers = [
  { brand: 'Sahyog Delivery',   tagline: 'Grocery & Essentials', discount: '15% off your next order', code: 'CIVIC15',    expiry: '31 Oct 2026', minTierIdx: 1, color: '#16A34A', logo: '🛒' },
  { brand: 'NirmaN Pro',        tagline: 'Home Repair Services',  discount: '10% off any booking',     code: 'NIRMAN10',   expiry: '30 Nov 2026', minTierIdx: 1, color: '#D97706', logo: '🔨' },
  { brand: 'Vidya Digital',     tagline: 'Online Skill Courses',  discount: '20% off any course',      code: 'VIDYA20',    expiry: '31 Dec 2026', minTierIdx: 2, color: '#0369A1', logo: '🎓' },
  { brand: 'GreenWheel UP',     tagline: 'E-Rickshaw Booking',    discount: '₹50 off first 3 rides',   code: 'GREEN50',    expiry: '31 Oct 2026', minTierIdx: 2, color: '#0F766E', logo: '🛺' },
  { brand: 'LocalKart',         tagline: 'Local Marketplace',     discount: '12% off ₹300+ orders',    code: 'LKART12',    expiry: '28 Feb 2027', minTierIdx: 3, color: '#7C3AED', logo: '🛍️' },
  { brand: 'HealthFirst Clinic',tagline: 'Teleconsultation',      discount: 'Free first consultation', code: 'HLTH1ST',    expiry: '31 Dec 2026', minTierIdx: 3, color: '#DB2777', logo: '🏥' },
];

// ─── Demo profile — reporter of the top issue ─────────────────────────────────
const DEMO = leaderboard[0];
const DEMO_TOTAL_UPVOTES = DEMO.upvotes + DEMO.bonusPoints;

export default function Rewards() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCert, setShowCert] = useState(false);

  const tier = getTier(DEMO_TOTAL_UPVOTES);
  const tierIndex = tiers.indexOf(tier);
  const nextTier = tiers[tierIndex + 1];
  const progress = nextTier
    ? ((DEMO_TOTAL_UPVOTES - tier.minUpvotes) / (nextTier.minUpvotes - tier.minUpvotes)) * 100
    : 100;

  const unlockedVouchers = vouchers.filter((v) => v.minTierIdx <= tierIndex);
  const lockedVouchers   = vouchers.filter((v) => v.minTierIdx > tierIndex);
  const hasCert = tierIndex >= 2;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-7">

      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold font-mono text-primary uppercase tracking-widest mb-1">Citizen Impact</p>
        <h1 className="font-display text-2xl font-bold text-navy mb-1">Rewards & Certificates</h1>
        <p className="text-muted text-sm max-w-xl">
          Rewards are earned through <strong className="text-navy">community upvotes</strong> on your reported issues. The more significant your complaint, the more citizens upvote it — and the higher your tier.
        </p>
      </div>

      {/* How scoring works */}
      <div className="bg-primary-soft border border-primary/20 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-primary-text mb-3">How Scores Are Calculated</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '👍', title: 'Issue Upvotes', desc: 'Every upvote your reported issue receives = 1 point. Citizens vote on problems they also face.' },
            { icon: '✅', title: 'Resolution Bonus', desc: 'If your reported issue is resolved and verified, you earn +50% bonus points on top of your upvotes.' },
            { icon: '⚡', title: 'Significance Weight', desc: 'Critical severity issues earn a 1.5× multiplier. High = 1.25×. Medium = 1×. Low = 0.75×.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-2.5">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs font-bold text-navy">{item.title}</p>
                <p className="text-[11px] text-muted leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your tier card (demo = top reporter) */}
      <div className="rounded-2xl border-2 p-5 sm:p-6" style={{ borderColor: tier.color, backgroundColor: tier.bg }}>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="text-5xl">{tier.medal}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: tier.color }}>
                {tier.name}
              </span>
              <span className="font-mono text-xs text-muted">
                {DEMO_TOTAL_UPVOTES} impact points
              </span>
            </div>
            <p className="font-display text-lg font-extrabold text-navy">{DEMO.name}</p>
            <p className="text-xs text-muted mt-0.5">
              Top complaint: <em className="text-navy not-italic font-medium">{DEMO.issueTitle}</em>
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] font-medium bg-white/60 border border-white rounded-full px-2 py-0.5 text-navy">
                👍 {DEMO.upvotes} community upvotes
              </span>
              {DEMO.isResolved && (
                <span className="text-[11px] font-medium bg-resolved-bg text-resolved-text border border-resolved/30 rounded-full px-2 py-0.5">
                  ✓ Resolved +{DEMO.bonusPoints} bonus pts
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {tier.perks.map((p) => (
                <span key={p} className="text-[10px] font-semibold text-muted bg-white/70 border border-white rounded-full px-2 py-0.5">
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>
          {hasCert && (
            <button
              onClick={() => setShowCert(true)}
              className="shrink-0 px-4 py-2 bg-navy text-white font-semibold text-sm rounded-xl hover:bg-navy-soft shadow"
            >
              📜 View Certificate
            </button>
          )}
        </div>

        {nextTier && (
          <div className="mt-4 pt-4 border-t border-white/40">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-navy">Progress to <strong>{nextTier.name}</strong></span>
              <span className="font-mono text-muted">{DEMO_TOTAL_UPVOTES} / {nextTier.minUpvotes} pts</span>
            </div>
            <div className="h-2.5 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: tier.color }} />
            </div>
            <p className="text-[10px] text-muted mt-1">
              {nextTier.minUpvotes - DEMO_TOTAL_UPVOTES} more points to unlock: {nextTier.perks.join(' · ')}
            </p>
          </div>
        )}
      </div>

      {/* Tier ladder */}
      <div className="bg-surface rounded-2xl border border-border p-5">
        <h2 className="text-sm font-semibold text-navy mb-4">Impact Tiers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {tiers.map((t, i) => {
            const isActive = i === tierIndex;
            const isDone   = i < tierIndex;
            return (
              <div
                key={t.name}
                className={`rounded-xl p-3 text-center border-2 ${isActive || isDone ? '' : 'border-border opacity-40'}`}
                style={isActive || isDone ? { borderColor: t.color, backgroundColor: t.bg } : {}}
              >
                <div className="text-2xl mb-1">{t.medal}</div>
                <p className="text-[11px] font-bold text-navy leading-tight">{t.name}</p>
                <p className="text-[10px] text-muted mt-0.5">{t.minUpvotes}{t.maxUpvotes === Infinity ? '+' : `–${t.maxUpvotes}`} pts</p>
                {isActive && <p className="text-[9px] font-bold mt-1" style={{ color: t.color }}>← You</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Community leaderboard */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-navy">Community Leaderboard</h2>
          <p className="text-[11px] text-muted mt-0.5">Ranked by total impact points (upvotes + resolution bonuses)</p>
        </div>
        <div className="divide-y divide-border">
          {leaderboard.map((entry, i) => {
            const total = entry.upvotes + entry.bonusPoints;
            const t = getTier(total);
            return (
              <div key={entry.issueId} className={`flex items-center gap-4 px-5 py-3 ${i === 0 ? 'bg-amber-50/60' : ''}`}>
                {/* Rank */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                  i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-amber-700 text-white' : 'bg-muted-bg text-muted'
                }`}>{i + 1}</div>

                {/* Name + issue */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-navy">{entry.name}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: t.bg, color: t.color }}>
                      {t.medal} {t.name}
                    </span>
                    {entry.isResolved && (
                      <span className="text-[10px] font-semibold bg-resolved-bg text-resolved-text px-1.5 py-0.5 rounded-full">✓ Resolved</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted truncate mt-0.5">{entry.issueTitle}</p>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <p className="font-display font-extrabold text-base text-navy leading-none">{total}</p>
                  <p className="text-[10px] text-muted">pts</p>
                  <div className="text-[10px] text-muted mt-0.5 space-x-1">
                    <span>👍 {entry.upvotes}</span>
                    {entry.bonusPoints > 0 && <span className="text-resolved">+{entry.bonusPoints}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked vouchers */}
      {unlockedVouchers.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-navy mb-3">Your Vouchers <span className="text-[10px] font-normal text-muted">({unlockedVouchers.length} unlocked)</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unlockedVouchers.map((v) => (
              <div key={v.code} className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm hover:shadow transition-shadow">
                <div className="px-4 pt-4 pb-2 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${v.color}18` }}>
                    {v.logo}
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{v.brand}</p>
                    <p className="text-[10px] text-muted">{v.tagline}</p>
                  </div>
                </div>
                <div className="px-4 pb-3">
                  <p className="text-sm font-bold" style={{ color: v.color }}>{v.discount}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono font-bold bg-muted-bg border border-border rounded-lg px-2.5 py-1.5 text-navy tracking-widest">
                      {v.code}
                    </code>
                    <button
                      onClick={() => copyCode(v.code)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border hover:border-slate-300 text-muted hover:text-navy shrink-0"
                    >
                      {copiedCode === v.code ? '✓' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Expires: {v.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked vouchers */}
      {lockedVouchers.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted mb-3">Locked Vouchers <span className="font-normal">— earn more upvotes to unlock</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lockedVouchers.map((v) => (
              <div key={v.code} className="bg-surface rounded-xl border border-border overflow-hidden opacity-50">
                <div className="px-4 pt-4 pb-2 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted-bg flex items-center justify-center text-xl grayscale shrink-0">{v.logo}</div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{v.brand}</p>
                    <p className="text-[10px] text-muted">{v.tagline}</p>
                  </div>
                </div>
                <div className="px-4 pb-3">
                  <p className="text-sm font-bold text-muted">{v.discount}</p>
                  <div className="mt-2 bg-muted-bg rounded-lg px-2.5 py-1.5 text-[10px] text-muted">
                    🔒 Unlocks at <strong>{tiers[v.minTierIdx]?.name}</strong> ({tiers[v.minTierIdx]?.minUpvotes}+ pts)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate modal */}
      {showCert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCert(false)}>
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative p-8 sm:p-12 text-center" style={{ background: 'linear-gradient(135deg,#fefce8 0%,#fff 50%,#eff6ff 100%)' }}>
              <div className="absolute inset-2 border-2 border-amber-300/40 rounded-xl pointer-events-none" />
              <div className="absolute inset-3 border border-amber-200/30 rounded-xl pointer-events-none" />
              {['top-4 left-4','top-4 right-4','bottom-4 left-4','bottom-4 right-4'].map((p) => (
                <div key={p} className={`absolute ${p} text-amber-300 text-xl`}>✦</div>
              ))}

              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>
                <span className="font-display font-bold text-navy text-sm">Sampark · Pratapgarh</span>
              </div>
              <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4">नगर पालिका परिषद</p>
              <h2 className="font-display text-2xl font-extrabold text-navy mb-1">Certificate of Civic Contribution</h2>
              <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-5" />

              <p className="text-sm text-muted mb-2">This is to certify that</p>
              <p className="font-display text-3xl font-extrabold text-navy mb-2">{DEMO.name}</p>
              <p className="text-sm text-muted leading-relaxed max-w-sm mx-auto mb-4">
                has made a significant civic contribution by reporting a high-impact issue that received{' '}
                <strong className="text-navy">{DEMO.upvotes} community upvotes</strong>, earning an impact score of{' '}
                <strong className="text-navy">{DEMO_TOTAL_UPVOTES} points</strong> and the{' '}
                <strong className="text-navy">{tier.name}</strong> tier.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 mb-5" style={{ borderColor: tier.color, backgroundColor: tier.bg }}>
                <span className="text-xl">{tier.medal}</span>
                <span className="font-bold text-sm" style={{ color: tier.color }}>{tier.name}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                {[
                  { value: DEMO.upvotes, label: 'Community Upvotes' },
                  { value: DEMO_TOTAL_UPVOTES, label: 'Impact Score' },
                  { value: '2026', label: 'Year of Service' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-xl font-extrabold text-navy">{s.value}</p>
                    <p className="text-[10px] text-muted uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                <div className="text-left">
                  <div className="w-24 h-px bg-navy mb-1" />
                  <p className="text-[10px] text-muted">Platform Administrator</p>
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  CT-{String(DEMO_TOTAL_UPVOTES).padStart(4,'0')}-2026
                </p>
                <div className="text-right">
                  <div className="w-24 h-px bg-navy mb-1 ml-auto" />
                  <p className="text-[10px] text-muted">Nagar Palika Officer</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-muted-bg border-t border-border flex gap-3 justify-end">
              <button onClick={() => setShowCert(false)} className="px-4 py-2 text-sm font-medium text-muted border border-border rounded-lg hover:bg-slate-100">Close</button>
              <button onClick={() => window.print()} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark">🖨️ Print / Save PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
