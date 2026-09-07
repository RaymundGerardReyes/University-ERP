export interface OfflineSyncPayload<T = any> {
  id: string;
  entityType: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: T;
  timestamp: string;
  synced: boolean;
}

export interface SyncEngineContract {
  enqueueSync(payload: OfflineSyncPayload): Promise<void>;
  processPendingSync(): Promise<number>;
  getPendingCount(): Promise<number>;
}
