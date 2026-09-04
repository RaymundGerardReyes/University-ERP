import { useMutation, useQuery } from '@tanstack/react-query';
import { admissionsApi, financeApi, financeBillingApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import axios from 'axios';
import React, { useState } from 'react';

export const ApplicationFeePaymentPage: React.FC = () => {
    const { identity } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash' | null>(null);
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const { data: journey, isLoading: isJourneyLoading, isError: isJourneyError } = useQuery({
        queryKey: ['admissions', 'journey', identity?.id],
        queryFn: () => admissionsApi.getApplicantJourney(identity!.id),
        enabled: !!identity?.id
    });

    const onlinePaymentMutation = useMutation({
        mutationFn: async () => {
            if (!journey?.applicantId) throw new Error("Application identifier not found.");
            
            return await financeApi.createPaymentSession({
                invoiceId: journey.applicantId, 
                applicantId: identity!.id,
                amount: 50.00, 
                purpose: 'Application Processing Fee'
            });
        },
        onSuccess: (data) => {
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                setActionError("Gateway configuration error: No checkout URL returned.");
            }
        },
        onError: (error: unknown) => {
            let msg = "Failed to initiate online payment session.";
            if (axios.isAxiosError(error)) msg = error.response?.data?.message || error.message;
            else if (error instanceof Error) msg = error.message;
            setActionError(msg);
        }
    });

    const cashTokenMutation = useMutation({
        mutationFn: async () => {
            if (!journey?.applicantId) throw new Error("Application identifier not found.");
            return await financeBillingApi.generateCashToken(journey.applicantId, 50.00);
        },
        onSuccess: (token) => setGeneratedToken(token),
        onError: (error: unknown) => {
            let msg = "Failed to generate official cashier token.";
            if (axios.isAxiosError(error)) msg = error.response?.data?.message || error.message;
            else if (error instanceof Error) msg = error.message;
            setActionError(msg);
        }
    });

    const handleSubmit = () => {
        setActionError(null);
        if (paymentMethod === 'online') onlinePaymentMutation.mutate();
        if (paymentMethod === 'cash') cashTokenMutation.mutate();
    };

    if (isJourneyLoading) return <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />;
    if (isJourneyError || !journey) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Application Unavailable</div>
                <div className="stub-subtitle">Unable to load application details. Please ensure your intake form is submitted.</div>
            </div>
        );
    }

    if (journey.applicationFeeStatus === 'Paid') {
        return (
            <div className="fade-in stub-page">
                <div className="stub-title" style={{ color: 'var(--success-text)' }}>Payment Settled</div>
                <div className="stub-subtitle">Your application fee has been verified by the Finance Office.</div>
                <Badge colorScheme="success" style={{ marginTop: 'var(--space-4)' }}>Requirement Complete</Badge>
            </div>
        );
    }

    if (generatedToken) {
        return (
            <div className="fade-in">
                <PageHeader title="Transaction Stub Generated" subtitle="Please present this token at the University Cashier." />
                <Card style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', borderStyle: 'dashed', borderWidth: '2px' }}>
                    <h2 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>Queue Ticket</h2>
                    <div style={{ margin: 'var(--space-6) 0' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Amount Due:</span>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>$50.00</div>
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Your Transaction Reference</div>
                        <div style={{ fontSize: '1.5rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-bright)' }}>{generatedToken}</div>
                    </div>
                    <p style={{ marginTop: 'var(--space-6)', fontSize: '0.85rem', color: 'var(--warning-text)', marginBottom: 'var(--space-4)' }}>
                        Status: Awaiting Cash Payment Verification
                    </p>
                </Card>
            </div>
        );
    }

    const isProcessing = onlinePaymentMutation.isPending || cashTokenMutation.isPending;

    return (
        <div className="fade-in">
            <PageHeader title="Application Fee Payment" subtitle="Select a payment method to fulfill your admission requirements." />
            
            {actionError && (
                <div style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', color: 'var(--danger-text)' }}>
                    <strong>System Error:</strong> {actionError}
                </div>
            )}

            <div className="grid-2 fade-in-delay-1">
                <Card style={{ cursor: 'pointer', borderColor: paymentMethod === 'online' ? 'var(--brand-primary)' : 'var(--border-color)', boxShadow: paymentMethod === 'online' ? 'var(--shadow-glow)' : 'var(--shadow-card)' }} onClick={() => setPaymentMethod('online')}>
                    <div className="card-accent-top" style={{ opacity: paymentMethod === 'online' ? 1 : 0 }} />
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Online Payment Gateway</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Process your payment securely via the university's unified gateway.</p>
                </Card>
                <Card style={{ cursor: 'pointer', borderColor: paymentMethod === 'cash' ? 'var(--brand-primary)' : 'var(--border-color)', boxShadow: paymentMethod === 'cash' ? 'var(--shadow-glow)' : 'var(--shadow-card)' }} onClick={() => setPaymentMethod('cash')}>
                    <div className="card-accent-top" style={{ opacity: paymentMethod === 'cash' ? 1 : 0 }} />
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Over-the-Counter Cash</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Generate a secure transaction stub to present at the on-campus Cashier.</p>
                </Card>
            </div>

            <div className="fade-in-delay-2" style={{ marginTop: 'var(--space-8)', textAlign: 'right' }}>
                <div style={{ display: 'inline-block', minWidth: '300px', textAlign: 'left' }}>
                    <div className="data-row" style={{ marginBottom: 'var(--space-4)' }}>
                        <span className="data-label">Total Fee:</span>
                        <span className="data-value" style={{ fontSize: '1.5rem', color: 'var(--text-bright)' }}>$50.00</span>
                    </div>
                    <Button variant="primary" size="large" style={{ width: '100%', justifyContent: 'center' }} disabled={!paymentMethod || isProcessing} onClick={handleSubmit}>
                        {isProcessing ? 'Processing Request...' : 'Proceed with Payment'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
