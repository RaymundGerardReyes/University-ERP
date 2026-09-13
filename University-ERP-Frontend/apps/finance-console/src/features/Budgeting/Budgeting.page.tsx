import React, { useState } from 'react';
import { Badge, Button, Card, FormInput, Modal, PageHeader, Table } from '@university-erp/ui-kit';
import { useBudgetSummary, useCreateBudget, useDepartmentBudgets } from './Budgeting.hooks';
import { CreateBudgetPayload, DepartmentBudgetDto } from './Budgeting.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const BudgetingPage: React.FC = () => {
  const [fiscalYear] = useState('FY2026-2027');
  
  // Queries & Mutations fetching real backend data
  const { data: rawBudgets, isLoading, isError } = useDepartmentBudgets(fiscalYear);
  const { data: summary } = useBudgetSummary(fiscalYear);
  const createMutation = useCreateBudget();

  // Local State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateBudgetPayload>({
    departmentCode: '',
    departmentName: '',
    fiscalYear: 'FY2026-2027',
    allocatedAmount: 0
  });

  // Safely fallback to an empty array while loading or if data is missing
  const budgets: DepartmentBudgetDto[] = toSafeArray<DepartmentBudgetDto>(rawBudgets);

  const filteredBudgets = budgets.filter((b) => 
    !searchFilter ||
    b.departmentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    b.departmentCode.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const activeBudget = budgets.find((b) => b.budgetId === selectedBudgetId);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentCode || !formData.departmentName || formData.allocatedAmount <= 0) return;
    try {
      await createMutation.mutateAsync(formData);
      setIsModalOpen(false);
      setFormData({
        departmentCode: '',
        departmentName: '',
        fiscalYear: 'FY2026-2027',
        allocatedAmount: 0
      });
    } catch (err: any) {
      alert(`Allocation failed: ${err?.message || 'Server error'}`);
    }
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Budgeting & Fiscal Allocation"
        subtitle="Manage departmental budgets, monitor line-item expenditures, and analyze variance."
        action={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add Department Allocation
          </Button>
        }
      />

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <Card>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Approved Budget</span>
          <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--text-primary)' }}>
            ${Number(summary?.totalAllocated ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
        </Card>
        <Card>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Disbursed to Date</span>
          <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--brand-primary)' }}>
            ${Number(summary?.totalSpent ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
        </Card>
        <Card>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Remaining Unencumbered</span>
          <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--success-text)' }}>
            ${Number(summary?.totalRemaining ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
        </Card>
      </div>

      {/* Main Two-Column Workbench */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(450px, 1fr) minmax(380px, 440px)', gap: 'var(--space-6)', alignItems: 'start' }}>
        
        {/* Left Column: Budgets Table */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', gap: 'var(--space-3)' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Department Ledgers</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Select a department to view the line-item breakdown.
              </span>
            </div>
            <div style={{ width: '220px' }}>
              <FormInput
                placeholder="Search code or name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="skeleton" style={{ height: '400px' }} />
          ) : isError ? (
            <div style={{ color: 'var(--danger-text)', padding: 'var(--space-4)', textAlign: 'center', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)' }}>
              Terminal disconnected from server. Please check your connection to the API.
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Dept Code</th>
                  <th>Department Name</th>
                  <th>Allocated</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)' }}>
                      No departmental budgets found for {fiscalYear}.
                    </td>
                  </tr>
                ) : (
                  filteredBudgets.map((b) => {
                    const isSelected = activeBudget?.budgetId === b.budgetId;
                    return (
                      <tr 
                        key={b.budgetId}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? 'var(--bg-active, rgba(59, 130, 246, 0.1))' : 'transparent'
                        }}
                        onClick={() => setSelectedBudgetId(b.budgetId)}
                      >
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.departmentCode}</td>
                        <td style={{ fontWeight: 600 }}>{b.departmentName}</td>
                        <td>${Number(b.allocatedAmount ?? 0).toLocaleString()}</td>
                        <td>
                          <Badge colorScheme={b.status === 'ON_TRACK' ? 'success' : (b.status === 'NEAR_LIMIT' ? 'warning' : 'danger')}>
                            {b.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            size="small"
                            variant={isSelected ? 'primary' : 'outline'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBudgetId(b.budgetId);
                            }}
                          >
                            {isSelected ? 'Inspecting' : 'Inspect'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          )}
        </Card>

        {/* Right Panel: Line Item Inspector */}
        {activeBudget ? (
          <Card style={{ border: '1px solid var(--border-accent, var(--border-color))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Line Item Inspector
                </span>
                <h3 style={{ margin: 'var(--space-1) 0 0 0', color: 'var(--text-primary)' }}>
                  {activeBudget.departmentName}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {activeBudget.departmentCode} &bull; {activeBudget.fiscalYear}
                </span>
              </div>
              <Badge colorScheme={activeBudget.status === 'ON_TRACK' ? 'success' : (activeBudget.status === 'NEAR_LIMIT' ? 'warning' : 'danger')}>
                {activeBudget.status.replace(/_/g, ' ')}
              </Badge>
            </div>

            {/* Budget Progress Bar */}
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Burn Rate</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {Math.round((activeBudget.spentAmount / (activeBudget.allocatedAmount || 1)) * 100)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${Math.min((activeBudget.spentAmount / (activeBudget.allocatedAmount || 1)) * 100, 100)}%`,
                    background: activeBudget.status === 'OVER_BUDGET' ? 'var(--danger-text)' : (activeBudget.status === 'NEAR_LIMIT' ? 'var(--warning-text)' : 'var(--brand-primary)'),
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--brand-primary)' }}>Spent: ${Number(activeBudget.spentAmount ?? 0).toLocaleString()}</span>
                <span style={{ color: activeBudget.remainingAmount < 0 ? 'var(--danger-text)' : 'var(--success-text)', fontWeight: 600 }}>
                  Remaining: ${Number(activeBudget.remainingAmount ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Granular Line Items */}
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-3)' }}>
                Granular Expenditures
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {toSafeArray(activeBudget.lineItems).length > 0 ? (
                  toSafeArray(activeBudget.lineItems).map((li) => {
                    const variance = (li.allocated ?? 0) - (li.spent ?? 0);
                    const isOver = variance < 0;
                    
                    return (
                      <div key={li.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{li.category}</span>
                          <span style={{ fontSize: '0.85rem', color: isOver ? 'var(--danger-text)' : 'var(--success-text)', fontWeight: 600 }}>
                            {isOver ? '-' : '+'}${Math.abs(variance).toLocaleString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Alloc: ${Number(li.allocated ?? 0).toLocaleString()}</span>
                          <span>Spent: ${Number(li.spent ?? 0).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    No granular line items configured for this department.
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <Button
              variant="outline"
              style={{ width: '100%', padding: 'var(--space-3)' }}
              onClick={() => alert('Opening Reallocation Protocol workflow...')}
            >
              Request Fund Reallocation
            </Button>
          </Card>
        ) : (
          <Card>
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
              Select a departmental budget from the ledger to view the granular line-item breakdown.
            </div>
          </Card>
        )}
      </div>

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

export default BudgetingPage;
