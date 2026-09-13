import React, { useState } from 'react';
import { Badge, Button, Card, FormInput, PageHeader, Table } from '@university-erp/ui-kit';
import { useCashierTransactions, useProcessCashPayment } from './Cashier.hooks';
import { CashierTransactionDto } from './Cashier.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const PaymentGatewayPage: React.FC = () => {
  // Fetching real data from the API hook
  const { data: rawTransactions, isLoading, isError } = useCashierTransactions();
  const processMutation = useProcessCashPayment();

  const [searchToken, setSearchToken] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('PENDING');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Safe fallback to an empty array while loading or if data is undefined
  const transactions: CashierTransactionDto[] = toSafeArray<CashierTransactionDto>(rawTransactions);

  // Client-side filtering of the real backend data
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      !searchToken ||
      (txn.transactionToken || '').toLowerCase().includes(searchToken.toLowerCase()) ||
      (txn.payerName || '').toLowerCase().includes(searchToken.toLowerCase()) ||
      (txn.referenceId || '').toLowerCase().includes(searchToken.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeTransaction = transactions.find((t) => t.transactionToken === selectedToken);

  // Payment Submission Handler
  const handleProcessPayment = async () => {
    if (!activeTransaction) return;
    try {
      // Mutate the real backend
      await processMutation.mutateAsync({
        transactionToken: activeTransaction.transactionToken,
        referenceId: activeTransaction.referenceId,
        amount: activeTransaction.amount
      });
      
      setSuccessNotice(`Payment of $${Number(activeTransaction.amount ?? 0).toFixed(2)} received from ${activeTransaction.payerName}.`);
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      alert(`Transaction failed: ${err?.message || 'System offline.'}`);
    }
  };

  // Browser Native Print Handler
  const handlePrintReceipt = () => {
    const printContent = document.getElementById('printable-receipt');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=600,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Official Receipt - ${activeTransaction?.transactionToken}</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; padding: 40px; color: #000; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px dashed #000; padding-bottom: 20px; }
              .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
              .bold { font-weight: bold; }
              .total-row { border-top: 2px dashed #000; padding-top: 15px; margin-top: 15px; font-size: 18px; }
              .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #555; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="fade-in">
      <PageHeader 
        title="Cashier Terminal & Receipts" 
        subtitle="Process over-the-counter payments, verify tokens, and issue official printable receipts." 
      />

      {successNotice && (
        <div style={{
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          background: 'var(--success-bg)',
          border: '1px solid var(--success-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--success-text)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)'
        }}>
          {successNotice}
        </div>
      )}

      {/* Main Two-Column Workbench */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(450px, 1fr) minmax(380px, 440px)', gap: 'var(--space-6)', alignItems: 'start' }}>
        
        {/* Left Column: Transaction Queue */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Daily Transaction Queue</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select a token to process payment or print receipt.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <FormInput
                  placeholder="Search token, student ID, or name..."
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {(['ALL', 'PENDING', 'COMPLETED'] as const).map(tab => (
                  <Button
                    key={tab}
                    variant={statusFilter === tab ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => setStatusFilter(tab)}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="skeleton" style={{ height: '300px' }} />
          ) : isError ? (
            <div style={{ color: 'var(--danger-text)', textAlign: 'center', padding: 'var(--space-4)', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)' }}>
              Terminal disconnected from server. Please check your connection to the API.
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Token ID</th>
                  <th>Student / Payer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)' }}>
                      No transactions found in the server queue.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(txn => {
                    const isSelected = activeTransaction?.transactionToken === txn.transactionToken;
                    return (
                      <tr 
                        key={txn.transactionToken}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? 'var(--bg-active, rgba(59, 130, 246, 0.1))' : 'transparent'
                        }}
                        onClick={() => setSelectedToken(txn.transactionToken)}
                      >
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>
                          {txn.transactionToken}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{txn.payerName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{txn.referenceId}</div>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                          ${Number(txn.amount ?? 0).toFixed(2)}
                        </td>
                        <td>
                          <Badge colorScheme={txn.status === 'COMPLETED' ? 'success' : 'warning'}>
                            {txn.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            size="small"
                            variant={isSelected ? 'primary' : 'outline'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedToken(txn.transactionToken);
                            }}
                          >
                            {txn.status === 'COMPLETED' ? 'View' : 'Process'}
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

        {/* Right Panel: Checkout / Receipt Inspector */}
        {activeTransaction ? (
          <Card style={{ border: '1px solid var(--border-accent, var(--border-color))' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  {activeTransaction.status === 'COMPLETED' ? 'Official Receipt' : 'Pending Payment'}
                </span>
                <h3 style={{ margin: 'var(--space-1) 0 0 0', color: 'var(--text-primary)' }}>
                  {activeTransaction.transactionToken}
                </h3>
              </div>
              <Badge colorScheme={activeTransaction.status === 'COMPLETED' ? 'success' : 'warning'}>
                {activeTransaction.status}
              </Badge>
            </div>

            <div id="printable-receipt" style={{ background: 'var(--bg-base)', padding: 'var(--space-5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: 'var(--space-6)' }}>
              
              <div className="header" style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>UNIVERSITY ERP</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Treasury & Cashier Services</span>
              </div>

              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Date / Time:</span>
                <span className="bold" style={{ fontWeight: 600 }}>
                  {activeTransaction.status === 'COMPLETED' && activeTransaction.completedAt 
                    ? new Date(activeTransaction.completedAt).toLocaleString() 
                    : new Date().toLocaleString()}
                </span>
              </div>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Terminal / Cashier:</span>
                <span className="bold" style={{ fontWeight: 600 }}>{activeTransaction.cashierId || 'Terminal-01'}</span>
              </div>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payer Name:</span>
                <span className="bold" style={{ fontWeight: 600 }}>{activeTransaction.payerName}</span>
              </div>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Reference / Student ID:</span>
                <span className="bold" style={{ fontWeight: 600 }}>{activeTransaction.referenceId}</span>
              </div>

              <div style={{ margin: '20px 0', borderTop: '1px dashed var(--border-color)', paddingTop: '15px' }}>
                <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>{activeTransaction.purpose}</span>
                  <span className="bold" style={{ fontWeight: 600 }}>${Number(activeTransaction.amount ?? 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border-color)', paddingTop: '15px', marginTop: '15px' }}>
                <span className="bold" style={{ fontWeight: 700, fontSize: '1.1rem' }}>TOTAL DUE</span>
                <span className="bold" style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--brand-primary)' }}>
                  ${Number(activeTransaction.amount ?? 0).toFixed(2)}
                </span>
              </div>

              {activeTransaction.status === 'COMPLETED' && (
                <div className="footer" style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Thank you for your payment.<br />
                  This document serves as an official university receipt.
                </div>
              )}
            </div>

            {/* Action Bar */}
            {activeTransaction.status === 'PENDING' ? (
              <Button
                variant="primary"
                style={{ width: '100%', padding: 'var(--space-3)' }}
                disabled={processMutation.isPending}
                onClick={handleProcessPayment}
              >
                {processMutation.isPending ? 'Processing with Server...' : 'Confirm Cash Received'}
              </Button>
            ) : (
              <Button
                variant="outline"
                style={{ width: '100%', padding: 'var(--space-3)', borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
                onClick={handlePrintReceipt}
              >
                Print Official Receipt
              </Button>
            )}

          </Card>
        ) : (
          <Card>
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
              Select a transaction token from the queue to process payment or print a receipt.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentGatewayPage;