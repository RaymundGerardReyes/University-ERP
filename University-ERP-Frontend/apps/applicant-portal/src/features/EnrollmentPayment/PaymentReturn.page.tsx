import { useQuery, useQueryClient } from '@tanstack/react-query';
import { financePaymentSessionApi } from '@university-erp/api-clients';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PAID_STATUSES = new Set([
    'COMPLETED',
    'PAID',
    'SETTLED',
    'VERIFIED',
    'PAYMENT_VERIFIED',
    'SUCCESS'
]);

export const isSessionPaid = (status?: string): boolean => {
    if (!status) return false;
    return PAID_STATUSES.has(status.toUpperCase());
};

export const PaymentReturnPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const sessionId = searchParams.get('sessionId') || searchParams.get('paymentSessionId') || searchParams.get('session_id') || '';
    const paymentType = searchParams.get('type') || 'enrollment';
    const rawStatusHint = searchParams.get('status') || '';

    const { data: session, isLoading, isError } = useQuery({
        queryKey: ['finance', 'payment-session', sessionId],
        queryFn: async () => {
            if (!sessionId) return null;
            const res = await financePaymentSessionApi.validateSession(sessionId);
            return res ?? null;
        },
        enabled: !!sessionId,
        retry: 1,
        refetchInterval: (query) => {
            const currentStatus = (query.state.data as any)?.status;
            if (currentStatus && !isSessionPaid(currentStatus) && currentStatus.toUpperCase() !== 'FAILED' && currentStatus.toUpperCase() !== 'CANCELLED') {
                return 2500;
            }
            return false;
        }
    });

    const determinedStatus = session?.status || rawStatusHint || 'UNKNOWN';
    const isVerified = isSessionPaid(determinedStatus);
    const isCancelledOrFailed = determinedStatus.toUpperCase() === 'FAILED' || determinedStatus.toUpperCase() === 'CANCELLED';

    // Invalidate stale caches immediately upon confirmed payment
    useEffect(() => {
        if (isVerified) {
            queryClient.invalidateQueries({ queryKey: ['finance'] });
            queryClient.invalidateQueries({ queryKey: ['admissions'] });
            queryClient.invalidateQueries({ queryKey: ['academic'] });
        }
    }, [isVerified, queryClient]);

    if (isLoading && sessionId) {
        return (
            <div className="fade-in" style={{ maxWidth: '640px', margin: 'var(--space-12) auto', textAlign: 'center' }}>
                <Card style={{ padding: 'var(--space-8)' }}>
                    <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto var(--space-4)' }} />
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Verifying Payment Status</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Communicating with the payment gateway to reconcile your transaction record...
                    </p>
                </Card>
            </div>
        );
    }

    if (isCancelledOrFailed || (isError && !isVerified)) {
        const retryPath = paymentType === 'application-fee' ? '/application-fee' : '/enrollment-payment';
        return (
            <div className="fade-in" style={{ maxWidth: '640px', margin: 'var(--space-12) auto', textAlign: 'center' }}>
                <Card style={{ padding: 'var(--space-8)', borderTop: '4px solid var(--danger-text)' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-4)' }}>⚠️</div>
                    <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--danger-text)' }}>Payment Incomplete or Cancelled</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                        We were unable to verify completion of this payment with the gateway. No funds were debited or the session was cancelled.
                    </p>
                    {sessionId && (
                        <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' }}>
                            Reference: {sessionId}
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                        <Button variant="primary" onClick={() => navigate(retryPath)}>
                            Return and Try Again
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (isVerified || rawStatusHint.toLowerCase() === 'success') {
        const isEnrollment = paymentType === 'enrollment';
        return (
            <div className="fade-in" style={{ maxWidth: '680px', margin: 'var(--space-8) auto' }}>
                <PageHeader 
                    title={isEnrollment ? "Enrollment Downpayment Verified" : "Application Fee Verified"} 
                    subtitle="Your transaction has been securely confirmed by the Payment Gateway and posted to the University ledger." 
                />
                <Card style={{ textAlign: 'center', padding: 'var(--space-8)', borderTop: '4px solid var(--success-text)' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-4)' }}>✅</div>
                    <Badge colorScheme="success" style={{ marginBottom: 'var(--space-3)' }}>
                        Payment Confirmed
                    </Badge>
                    <h2 style={{ marginBottom: 'var(--space-2)', fontSize: '1.5rem', fontWeight: 700 }}>
                        {isEnrollment ? "Enrollment Payment Successfully Settled" : "Application Fee Completed"}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto var(--space-6)' }}>
                        {isEnrollment 
                            ? "Your downpayment is recorded in the finance registry. The Registrar and Admissions divisions have been notified to finalize your official university enrollment and issue your student access credentials." 
                            : "Your application fee has been settled. Your applicant profile has been advanced into the academic evaluation and verification queue."}
                    </p>

                    {sessionId && (
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', margin: '0 auto var(--space-6)', maxWidth: '440px', textAlign: 'left' }}>
                            <div className="data-row" style={{ paddingTop: 0 }}>
                                <span className="data-label">Payment Gateway Session</span>
                                <span className="data-value" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' }}>{sessionId}</span>
                            </div>
                            <div className="data-row" style={{ borderBottom: 'none' }}>
                                <span className="data-label">Reconciliation Status</span>
                                <span className="data-value" style={{ color: 'var(--success-text)', fontWeight: 600 }}>Ledger Posted</span>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                        <Button 
                            variant="primary" 
                            size="large"
                            onClick={() => navigate(isEnrollment ? '/enrollment-payment' : '/status')}
                        >
                            {isEnrollment ? 'View Enrollment Status' : 'View Admission Status'}
                        </Button>
                        <Button 
                            variant="outline" 
                            size="large"
                            onClick={() => navigate('/dashboard')}
                        >
                            Return to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Default / Pending state if gateway redirect has not yet completed asynchronous reconciliation
    return (
        <div className="fade-in" style={{ maxWidth: '640px', margin: 'var(--space-12) auto', textAlign: 'center' }}>
            <Card style={{ padding: 'var(--space-8)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-4)' }}>⏳</div>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>Payment Processing</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                    Your transaction was submitted to the payment gateway and is currently awaiting ledger confirmation.
                </p>
                <Badge colorScheme="warning" style={{ marginBottom: 'var(--space-6)' }}>
                    Awaiting Webhook Confirmation
                </Badge>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                    <Button variant="primary" onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => navigate(paymentType === 'application-fee' ? '/application-fee' : '/enrollment-payment')}>
                        Check Status Again
                    </Button>
                </div>
            </Card>
        </div>
    );
};

