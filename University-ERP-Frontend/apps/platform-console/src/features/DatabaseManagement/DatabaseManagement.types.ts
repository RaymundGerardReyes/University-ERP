export interface DatabaseCluster {
  nodeId: string;
  role: 'Primary' | 'ReadReplica';
  status: 'Online' | 'Syncing' | 'Degraded';
  connections: number;
  maxConnections: number;
  diskUsagePercent: number;
  replicationLagMs: number;
}
