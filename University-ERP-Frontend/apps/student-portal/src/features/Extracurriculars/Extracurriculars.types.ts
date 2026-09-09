export interface StudentClubDto {
  clubId: string;
  name: string;
  category: 'Academic' | 'Sports' | 'Arts' | 'Community';
  role: 'President' | 'Member' | 'Officer';
  joinedDate: string;
  activityHours: number;
}
