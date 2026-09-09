export interface InstitutionalPolicy {
  id: string;
  policyCode: string;
  title: string;
  category: 'Academic' | 'StudentConduct' | 'FacultyTenure' | 'Administrative';
  version: string;
  effectiveDate: string;
  status: 'Active' | 'UnderReview' | 'Archived';
}
