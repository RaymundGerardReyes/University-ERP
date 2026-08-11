import React, { useState } from 'react';
import { PageHeader, Card, Button, Badge } from '@university-erp/ui-kit';
import { useAuth } from '@university-erp/auth-sdk';
import { financeBillingApi, admissionsApi, apiClient } from '@university-erp/api-clients';
import { useQuery } from '@tanstack/react-query';

type PaymentStatus = 'pending' | 'paid' | 'awaiting_cash' | 'error';
type PaymentMethod = 'online' | 'cash' | null;

export const ApplicationFeePaymentPage: React.FC = () => {
    const { identity } = useAuth();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch the actual application data to retrieve the true Application ID
    const { data: journey, isLoading } = useQuery({
        queryKey: ['applicantJourney', identity?.id],
        queryFn: () => admissionsApi.getApplicantJourney(identity!.id),
        enabled: !!identity?.id
    });

    const handleRerouteToFinance = (tokenId: string | null) => {
        if (!tokenId) return;
        const financeConsoleUrl = `http://localhost:5176/cashier/payments?token=${encodeURIComponent(tokenId)}`;
        window.open(financeConsoleUrl, '_blank', 'noopener,noreferrer');
    };

    const handleOnlinePayment = async () => {
        setProcessing(true);
        setErrorMessage(null);

        try {
            const trueApplicationId = journey?.applicantId;

            if (!trueApplicationId) {
                throw new Error("Application ID could not be found. Please ensure your application is submitted.");
            }

            // Create a Payment Session in Finance Bounded Context
            const response = await apiClient.post('/finance/payment-sessions', {
                invoiceId: `APP-FEE-${trueApplicationId}`,
                applicantId: identity?.id || trueApplicationId,
                amount: 50.00,
                purpose: 'Application Processing Fee'
            });

            const sessionId = response.data.sessionId;

            // Redirect the user to the standalone Payment Gateway surface
            window.location.href = `http://localhost:5184?sessionId=${sessionId}`;
        } catch (error: any) {
            console.error("Online payment session generation failed:", error);
            setPaymentStatus('error');
            setErrorMessage(error?.response?.data?.message || error?.message || "Failed to create payment session. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    const handleCashPayment = async () => {
        setProcessing(true);
        setErrorMessage(null);
        await new Promise(resolve => setTimeout(resolve, 800));

        const generatedToken = `TXN-CSH-${Math.floor(Math.random() * 1000000)}`;
        setTransactionId(generatedToken);

        try {
            const existingTokensRaw = localStorage.getItem('pending_cash_transactions');
            const existingTokens = existingTokensRaw ? JSON.parse(existingTokensRaw) : [];
            
            const trueApplicationId = journey?.applicantId || 'APP-DEFAULT-001';

            existingTokens.push({
                transactionId: generatedToken,
                applicantId: trueApplicationId,
                applicantName: identity?.name || 'Guest Applicant',
                amount: 50.00,
                status: 'Pending',
                date: new Date().toISOString()
            });
            
            localStorage.setItem('pending_cash_transactions', JSON.stringify(existingTokens));
            setPaymentStatus('awaiting_cash');
        } catch (error) {
            console.error("Failed to write to local shared state:", error);
            setPaymentStatus('error');
            setErrorMessage("Failed to generate cash token.");
        } finally {
            setProcessing(false);
        }
    };

    const handleSubmit = () => {
        if (paymentMethod === 'online') handleOnlinePayment();
        if (paymentMethod === 'cash') handleCashPayment();
    };

    if (isLoading) {
        return <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />;
    }

    if (paymentStatus === 'paid') {
        return (
            <div className="fade-in stub-page">
                <div className="stub-icon">✅</div>
                <div className="stub-title">Payment Successful</div>
                <div className="stub-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
                    Your application fee has been processed securely. Your unique Transaction ID is <strong>{transactionId}</strong>.
                </div>
                <Badge colorScheme="success" style={{ marginBottom: 'var(--space-6)' }}>Requirement Complete</Badge>
                
                <Button 
                    variant="outline" 
                    onClick={() => handleRerouteToFinance(transactionId)}
                >
                    Verify Receipt in Finance Console ↗
                </Button>
            </div>
        );
    }

    if (paymentStatus === 'awaiting_cash') {
        return (
            <div className="fade-in">
                <PageHeader 
                    title="Transaction Stub Generated" 
                    subtitle="Please present this token at the University Finance Office to clear your fee." 
                />
                <Card style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', borderStyle: 'dashed', borderWidth: '2px' }}>
                    <h2 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
                        Queue Ticket / Transaction Stub
                    </h2>
                    <div style={{ margin: 'var(--space-6) 0' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Amount Due:</span>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>$50.00</div>
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                            Your Transaction ID
                        </div>
                        <div style={{ fontSize: '1.5rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-bright)', letterSpacing: '0.05em' }}>
                            {transactionId}
                        </div>
                    </div>
                    <p style={{ marginTop: 'var(--space-6)', fontSize: '0.85rem', color: 'var(--warning-text)', marginBottom: 'var(--space-4)' }}>
                        Status: Awaiting Cash Payment Verification
                    </p>

                    <Button 
                        variant="primary" 
                        style={{ width: '100%' }}
                        onClick={() => handleRerouteToFinance(transactionId)}
                    >
                        Process at Finance Console ↗
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader 
                title="Application Fee Payment" 
                subtitle="Select a payment method to fulfill your admission requirements." 
            />
            
            {paymentStatus === 'error' && (
                <div style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', color: 'var(--danger-text)' }}>
                    <strong>Error:</strong> {errorMessage}
                </div>
            )}

            <div className="grid-2 fade-in-delay-1">
                <Card 
                    style={{ 
                        cursor: 'pointer', 
                        borderColor: paymentMethod === 'online' ? 'var(--brand-primary)' : 'var(--border-color)',
                        boxShadow: paymentMethod === 'online' ? 'var(--shadow-glow)' : 'var(--shadow-card)'
                    }}
                    onClick={() => setPaymentMethod('online')}
                >
                    <div className="card-accent-top" style={{ opacity: paymentMethod === 'online' ? 1 : 0 }} />
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Online Bank Transfer</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Process your payment dynamically via our secure online gateway.
                    </p>
                </Card>

                <Card 
                    style={{ 
                        cursor: 'pointer', 
                        borderColor: paymentMethod === 'cash' ? 'var(--brand-primary)' : 'var(--border-color)',
                        boxShadow: paymentMethod === 'cash' ? 'var(--shadow-glow)' : 'var(--shadow-card)'
                    }}
                    onClick={() => setPaymentMethod('cash')}
                >
                    <div className="card-accent-top" style={{ opacity: paymentMethod === 'cash' ? 1 : 0 }} />
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Cash at Finance Office</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Generate a transaction stub to pay in person at the cashier desk.
                    </p>
                </Card>
            </div>

            <div className="fade-in-delay-2" style={{ marginTop: 'var(--space-8)', textAlign: 'right' }}>
                <div style={{ display: 'inline-block', minWidth: '300px', textAlign: 'left' }}>
                    <div className="data-row" style={{ marginBottom: 'var(--space-4)' }}>
                        <span className="data-label">Total Fee:</span>
                        <span className="data-value" style={{ fontSize: '1.5rem', color: 'var(--text-bright)' }}>$50.00</span>
                    </div>
                    <Button 
                        variant="primary" 
                        size="large" 
                        style={{ width: '100%' }}
                        disabled={!paymentMethod || processing || !journey}
                        onClick={handleSubmit}
                    >
                        {processing ? 'Processing Request...' : 'Proceed with Payment'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
