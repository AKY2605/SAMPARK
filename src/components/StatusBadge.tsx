import { IssueStatus } from '../types';

const config: Record<IssueStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-warning-bg text-warning-text' },
  assigned: { label: 'Assigned', cls: 'bg-info-bg text-info-text' },
  'in-progress': { label: 'In Progress', cls: 'bg-info-bg text-info-text' },
  resolved: { label: 'Resolved', cls: 'bg-resolved-bg text-resolved-text' },
  'sla-breached': { label: 'SLA Breached', cls: 'bg-critical-bg text-critical-text' },
};

interface Props {
  status: IssueStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const { label, cls } = config[status];
  const textSize = size === 'md' ? 'text-xs' : 'text-[10px]';
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 ${textSize} ${cls} leading-none whitespace-nowrap`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      {label}
    </span>
  );
}
