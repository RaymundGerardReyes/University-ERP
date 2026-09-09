import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useFinancialReports, useRevenueBreakdown } from './FinancialReports.hooks';

export const FinancialReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('FY2026-Q3');
  const { data: reports, isLoading, isError } = useFinancialReports();
  const { data: breakdown } = useRevenueBreakdown(selectedPeriod);

  const reportItems = reports || [
    { reportId: 'REP-2026-001', reportName: 'Q2 Comprehensive Operating Statement', period: 'FY2026-Q2', generatedDate: '2026-06-30', totalRevenue: 8540000, totalExpenditure: 6200000, netMargin: 2340000, status: 'Audited' },
    { reportId: 'REP-2026-002', reportName: 'Q3 Mid-Term Financial Review', period: 'FY2026-Q3', generatedDate: '2026-09-01', totalRevenue: 9120000, totalExpenditure: 7100000, netMargin: 2020000, status: 'Final' },
    { reportId: 'REP-2026-003', reportName: 'Annual Faculty Research Grant Audit', period: 'FY2025-2026', generatedDate: '2026-08-15', totalRevenue: 3400000, totalExpenditure: 3250000, netMargin: 150000, status: 'Audited' }
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Financial Reports"
        subtitle="Audited financial statements, revenue streams, and university ledger metrics."
        action={
          <Button variant="outline" onClick={() => alert('Generating PDF Export...')}>
            Export Financial Pack (PDF)
          </Button>
        }
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
      ) : isError ? (
        <Card style={{ borderColor: 'var(--danger-border)', color: 'var(--danger-text)' }}>
          Failed to load financial reports.
        </Card>
      ) : (
        <>
          {/* Revenue Stream Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tuition & Academic Fees</span>
              <h3 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--brand-primary)' }}>$14,200,000 (68%)</h3>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Research & Industry Grants</span>
              <h3 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--success-text)' }}>$4,100,000 (20%)</h3>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Auxiliary & Campus Services</span>
              <h3 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--warning-text)' }}>$1,850,000 (9%)</h3>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Endowment & Donations</span>
              <h3 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--text-primary)' }}>$650,000 (3%)</h3>
            </Card>
          </div>

          {/* Reports Table */}
          <Card>
            <Table>
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Report Title</th>
                  <th>Fiscal Period</th>
                  <th>Total Revenue</th>
                  <th>Total Expenses</th>
                  <th>Net Margin</th>
                  <th>Audit Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reportItems.map((rep: any) => (
                  <tr key={rep.reportId}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{rep.reportId}</td>
                    <td style={{ fontWeight: 600 }}>{rep.reportName}</td>
                    <td>{rep.period}</td>
                    <td style={{ color: 'var(--success-text)' }}>${rep.totalRevenue.toLocaleString()}</td>
                    <td style={{ color: 'var(--danger-text)' }}>${rep.totalExpenditure.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: rep.netMargin >= 0 ? 'var(--success-text)' : 'var(--danger-text)' }}>
                      ${rep.netMargin.toLocaleString()}
                    </td>
                    <td>
                      <Badge colorScheme={rep.status === 'Audited' ? 'success' : 'warning'}>
                        {rep.status}
                      </Badge>
                    </td>
                    <td>
                      <Button size="small" variant="outline" onClick={() => alert(`Downloading ${rep.reportId}...`)}>
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
};
