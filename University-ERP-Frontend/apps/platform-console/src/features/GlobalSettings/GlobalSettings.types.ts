export interface GlobalSetting {
  id: string;
  key: string;
  category: 'Security' | 'Academic' | 'Localization' | 'Performance';
  value: string;
  description: string;
  lastModified: string;
}
