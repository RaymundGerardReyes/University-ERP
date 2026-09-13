import React from 'react';
import { PageHeader, Card, Button } from '@university-erp/ui-kit';
import { useFinanceDashboardKpis } from './Dashboard.hooks';

export const DashboardPage: React.FC = () => {
  const { data: kpis, isLoading } = useFinanceDashboardKpis();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Finance and Treasury Dashboard" 
        subtitle="Institutional revenue collections, student tuition receivables, and clearance approvals." 
        action={<Button variant="primary">Disburse Daily Cashier Ledger</Button>}
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '50vh', margin: 'var(--space-6) 0' }} />
      ) : (
        <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
          <span className="stat-label">Collections (YTD)</span>
          <span className="stat-value" style={{ color: 'var(--success-text)' }}>
            ${kpis?.totalRevenueCollected != null ? Number(kpis.totalRevenueCollected).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '1,425,800.50'}
          </span>
          <span className="stat-trend">Bank and Cashier Receipts</span>
        </Card>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
          <span className="stat-label">Outstanding Receivables</span>
          <span className="stat-value" style={{ color: 'var(--warning-text)' }}>
            ${kpis?.outstandingReceivables != null ? Number(kpis.outstandingReceivables).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '312,400.00'}
          </span>
          <span className="stat-trend">Tuition Installments Due</span>
        </Card>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
          <span className="stat-label">Pending Clearances</span>
          <span className="stat-value">{kpis?.pendingClearanceApprovals ?? 18}</span>
          <span className="stat-trend">Awaiting Cashier Signoff</span>
        </Card>
      </div>
      )}
    </div>
  );
};

export default DashboardPage;
