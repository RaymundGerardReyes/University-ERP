import React, { useState } from 'react';
import { Badge, Button, Card, FormInput, PageHeader, Table } from '@university-erp/ui-kit';
import { useGeneratePayslip, useRecentPayrollRuns } from './PayrollProcessing.hooks';
import { GeneratePayslipPayload, PayrollProcessingItem } from './PayrollProcessing.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const PayrollProcessingPage: React.FC = () => {
  const { mutateAsync: generatePayslip, isPending, error } = useGeneratePayslip();
  const { data: runs, isLoading: isRunsLoading } = useRecentPayrollRuns();

  const [formData, setFormData] = useState<GeneratePayslipPayload>({
    employeeId: '',
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payPeriod: 'Aug 2026'
  });

  const [searchFilter, setSearchFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const calculatedNet = Math.max(0, Number(formData.basicSalary) + Number(formData.allowances) - Number(formData.deductions));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!formData.employeeId.trim() || formData.basicSalary <= 0) return;

    try {
      const result = await generatePayslip({
        ...formData,
        basicSalary: Number(formData.basicSalary),
        allowances: Number(formData.allowances),
        deductions: Number(formData.deductions)
      });
      setSuccessMsg(`Payslip successfully generated! Reference ID: ${result.payslipId || 'PAY-' + Date.now()}`);
      setFormData({
        employeeId: '',
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        payPeriod: 'Aug 2026'
      });
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err: any) {
      console.error('Error generating payslip', err);
    }
  };

  const recentList: PayrollProcessingItem[] = toSafeArray<PayrollProcessingItem>(runs);
  const filteredList = recentList.filter(item =>
    !searchFilter ||
    (item.employeeName || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (item.employeeId || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (item.department || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fade-in">
      <PageHeader
        title="Payroll Processing"
        subtitle="Compute net compensation, configure salary allowances & deductions, and disburse employee payslips independently from HR records."
      />

      {/* KPI Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <Card>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current Pay Period</span>
          <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--text-primary)' }}>Aug 2026</h2>
        </Card>
        <Card>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Disbursed (Period)</span>
          <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--brand-primary)' }}>$26,750.00</h2>
        </Card>
        <Card>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Processed Headcount</span>
          <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--success-text)' }}>4 Employees</h2>
        </Card>
        <Card>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Disbursement Status</span>
          <div style={{ marginTop: 'var(--space-2)' }}>
            <Badge colorScheme="success">Payroll Cycle Active</Badge>
          </div>
        </Card>
      </div>

      {/* Main Two-Column Workbench */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Left Column: Computation & Generation Form */}
        <Card>
          <h3 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-primary)' }}>Generate Employee Payslip</h3>

          {error && (
            <div style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', color: 'var(--danger-text)', fontSize: '0.875rem' }}>
              {(error as any)?.message || 'Failed to process payslip. Please verify input parameters.'}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', color: 'var(--success-text)', fontSize: '0.875rem' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Employee ID (Staff Code or GUID)
              </label>
              <FormInput
                placeholder="e.g., EMP-FAC-1005"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Pay Period
              </label>
              <FormInput
                placeholder="e.g., Aug 2026"
                value={formData.payPeriod}
                onChange={(e) => setFormData({ ...formData, payPeriod: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Basic Monthly Salary ($)
              </label>
              <FormInput
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g., 5500.00"
                value={formData.basicSalary ? String(formData.basicSalary) : ''}
                onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Allowances ($)
                </label>
                <FormInput
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={String(formData.allowances)}
                  onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Deductions ($)
                </label>
                <FormInput
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={String(formData.deductions)}
                  onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Live Net Pay Computation Summary */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Computed Net Pay</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salary + Allowances - Deductions</div>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--success-text)' }}>
                ${calculatedNet.toFixed(2)}
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isPending || !formData.employeeId.trim() || formData.basicSalary <= 0}
              style={{ width: '100%', marginTop: 'var(--space-2)' }}
            >
              {isPending ? 'Processing Computation...' : 'Generate & Disburse Payslip'}
            </Button>
          </form>
        </Card>

        {/* Right Column: Recent Disbursals Table */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Recent Payroll Records</h3>
              <p style={{ margin: 'var(--space-1) 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Independently maintained salary ledger records for faculty and administrative staff.
              </p>
            </div>
            <div style={{ width: '240px' }}>
              <FormInput
                placeholder="Search staff or ID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          {isRunsLoading ? (
            <div className="skeleton" style={{ height: '300px' }} />
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Gross</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)' }}>
                      No payroll records found matching query.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.employeeName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{item.employeeId}</div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.department}</td>
                      <td>${(item.basicSalary + item.allowances).toLocaleString()}</td>
                      <td style={{ fontWeight: 700, color: 'var(--success-text)' }}>${item.netPay.toLocaleString()}</td>
                      <td>
                        <Badge colorScheme={item.status === 'DISBURSED' ? 'success' : 'warning'}>
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};
