import { useState } from 'react';

interface QA {
  q: string;
  a: string;
  category: string;
}

const faqs: QA[] = [
  {
    category: 'Filing a Complaint',
    q: 'How do I report a civic issue?',
    a: 'Go to "Report Issue" in the top navigation. Choose your location on the map, select a category (Roads, Drainage, Garbage, etc.), optionally upload a photo, describe the problem, and submit. You will receive a unique ticket ID like PRT-20481.',
  },
  {
    category: 'Filing a Complaint',
    q: 'Do I need to register to file a complaint?',
    a: 'No registration is required for citizens to file a complaint or track its status. Registration may be introduced in future versions for personalized complaint history.',
  },
  {
    category: 'Filing a Complaint',
    q: 'Can I upload a photograph of the problem?',
    a: 'Yes. The Report Issue form has a photo upload step. Photos help officials verify and prioritize issues faster. JPG and PNG files up to 10MB are supported.',
  },
  {
    category: 'Tracking',
    q: 'How do I track my complaint?',
    a: 'Use the "Track Complaint" page from the top navigation bar. Enter your ticket ID (e.g. PRT-20481) and press Track. You will see the current status, SLA countdown, assigned department, and a full activity log.',
  },
  {
    category: 'Tracking',
    q: 'What do the different statuses mean?',
    a: 'Pending — complaint received, not yet assigned. Assigned — forwarded to a department. In Progress — field work underway. Resolved — department has marked it fixed. SLA Breached — deadline passed and the issue has been automatically escalated to the Executive Officer.',
  },
  {
    category: 'SLA & Escalation',
    q: 'What is an SLA?',
    a: 'SLA (Service Level Agreement) is the maximum time within which a complaint must be resolved. Different categories have different SLAs: Garbage 12h, Roads 48h, Drainage 24h, Streetlights 24h, Water 24h. The SLA countdown is visible on every ticket.',
  },
  {
    category: 'SLA & Escalation',
    q: 'What happens if the SLA is breached?',
    a: 'When a deadline expires without resolution, the ticket is automatically marked "SLA Breached" and escalated to the Executive Officer (EO) of Pratapgarh Nagar Palika. The EO is then responsible for ensuring the issue is addressed.',
  },
  {
    category: 'SLA & Escalation',
    q: 'Can the same problem be reported by multiple citizens?',
    a: 'Yes. Sampark groups nearby reports of the same problem. If 4 citizens report the same drain, they are linked into one civic issue. The ticket shows "4 related reports · 47 citizen confirmations" so officials can see the actual scale.',
  },
  {
    category: 'Verification',
    q: 'How does citizen verification work?',
    a: 'After a department marks an issue resolved, you will see "Citizen Verification Pending" on your ticket. You can confirm it is fixed ("Issue Fixed") or dispute it ("Still a Problem"). If you dispute, the ticket is automatically reopened and the department is notified for re-inspection.',
  },
  {
    category: 'Verification',
    q: 'Can I see before and after photos of resolved issues?',
    a: 'Yes. Officials upload a resolution photo when closing a ticket. Both the original complaint photo and the resolution photo are visible on the public issue detail, so citizens can verify the work independently.',
  },
  {
    category: 'Civic Map',
    q: 'What does the Civic Map show?',
    a: 'The Civic Map shows all reported issues in Pratapgarh as colour-coded markers: red = SLA Breached, orange = Pending, blue = In Progress, green = Resolved. You can filter by category and status. Clicking a marker shows issue details in a side panel.',
  },
  {
    category: 'General',
    q: 'Is this an official government platform?',
    a: 'This is a prototype and demonstration platform. It is not an official government service unless formally adopted by Pratapgarh Nagar Palika Parishad. All data shown is fictional and for demonstration purposes only.',
  },
];

const categories = [...new Set(faqs.map((f) => f.category))];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = activeCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold font-mono text-primary uppercase tracking-widest mb-1">Help Centre</p>
        <h1 className="font-display text-2xl font-bold text-navy mb-1">Frequently Asked Questions</h1>
        <p className="text-muted text-sm">Common questions about using Sampark Pratapgarh.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-muted-bg text-muted hover:text-navy hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ accordion */}
      <div className="space-y-2">
        {filtered.map((faq, i) => {
          const idx = faqs.indexOf(faq);
          const isOpen = open === idx;
          return (
            <div
              key={idx}
              className={`bg-surface rounded-xl border transition-colors overflow-hidden ${isOpen ? 'border-primary shadow-sm' : 'border-border'}`}
            >
              <button
                className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left"
                onClick={() => setOpen(isOpen ? null : idx)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-[10px] font-semibold bg-primary-soft text-primary-text px-2 py-0.5 rounded-full mt-0.5 shrink-0 whitespace-nowrap">
                    {faq.category}
                  </span>
                  <span className="text-sm font-semibold text-navy leading-snug">{faq.q}</span>
                </div>
                <span className={`text-muted text-sm shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  <div className="pl-[calc(2rem+8px)] text-sm text-muted leading-relaxed border-t border-border pt-3">
                    {faq.a}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact */}
      <div className="mt-8 bg-navy rounded-xl p-5 text-center">
        <p className="text-white font-semibold text-sm mb-1">Still have a question?</p>
        <p className="text-slate-400 text-xs mb-3">Contact the Nagar Palika Helpdesk directly</p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-mono">📞 1800-XXX-XXXX</span>
          <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-mono">💬 WhatsApp</span>
          <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-mono">✉ helpdesk@civictrack.gov.in</span>
        </div>
      </div>
    </div>
  );
}
