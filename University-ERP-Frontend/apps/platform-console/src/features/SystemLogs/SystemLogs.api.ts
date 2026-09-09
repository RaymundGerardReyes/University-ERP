import { apiClient } from '@university-erp/api-clients';
import { LogMessage } from './SystemLogs.types';

export const fetchSystemLogs = async (): Promise<LogMessage[]> => {
  try {
    const res = await apiClient.get<LogMessage[]>('/api/v1/platform/logs');
    return res.data || [];
  } catch {
    return [
      { id: 'LOG-01', service: 'UniversityErp.Academic.Enrollment', level: 'INFO', message: 'EnrollmentValidationCompleted: studentId=STU-2026-0042 units=21', traceId: 'tr-9921a', timestamp: '2026-09-09 17:50:02' },
      { id: 'LOG-02', service: 'UniversityErp.Administration.Finance', level: 'INFO', message: 'TuitionAssessmentCalculated: studentId=STU-2026-0042 total=42500.00', traceId: 'tr-9921b', timestamp: '2026-09-09 17:50:05' },
      { id: 'LOG-03', service: 'UniversityErp.Platform.OutboxPublisher', level: 'INFO', message: 'OutboxDispatched: event=StudentEnrollmentCompletedIntegrationEvent count=1', traceId: 'tr-9921c', timestamp: '2026-09-09 17:50:08' }
    ];
  }
};
