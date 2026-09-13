import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useFinancialReports, useRevenueBreakdown } from './FinancialReports.hooks';
import { FinancialReportDto, RevenueBreakdownDto } from './FinancialReports.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const FinancialReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('FY2026-Q3');
  
  // Real backend hooks
  const { data: reportsData, isLoading: isReportsLoading, isError: isReportsError } = useFinancialReports();
  const { data: breakdownData, isLoading: isBreakdownLoading } = useRevenueBreakdown(selectedPeriod);

  // Fallback to empty arrays while data is fetching or undefined
  const reportItems: FinancialReportDto[] = toSafeArray<FinancialReportDto>(reportsData);
  const breakdownItems: RevenueBreakdownDto[] = toSafeArray<RevenueBreakdownDto>(breakdownData);

  return (
    <div className="fade-in">
      <PageHeader
        title="Financial Reports & Audits"
        subtitle="Review audited financial statements, evaluate revenue streams, and export official university ledger metrics."
        action={
          <Button variant="primary" onClick={() => alert('Generating PDF Export from Server...')}>
            Export Financial Pack (PDF)
          </Button>
        }
      />

      {/* Dynamic Revenue Stream Breakdown (Mapped from API) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {isBreakdownLoading ? (
          <>
             <div className="skeleton" style={{ height: '90px', borderRadius: 'var(--radius-md)' }} />
             <div className="skeleton" style={{ height: '90px', borderRadius: 'var(--radius-md)' }} />
             <div className="skeleton" style={{ height: '90px', borderRadius: 'var(--radius-md)' }} />
             <div className="skeleton" style={{ height: '90px', borderRadius: 'var(--radius-md)' }} />
          </>
        ) : breakdownItems.length > 0 ? (
          breakdownItems.map((item, index) => {
            // Apply different accent colors based on index for visual distinction
            const colors = ['var(--brand-primary)', 'var(--success-text)', 'var(--warning-text)', 'var(--text-primary)'];
            const color = colors[index % colors.length];
            
            return (
              <Card key={item.category}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.category}</span>
                <h3 style={{ margin: 'var(--space-2) 0 0 0', color }}>
                  ${Number(item.amount ?? 0).toLocaleString()} ({item.percentage}%)
                </h3>
              </Card>
            );
          })
        ) : (
          <Card style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
            No revenue breakdown data available for the selected period.
          </Card>
        )}
      </div>

      {/* Reports Table */}
      {isReportsLoading ? (
        <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
      ) : isReportsError ? (
        <Card style={{ borderColor: 'var(--danger-border)', background: 'var(--danger-bg)', color: 'var(--danger-text)' }}>
          Failed to retrieve financial reports from the reporting service. Please check the backend connection.
        </Card>
      ) : (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Official Statement Ledger</h3>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                outline: 'none'
              }}
            >
              <option value="FY2026-Q3">FY2026 Quarter 3</option>
              <option value="FY2026-Q2">FY2026 Quarter 2</option>
              <option value="FY2025-2026">Annual FY 2025-2026</option>
            </select>
          </div>

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
              {reportItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)' }}>
                    No financial reports published for this filter.
                  </td>
                </tr>
              ) : (
                reportItems.map((rep: FinancialReportDto) => (
                  <tr key={rep.reportId}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{rep.reportId}</td>
                    <td style={{ fontWeight: 600 }}>{rep.reportName}</td>
                    <td>{rep.period}</td>
                    <td style={{ color: 'var(--success-text)' }}>${Number(rep.totalRevenue ?? 0).toLocaleString()}</td>
                    <td style={{ color: 'var(--danger-text)' }}>${Number(rep.totalExpenditure ?? 0).toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: (rep.netMargin ?? 0) >= 0 ? 'var(--success-text)' : 'var(--danger-text)' }}>
                      ${Number(rep.netMargin ?? 0).toLocaleString()}
                    </td>
                    <td>
                      <Badge colorScheme={rep.status === 'Audited' ? 'success' : (rep.status === 'Final' ? 'info' : 'warning')}>
                        {rep.status}
                      </Badge>
                    </td>
                    <td>
                      <Button size="small" variant="outline" onClick={() => alert(`Downloading ${rep.reportId}...`)}>
                        Download
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default FinancialReportsPage;
