import { useState } from 'react';

interface Announcement {
  id: number;
  date: string;
  tag: string;
  tagColor: string;
  title: string;
  body: string;
  dept: string;
}

const announcements: Announcement[] = [
  {
    id: 1,
    date: '2026-08-19',
    tag: 'Notice',
    tagColor: 'bg-info-bg text-info-text',
    title: 'Monsoon Drainage Clearance Drive — Ward 5 (Cantt Civil Lines) & Ward 7 (Lanka / BHU)',
    body: 'Varanasi Nagar Nigam will conduct a special drainage clearance drive in Ward 5 (Cantt Civil Lines) and Ward 7 (BHU Lanka Gate Road) on 21–22 August 2026. Citizens are requested to keep access to drainage covers clear. Complaints in these wards will be given priority SLA of 6 hours during this period.',
    dept: 'Public Works Department',
  },
  {
    id: 2,
    date: '2026-08-17',
    tag: 'Urgent',
    tagColor: 'bg-critical-bg text-critical-text',
    title: 'Road Repair Work: Varanasi Cantt Station Road Partial Closure',
    body: 'Scheduled road repair work will take place on Varanasi Cantt Station Road (between Bus Terminal and Railway Station) from 22 August to 25 August 2026, 10 PM to 5 AM daily. One lane will remain open. Citizens are advised to use Collectorate / Kutchery Road as an alternative. Any new pothole complaints on this stretch will be merged with repair ticket VNS-20476.',
    dept: 'PWD Roads Division',
  },
  {
    id: 3,
    date: '2026-08-15',
    tag: 'Achievement',
    tagColor: 'bg-resolved-bg text-resolved-text',
    title: 'Sampark Reaches 1,284 Registered Complaints — 87% Resolved on Time in Varanasi',
    body: 'Varanasi Nagar Nigam is pleased to report that since the launch of the Sampark pilot platform in Kashi, 1,284 civic complaints have been filed by citizens. Of these, 643 have been resolved within SLA, achieving an 87% on-time resolution rate. The Sanitation Division recorded the highest SLA compliance at 91%. Citizens are thanked for their active participation.',
    dept: 'Nagar Nigam Varanasi',
  },
  {
    id: 4,
    date: '2026-08-12',
    tag: 'Policy',
    tagColor: 'bg-warning-bg text-warning-text',
    title: 'Revised SLA Timelines for Waterlogging Complaints',
    body: 'In light of the monsoon season in Varanasi, the SLA for drainage and waterlogging complaints has been temporarily reduced from 24 hours to 12 hours until 30 September 2026. Complaints involving road damage caused by waterlogging will continue to follow the 48-hour road repair SLA. Officers failing to respond within the monsoon SLA window will be automatically escalated to the Municipal Commissioner.',
    dept: 'Municipal Commissioner, Varanasi Nagar Nigam',
  },
  {
    id: 5,
    date: '2026-08-08',
    tag: 'Notice',
    tagColor: 'bg-info-bg text-info-text',
    title: 'Street Light Replacement Programme: 350 LED Lights in Varanasi Smart City Drive',
    body: 'Under the Kashi Smart City initiative, Varanasi Nagar Nigam will replace 350 sodium-vapour street lights with energy-efficient LED fixtures across Wards 1–4. Work will commence on 25 August 2026. Citizens experiencing broken streetlights in these wards may file a complaint on Sampark; affected tickets will be consolidated under the replacement programme.',
    dept: 'Electrical Division',
  },
  {
    id: 6,
    date: '2026-08-04',
    tag: 'General',
    tagColor: 'bg-muted-bg text-muted',
    title: 'Sampark WhatsApp Channel Active for Kashi Citizens',
    body: 'Citizens can now report civic issues by sending a message or photo to the Sampark WhatsApp number: +91-XXXXX-XXXXX. Type your ward name, issue type, and location, and the system will auto-generate a ticket. Ticket confirmations, status updates, and SLA alerts will be sent back via WhatsApp. Part of the One Civic Window initiative for Varanasi.',
    dept: 'IT Cell, Varanasi Nagar Nigam',
  },
];

export default function Announcements() {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold font-mono text-primary uppercase tracking-widest mb-1">Municipal Notices</p>
        <h1 className="font-display text-2xl font-bold text-navy mb-1">Announcements</h1>
        <p className="text-muted text-sm">Official notices, policy updates, and civic news from Varanasi Nagar Nigam.</p>
      </div>

      <div className="space-y-3">
        {announcements.map((a) => {
          const isOpen = expanded === a.id;
          return (
            <div
              key={a.id}
              className={`bg-surface rounded-xl border overflow-hidden transition-all ${isOpen ? 'border-primary shadow-sm' : 'border-border'}`}
            >
              <button
                className="w-full flex items-start gap-4 px-5 py-4 text-left"
                onClick={() => setExpanded(isOpen ? null : a.id)}
              >
                {/* Date column */}
                <div className="shrink-0 text-center w-10">
                  <p className="font-display text-lg font-extrabold text-navy leading-none">
                    {a.date.split('-')[2]}
                  </p>
                  <p className="text-[10px] text-muted uppercase font-semibold tracking-wide">
                    {new Date(a.date).toLocaleDateString('en-IN', { month: 'short' })}
                  </p>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.tagColor}`}>{a.tag}</span>
                    <span className="text-[10px] text-muted font-mono">{a.dept}</span>
                  </div>
                  <p className="text-sm font-semibold text-navy leading-snug">{a.title}</p>
                </div>

                <span className={`text-muted text-sm shrink-0 transition-transform mt-0.5 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 border-t border-border pt-3">
                  <p className="text-sm text-muted leading-relaxed">{a.body}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-3">
                    Posted: {new Date(a.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="text-[10px] text-slate-400">
          Demo data · Announcements are updated by Nagar Nigam Varanasi
        </p>
      </div>
    </div>
  );
}
