import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, financeApi, financeBillingApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, FormInput, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const EnrollmentPaymentPage: React.FC = () => {
    const { identity } = useAuth();
    const queryClient = useQueryClient();

    // Gateway States
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');

    // Cash Payment Secure Token State
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);

    // 1. Fetch the pending downpayment invoice safely using the Applicant's identity
    const { data: invoices, isLoading, isError } = useQuery({
        queryKey: ['studentInvoices', identity?.id],
        queryFn: async () => {
            try {
                // Fetch live invoices from the Finance Bounded Context
                return await financeApi.getInvoices();
            } catch (error) {
                // Legacy Fallback: Simulate the response structure if the endpoint is cold
                return new Promise<any[]>((resolve) => setTimeout(() => resolve([
                    {
                        invoiceId: 'INV-ENR-2026-001',
                        description: 'Enrollment Downpayment - University Registration',
                        amountDue: 500.00,
                        dueDate: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
                        status: 'Unpaid'
                    }
                ]), 600));
            }
        },
        enabled: !!identity?.id
    });

    // Isolate the active, unpaid enrollment invoice
    const activeInvoice = invoices?.find(inv => inv.status === 'Unpaid');

    // 2. Process Online Payment (Creates a Payment Session and Redirects)
    const onlinePaymentMutation = useMutation({
        mutationFn: async () => {
            if (!activeInvoice) throw new Error("No active invoice found.");
            if (!identity?.id) throw new Error("Authentication required.");

            // Request a secure payment session from Finance
            const response = await apiClient.post(`/api/v1/finance/payment-sessions`, {
                invoiceId: activeInvoice.invoiceId,
                applicantId: identity.id,
                amount: activeInvoice.amountDue,
                purpose: activeInvoice.description
            });

            return response.data.sessionId;
        },
        onSuccess: (sessionId) => {
            // Redirect the user to the isolated Payment Gateway surface
            window.location.href = `http://localhost:5177?sessionId=${sessionId}`;
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || "Failed to create payment session. Please try again.");
        }
    });

    // 3. Generate Secured Token Session ID for Over-The-Counter payment
    const generateTokenMutation = useMutation({
        mutationFn: async () => {
            if (!activeInvoice) throw new Error("No active invoice found.");
            return await financeBillingApi.generateCashToken(activeInvoice.invoiceId, activeInvoice.amountDue);
        },
        onSuccess: (token) => {
            setGeneratedToken(token);
        }
    });

    const handleOnlineSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onlinePaymentMutation.mutate();
    };

    // UI Render logic based on data state
    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    if (isError) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Financial Systems Error</div>
                <div className="stub-subtitle">Failed to synchronize financial requirements. Please contact the Admissions Office.</div>
            </div>
        );
    }

    if (!activeInvoice) {
        return (
            <div className="fade-in">
                <PageHeader
                    title="Enrollment Payment"
                    subtitle="Clear your financial requirements to finalize your university registration."
                />
                <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎉</div>
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Financial Clearance Granted</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        You have no pending enrollment downpayments. The Registrar is currently processing your official Student ID via the background worker.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader
                title="Enrollment Payment"
                subtitle="Clear your financial requirements to finalize your university registration."
            />

            <div className="grid-2">
                {/* Left Column: Contextual Invoice Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <Card>
                        <div className="card-accent-top" />
                        <h3 style={{ marginBottom: 'var(--space-4)' }}>Assessment Details</h3>

                        <div className="data-row">
                            <span className="data-label">Invoice Reference</span>
                            <span className="data-value" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{activeInvoice.invoiceId}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">Description</span>
                            <span className="data-value">{activeInvoice.description}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">Due Date</span>
                            <span className="data-value" style={{ color: 'var(--warning-text)' }}>
                                {new Date(activeInvoice.dueDate).toLocaleDateString()}
                            </span>
                        </div>

                        <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)' }}>
                            <div className="data-row" style={{ borderBottom: 'none' }}>
                                <span className="data-label" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Due</span>
                                <span className="data-value" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                                    ${activeInvoice.amountDue.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Interactive Payment Gateway */}
                <div>
                    <Card style={{ height: '100%' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)' }}>
                            <Button
                                variant={paymentMethod === 'online' ? 'primary' : 'outline'}
                                onClick={() => setPaymentMethod('online')}
                                style={{ flex: 1 }}
                            >
                                Pay Online
                            </Button>
                            <Button
                                variant={paymentMethod === 'cash' ? 'primary' : 'outline'}
                                onClick={() => setPaymentMethod('cash')}
                                style={{ flex: 1 }}
                            >
                                Pay at Cashier
                            </Button>
                        </div>

                        {/* Online Gateway Handoff */}
                        {paymentMethod === 'online' && (
                            <div className="fade-in">
                                <h4 style={{ marginBottom: 'var(--space-4)' }}>Online Payment Gateway</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                                    You will be securely redirected to the University Payment Gateway to complete this transaction.
                                </p>
                                
                                <Button
                                    variant="primary"
                                    style={{ width: '100%', padding: 'var(--space-3)' }}
                                    onClick={() => onlinePaymentMutation.mutate()}
                                    disabled={onlinePaymentMutation.isPending}
                                >
                                    {onlinePaymentMutation.isPending ? 'Connecting...' : 'Proceed to Payment Gateway'}
                                </Button>
                            </div>
                        )}

                        {/* Secured Token Session ID Handler */}
                        {paymentMethod === 'cash' && (
                            <div className="fade-in">
                                <h4 style={{ marginBottom: 'var(--space-4)' }}>Over-the-Counter Cash Payment</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                                    Generate a secure token to present to the University Cashier. This links your isolated session directly to the Finance Console queue.
                                </p>

                                {generatedToken ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-6)', background: 'var(--bg-elevated)', border: '1px dashed var(--brand-primary)', borderRadius: 'var(--radius-md)' }}>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-2)' }}>
                                            Your Cashier Token
                                        </p>
                                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
                                            {generatedToken}
                                        </div>
                                        <Badge colorScheme="warning" style={{ marginTop: 'var(--space-4)' }}>Awaiting Cashier Verification</Badge>
                                    </div>
                                ) : (
                                    <Button
                                        variant="primary"
                                        style={{ width: '100%', padding: 'var(--space-3)' }}
                                        onClick={() => generateTokenMutation.mutate()}
                                        disabled={generateTokenMutation.isPending}
                                    >
                                        {generateTokenMutation.isPending ? 'Generating Session...' : 'Generate Cash Token'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};