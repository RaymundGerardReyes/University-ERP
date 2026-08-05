export interface SystemAdministrationPageProps {}

export interface SystemConfig {
  version: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  activeNodes: number;
  lastBackup: string;
  cacheStatus: string;
}