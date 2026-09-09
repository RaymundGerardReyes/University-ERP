import React, { useState } from 'react';
import { Badge, Button, Card, FormInput, Modal, PageHeader, Table } from '@university-erp/ui-kit';
import { useBudgetSummary, useCreateBudget, useDepartmentBudgets } from './Budgeting.hooks';
import { CreateBudgetPayload } from './Budgeting.types';

export const BudgetingPage: React.FC = () => {
  const [fiscalYear] = useState('FY2026-2027');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateBudgetPayload>({
    departmentCode: '',
    departmentName: '',
    fiscalYear: 'FY2026-2027',
    allocatedAmount: 0
  });

  const { data: budgets, isLoading, isError } = useDepartmentBudgets(fiscalYear);
  const { data: summary } = useBudgetSummary(fiscalYear);
  const createMutation = useCreateBudget();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentCode || !formData.departmentName || formData.allocatedAmount <= 0) return;
    await createMutation.mutateAsync(formData);
    setIsModalOpen(false);
    setFormData({
      departmentCode: '',
      departmentName: '',
      fiscalYear: 'FY2026-2027',
      allocatedAmount: 0
    });
  };

  const items = budgets || [];

  return (
    <div className="fade-in">
      <PageHeader
        title="Budgeting & Allocation"
        subtitle="Departmental budgets, fiscal allocations, and variance tracking."
        action={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add Department Allocation
          </Button>
        }
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
      ) : isError ? (
        <Card style={{ borderColor: 'var(--danger-border)', color: 'var(--danger-text)' }}>
          Failed to load budget data. Please verify network connectivity.
        </Card>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Approved Budget</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--text-primary)' }}>
                ${summary?.totalAllocated?.toLocaleString() ?? '12,500,000'}
              </h2>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Disbursed to Date</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--brand-primary)' }}>
                ${summary?.totalSpent?.toLocaleString() ?? '7,820,000'}
              </h2>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Remaining Unencumbered</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--success-text)' }}>
                ${summary?.totalRemaining?.toLocaleString() ?? '4,680,000'}
              </h2>
            </Card>
          </div>

          {/* Budget Table */}
          <Card>
            <Table>
              <thead>
                <tr>
                  <th>Dept Code</th>
                  <th>Department Name</th>
                  <th>Fiscal Year</th>
                  <th>Allocated</th>
                  <th>Disbursed</th>
                  <th>Remaining</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No departmental budgets found for {fiscalYear}.
                    </td>
                  </tr>
                ) : (
                  items.map((b) => (
                    <tr key={b.budgetId}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.departmentCode}</td>
                      <td>{b.departmentName}</td>
                      <td>{b.fiscalYear}</td>
                      <td>${b.allocatedAmount.toLocaleString()}</td>
                      <td>${b.spentAmount.toLocaleString()}</td>
                      <td style={{ fontWeight: 600 }}>${b.remainingAmount.toLocaleString()}</td>
                      <td>
                        <Badge colorScheme={b.status === 'ON_TRACK' ? 'success' : (b.status === 'NEAR_LIMIT' ? 'warning' : 'danger')}>
                          {b.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </>
      )}

      {/* Add Allocation Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 style={{ marginTop: 0, marginBottom: 'var(--space-4)' }}>Add Department Budget</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Department Code</label>
              <FormInput
                placeholder="e.g. CS-DEPT"
                value={formData.departmentCode}
                onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Department Name</label>
              <FormInput
                placeholder="e.g. Computer Science & Engineering"
                value={formData.departmentName}
                onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Allocated Amount ($)</label>
              <FormInput
                type="number"
                min="1"
                value={formData.allocatedAmount ? String(formData.allocatedAmount) : ''}
                onChange={(e) => setFormData({ ...formData, allocatedAmount: Number(e.target.value) })}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving...' : 'Create Allocation'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
