import { useMutation, useQuery } from '@tanstack/react-query';
import { financeBillingApi } from '@university-erp/api-clients';
import { Badge, Button, Card, FormInput, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const PaymentGatewayPage: React.FC = () => {
    const [searchToken, setSearchToken] = useState('');
    const [activeToken, setActiveToken] = useState<string | null>(null);

    // Query to fetch pending token details from the backend
    const { data: transaction, isLoading, isError, refetch } = useQuery({
        queryKey: ['cashTransaction', activeToken],
        queryFn: () => financeBillingApi.getPendingCashToken(activeToken!),
        enabled: !!activeToken,
        retry: false
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchToken.trim()) {
            setActiveToken(searchToken.trim());
        }
    };

    // Mutation to process the payment
    const processPaymentMutation = useMutation({
        mutationFn: async () => {
            if (!transaction) throw new Error("No transaction selected");

            // 1. Mark Cash Transaction as complete in Finance Domain
            await financeBillingApi.completeCashTransaction(transaction.transactionToken);

            // 2. Notify Admissions Domain that the Application fee is paid
            await financeBillingApi.payApplicationFee(transaction.referenceId, {
                amount: transaction.amount,
                transactionId: transaction.transactionToken
            });
        },
        onSuccess: () => {
            alert("Payment processed successfully!");
            setActiveToken(null);
            setSearchToken('');
            refetch(); // Invalidate
        },
        onError: (err) => {
            console.error("Processing failed", err);
            alert("Failed to process payment. Please verify the token status.");
        }
    });

    return (
        <div className="fade-in">
            <PageHeader title="Cashier Terminal" subtitle="Process over-the-counter payments and student fees." />

            <Card style={{ marginBottom: 'var(--space-6)' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            placeholder="Enter Transaction Token (e.g., TXN-CSH-...)"
                            value={searchToken}
                            onChange={(e) => setSearchToken(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="primary">Lookup Token</Button>
                </form>
            </Card>

            {isLoading && <div className="skeleton" style={{ height: '200px' }} />}

            {isError && activeToken && (
                <div style={{ padding: 'var(--space-4)', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)' }}>
                    Token not found or already processed. Please verify the code with the student.
                </div>
            )}

            {transaction && (
                <Card className="fade-in-delay-1">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                        <h3>Transaction Details</h3>
                        <Badge colorScheme={transaction.status === 'Pending' ? 'warning' : 'success'}>
                            {transaction.status}
                        </Badge>
                    </div>

                    <div className="data-row">
                        <span className="data-label">Reference ID (App ID)</span>
                        <span className="data-value">{transaction.referenceId}</span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">Amount Due</span>
                        <span className="data-value" style={{ fontSize: '1.5rem', color: 'var(--brand-primary)' }}>
                            ${transaction.amount.toFixed(2)}
                        </span>
                    </div>

                    <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
                        <Button variant="outline" onClick={() => setActiveToken(null)}>Cancel</Button>
                        <Button
                            variant="primary"
                            disabled={transaction.status !== 'Pending' || processPaymentMutation.isPending}
                            onClick={() => processPaymentMutation.mutate()}
                        >
                            {processPaymentMutation.isPending ? 'Processing...' : 'Confirm Cash Received'}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};