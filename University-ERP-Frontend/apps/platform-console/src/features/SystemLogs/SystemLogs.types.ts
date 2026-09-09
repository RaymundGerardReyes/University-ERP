export interface LogMessage {
  id: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  traceId: string;
  timestamp: string;
}
