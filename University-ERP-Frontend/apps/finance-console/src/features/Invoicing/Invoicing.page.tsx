import React, { useState } from 'react';
import { Badge, Button, Card, FormInput, Modal, PageHeader, Table } from '@university-erp/ui-kit';
import { useInvoices, useIssueInvoice } from './Invoicing.hooks';
import { InvoiceDto, InvoiceStatus, IssueInvoicePayload } from './Invoicing.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const InvoicingPage: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvoiceStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<IssueInvoicePayload>({
    studentId: '',
    termId: 'TERM-FALL-2026',
    amount: 0,
    description: '',
    dueDate: '2026-10-31'
  });

  const { data: invoices, isLoading, isError } = useInvoices(selectedTerm === 'ALL' ? undefined : selectedTerm);
  const issueMutation = useIssueInvoice();

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || formData.amount <= 0) return;
    await issueMutation.mutateAsync(formData);
    setIsModalOpen(false);
    setFormData({
      studentId: '',
      termId: 'TERM-FALL-2026',
      amount: 0,
      description: '',
      dueDate: '2026-10-31'
    });
  };

  const allItems: InvoiceDto[] = toSafeArray<InvoiceDto>(invoices);
  const filteredItems = allItems.filter((inv) => {
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      (inv.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.invoiceId || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalUnpaid = allItems.filter(i => i.status === 'UNPAID').reduce((acc, i) => acc + (i.amountDue - i.amountPaid), 0);
  const totalPaid = allItems.filter(i => i.status === 'PAID').reduce((acc, i) => acc + i.amountPaid, 0);

  return (
    <div className="fade-in">
      <PageHeader
        title="Tuition & Invoicing"
        subtitle="Manage student billing invoices, track receivables, and issue manual adjustments."
        action={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Issue New Invoice
          </Button>
        }
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
      ) : isError ? (
        <Card style={{ borderColor: 'var(--danger-border)', color: 'var(--danger-text)' }}>
          Failed to load invoices. Please retry later.
        </Card>
      ) : (
        <>
          {/* KPI Receivables */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Outstanding Receivables</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--warning-text)' }}>
                ${totalUnpaid.toLocaleString()}
              </h2>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Collections</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--success-text)' }}>
                ${totalPaid.toLocaleString()}
              </h2>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Invoices</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--text-primary)' }}>
                {allItems.length}
              </h2>
            </Card>
          </div>

          {/* Filter and Search Bar */}
          <Card style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <FormInput
                  placeholder="Search by Student ID or Invoice ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {(['ALL', 'UNPAID', 'PARTIAL', 'PAID'] as const).map((st) => (
                  <Button
                    key={st}
                    variant={statusFilter === st ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Invoice Table */}
          <Card>
            <Table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Student ID</th>
                  <th>Term</th>
                  <th>Amount Due</th>
                  <th>Amount Paid</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No invoices found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((inv) => (
                    <tr key={inv.invoiceId}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{inv.invoiceId}</td>
                      <td style={{ fontWeight: 600 }}>{inv.studentId}</td>
                      <td>{inv.termId}</td>
                      <td>${inv.amountDue.toFixed(2)}</td>
                      <td style={{ color: inv.amountPaid > 0 ? 'var(--success-text)' : 'inherit' }}>
                        ${inv.amountPaid.toFixed(2)}
                      </td>
                      <td>{inv.dueDate}</td>
                      <td>
                        <Badge colorScheme={inv.status === 'PAID' ? 'success' : (inv.status === 'PARTIAL' ? 'warning' : 'danger')}>
                          {inv.status}
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

      {/* Issue Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 style={{ marginTop: 0, marginBottom: 'var(--space-4)' }}>Issue Student Invoice</h2>
          <form onSubmit={handleIssue} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Student ID</label>
              <FormInput
                placeholder="e.g. STU-2026-001"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Description</label>
              <FormInput
                placeholder="e.g. Late Registration Fee / Laboratory Fee"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Amount ($)</label>
              <FormInput
                type="number"
                min="1"
                step="0.01"
                value={formData.amount ? String(formData.amount) : ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Due Date</label>
              <FormInput
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={issueMutation.isPending}>
                {issueMutation.isPending ? 'Issuing...' : 'Issue Invoice'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
