import { useState } from 'react';
import { Page } from '../types';
import CityMap from '../components/CityMap';

interface Props {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

const categories = [
  { emoji: '🛣️', label: 'Roads & Potholes' },
  { emoji: '🌊', label: 'Drainage' },
  { emoji: '🗑️', label: 'Garbage' },
  { emoji: '💡', label: 'Streetlights' },
  { emoji: '🚰', label: 'Water' },
  { emoji: '⚙️', label: 'Other' },
];

const severities = [
  { value: 'low', label: 'Low', desc: 'Minor inconvenience' },
  { value: 'medium', label: 'Medium', desc: 'Affects daily life' },
  { value: 'high', label: 'High', desc: 'Urgent attention needed' },
  { value: 'critical', label: 'Critical', desc: 'Safety hazard' },
];

export default function ReportIssue({ onNavigate }: Props) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [locationSet, setLocationSet] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleUseLocation = () => {
    setLocationText('BHU Lanka Gate Road, Ward 7 (Lanka), Varanasi');
    setLocationSet(true);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-surface rounded-xl border border-resolved p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-resolved-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-resolved" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-navy mb-1">Complaint Registered</h2>
          <p className="text-muted text-sm mb-4">Your complaint has been submitted successfully.</p>

          <div className="bg-muted-bg rounded-lg p-4 text-left mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Ticket ID</p>
                <p className="font-mono font-semibold text-primary">VNS-20482</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Category</p>
                <p className="font-medium text-navy">{category || 'Drainage'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Location</p>
                <p className="text-navy">{locationText || 'BHU Lanka Gate Road'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Department</p>
                <p className="text-navy">Public Works Department</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">SLA</p>
                <p className="font-mono text-navy">24 hours</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Severity</p>
                <p className="capitalize text-navy">{severity || 'High'}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-start gap-2 text-xs text-info-text bg-info-bg rounded px-2.5 py-2">
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  <strong>AI Suggestion:</strong> Category: Drainage · Severity: High · Department: Public Works · SLA: 24h
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => onNavigate('track', { id: 'VNS-20482' })}
              className="px-4 py-2 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-dark"
            >
              Track Complaint
            </button>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setCategory(''); setSeverity(''); setDescription(''); setLocationText(''); setLocationSet(false); }}
              className="px-4 py-2 bg-muted-bg text-navy font-medium text-sm rounded-lg border border-border hover:bg-slate-100"
            >
              Report Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy mb-1">Report a Civic Issue</h1>
        <p className="text-muted text-sm">All complaints are tracked and assigned an SLA.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { n: 1, label: 'Location' },
          { n: 2, label: 'Problem' },
          { n: 3, label: 'Submit' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${step === s.n ? 'opacity-100' : step > s.n ? 'opacity-70' : 'opacity-40'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step > s.n ? 'bg-resolved text-white' : step === s.n ? 'bg-primary text-white' : 'bg-muted-bg text-muted border border-border'
              }`}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span className={`text-xs font-medium ${step === s.n ? 'text-navy' : 'text-muted'}`}>{s.label}</span>
            </div>
            {i < 2 && <div className={`h-px w-8 ${step > s.n ? 'bg-resolved' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Location */}
      {step === 1 && (
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-semibold text-navy">Where is the problem?</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="Type location or area name..."
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleUseLocation}
              className="px-3 py-2 bg-primary-soft text-primary-text font-semibold text-xs rounded-lg border border-primary-soft hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
            >
              📍 Use My Location
            </button>
          </div>

          {locationSet && (
            <div className="flex items-center gap-2 text-xs text-resolved-text bg-resolved-bg rounded-lg px-3 py-2">
              <span>✓</span>
              <span className="font-medium">Location detected: {locationText}</span>
            </div>
          )}

          {/* Mini map */}
          <div className="h-52 rounded-lg overflow-hidden border border-border">
            <CityMap issues={[]} />
          </div>
          <p className="text-xs text-muted">
            <span className="font-mono">Lat: 25.2677 · Lng: 82.9913</span>
            <span className="ml-2 text-slate-400">(auto-captured)</span>
          </p>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!locationText}
              className="px-5 py-2 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next: Describe Problem →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Problem */}
      {step === 2 && (
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-semibold text-navy">Describe the problem</h2>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setCategory(c.label)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    category === c.label
                      ? 'border-primary bg-primary-soft text-primary-text'
                      : 'border-border text-navy hover:border-slate-300'
                  }`}
                >
                  <span>{c.emoji}</span>
                  <span className="text-xs leading-tight">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Photo (optional)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary cursor-pointer transition-colors group">
              <div className="text-2xl mb-2">📷</div>
              <p className="text-sm font-medium text-navy group-hover:text-primary">Upload photo</p>
              <p className="text-xs text-muted mt-0.5">JPG, PNG up to 10MB</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the problem..."
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Severity</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {severities.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSeverity(s.value)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    severity === s.value ? 'border-primary bg-primary-soft' : 'border-border hover:border-slate-300'
                  }`}
                >
                  <p className={`text-xs font-semibold ${severity === s.value ? 'text-primary-text' : 'text-navy'}`}>{s.label}</p>
                  <p className="text-[10px] text-muted leading-tight mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-muted-bg text-muted font-medium text-sm rounded-lg border border-border"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!category || !severity}
              className="px-5 py-2 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Review & Submit →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-semibold text-navy">Review your complaint</h2>

          <div className="bg-muted-bg rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Location</p>
                <p className="text-navy font-medium">{locationText}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Category</p>
                <p className="text-navy font-medium">{category}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Severity</p>
                <p className="text-navy font-medium capitalize">{severity}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Coordinates</p>
                <p className="font-mono text-xs text-muted">25.8784, 81.9723</p>
              </div>
            </div>
            {description && (
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Description</p>
                <p className="text-navy text-sm">{description}</p>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 text-xs text-info-text bg-info-bg rounded-lg px-3 py-2.5">
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              <strong>AI Suggestion:</strong> Suggested category: {category} · Severity: {severity || 'High'} · Department: Public Works · SLA: 24h
            </span>
          </div>

          <div className="flex gap-2 justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-muted-bg text-muted font-medium text-sm rounded-lg border border-border"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-dark shadow-sm"
            >
              Submit Complaint
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
