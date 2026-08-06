export interface AuditLogItem {
    timestamp: string;
    actor: string;
    action: string;
    target: string;
    ip: string;
}
