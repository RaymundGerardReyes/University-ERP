export interface SecurityEvent {
  id: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'PRIVILEGE_ELEVATION' | 'VAULT_ACCESS';
  principalId: string;
  ipAddress: string;
  severity: 'Info' | 'Warning' | 'Critical';
  timestamp: string;
}
