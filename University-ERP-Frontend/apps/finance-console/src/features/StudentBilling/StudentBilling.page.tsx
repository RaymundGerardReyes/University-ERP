import React from 'react';
import { Badge, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useStudentBillings } from './StudentBilling.hooks';
import { toSafeArray } from '../../utils/arrayUtils';

export const StudentBillingPage: React.FC = () => {
    const { data: rawBillings, isLoading, isError } = useStudentBillings();
    const billings = toSafeArray(rawBillings);

    return (
        <div className="fade-in">
            <PageHeader 
                title="Student Billing Administration" 
                subtitle="Manage and view dynamically generated student tuition invoices and balances." 
            />
            
            {isLoading ? (
              <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
            ) : isError ? (
              <div className="stub-page fade-in">
                  <div className="stub-title">Data Unavailable</div>
                  <div className="stub-subtitle">Failed to load dynamic student billings from the server.</div>
              </div>
            ) : (
              <Card>
                  <Table>
                      <thead>
                          <tr>
                              <th>Student ID</th>
                              <th>Description</th>
                              <th>Total Assessed</th>
                              <th>Paid Amount</th>
                              <th>Outstanding</th>
                              <th>Status</th>
                              <th>Issued On</th>
                          </tr>
                      </thead>
                      <tbody>
                          {billings.length === 0 ? (
                              <tr>
                                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                      No student billings found. Process an admission enrollment to auto-generate a bill.
                                  </td>
                              </tr>
                          ) : (
                              billings.map(billing => (
                                  <tr key={billing.id}>
                                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                          {billing.studentId ? (billing.studentId.length > 8 ? billing.studentId.substring(0, 8) + '...' : billing.studentId) : 'N/A'}
                                      </td>
                                      <td style={{ fontWeight: 600 }}>{billing.description}</td>
                                      <td>${Number(billing.totalAmount ?? 0).toFixed(2)}</td>
                                      <td style={{ color: (billing.paidAmount ?? 0) > 0 ? 'var(--success-text)' : 'inherit' }}>
                                          ${Number(billing.paidAmount ?? 0).toFixed(2)}
                                      </td>
                                      <td style={{ 
                                          color: (billing.outstandingBalance ?? 0) > 0 ? 'var(--warning-text)' : 'var(--success-text)', 
                                          fontWeight: 'bold' 
                                      }}>
                                          ${Number(billing.outstandingBalance ?? 0).toFixed(2)}
                                      </td>
                                      <td>
                                          <Badge colorScheme={
                                              billing.status === 'PAID' ? 'success' : 
                                              (billing.status === 'PARTIAL' ? 'warning' : 'danger')
                                          }>
                                              {billing.status}
                                          </Badge>
                                      </td>
                                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                          {new Date(billing.issuedOnUtc).toLocaleDateString()}
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
