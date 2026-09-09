import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const NotificationPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader
        title="Notification Delivery Service"
        subtitle="Configure multi-channel push, SMS, and email alert delivery queues."
      />
      <Card>
        <p>Notification Delivery Service is active and operating.</p>
      </Card>
    </div>
  );
};

export default NotificationPage;
