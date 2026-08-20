export type IssueStatus = 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'sla-breached';
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IssueCategory = 'Roads & Potholes' | 'Drainage' | 'Garbage' | 'Streetlights' | 'Water' | 'Other';
export type Page = 'home' | 'report' | 'track' | 'map' | 'statistics' | 'dashboard' | 'faq' | 'announcements' | 'rewards' | 'fund';

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  location: string;
  ward: string;
  mapX: number;
  mapY: number;
  lat: number;
  lng: number;
  status: IssueStatus;
  slaDuration: string;
  slaRemaining: string;
  slaBreached: boolean;
  reportedDate: string;
  reportedTime: string;
  department: string;
  confirmations: number;
  upvotes: number;
  severity: IssueSeverity;
  description: string;
  relatedReports: number;
  reportedBy: string;
}
