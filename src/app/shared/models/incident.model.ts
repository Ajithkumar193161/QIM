export interface Incident {
  id?: number;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'In-Progress' | 'Resolved' | 'Closed';
  reportedDate: Date;
  reporterName: string;
  moduleName: string; // e.g., "UI", "Database", "API"
}

export interface RootCauseAnalysis {
  id?: number;
  incidentId: number;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
}