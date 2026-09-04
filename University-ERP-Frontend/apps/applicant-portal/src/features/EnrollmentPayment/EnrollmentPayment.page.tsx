import { useMutation, useQuery } from '@tanstack/react-query';
import { admissionsApi, financeApi, financeBillingApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import axios from 'axios';
import React, { useState } from 'react';

// Legacy mapping based on the actual Finance API return shape
interface ClientInvoiceDto {
    invoiceId: string;
    studentId: string;
    amountDue: number;
    description: string;
    dueDate: string;
    status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCELLED';
}

const isEnrollmentDownpaymentInvoice = (inv: ClientInvoiceDto, identityId: string) => {
    return inv.studentId === identityId && Boolean(inv.description?.includes('Downpayment'));
};

export const EnrollmentPaymentPage: React.FC = () => {
    const { identity } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const { data: journey, isLoading: isJourneyLoading } = useQuery({
        queryKey: ['admissions', 'journey', identity?.id],
        queryFn: () => admissionsApi.getApplicantJourney(identity!.id),
        enabled: !!identity?.id
    });

    const { data: appStatuses, isLoading: isStatusLoading } = useQuery({
        queryKey: ['academic', 'admissionStatus', identity?.id],
        queryFn: () => admissionsApi.getApplicationStatus(identity!.id),
        enabled: !!identity?.id
    });

    const { data: invoices, isLoading: isInvoiceLoading, isError: isInvoiceError } = useQuery({
        queryKey: ['finance', 'invoices', identity?.id],
        queryFn: async () => await financeApi.getInvoices() as ClientInvoiceDto[],
        enabled: !!identity?.id
    });

    // Authoritative Application and Invoice isolation
    const activeApp = appStatuses?.find(app => app.id === journey?.applicantId);
    const enrollmentInvoice = invoices?.find(inv => isEnrollmentDownpaymentInvoice(inv, identity!.id));

    const onlinePaymentMutation = useMutation({
        mutationFn: async () => {
            if (!enrollmentInvoice) throw new Error("No active invoice found.");
            return await financeApi.createPaymentSession({
                invoiceId: enrollmentInvoice.invoiceId,
                applicantId: identity!.id,
                amount: enrollmentInvoice.amountDue,
                purpose: enrollmentInvoice.description
            });
        },
        onSuccess: (data) => {
            if (data.checkoutUrl) window.location.href = data.checkoutUrl;
            else setActionError("Failed to retrieve checkout URL from the payment gateway.");
        },
        onError: (error: unknown) => {
            let msg = "Failed to establish secure payment session.";
            if (axios.isAxiosError(error)) msg = error.response?.data?.message || error.message;
            else if (error instanceof Error) msg = error.message;
            setActionError(msg);
        }
    });

    const generateTokenMutation = useMutation({
        mutationFn: async () => {
            if (!enrollmentInvoice) throw new Error("No active invoice found.");
            return await financeBillingApi.generateCashToken(enrollmentInvoice.invoiceId, enrollmentInvoice.amountDue);
        },
        onSuccess: (token) => { setGeneratedToken(token); setActionError(null); },
        onError: (error: unknown) => {
            let msg = "Failed to generate official cash token.";
            if (axios.isAxiosError(error)) msg = error.response?.data?.message || error.message;
            else if (error instanceof Error) msg = error.message;
            setActionError(msg);
        }
    });

    if (isInvoiceLoading || isStatusLoading || isJourneyLoading) {
        return <div className="skeleton" style={{ height: '400px' }} />;
    }

    if (isInvoiceError) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Finance Subsystem Unavailable</div>
                <div className="stub-subtitle">Failed to synchronize financial requirements from the server.</div>
            </div>
        );
    }

    // STATE A: Officially Enrolled (Terminal State derived purely from Admissions Status Read Model)
    if (activeApp?.status === 'Enrolled') {
        return (
            <div className="fade-in">
                <PageHeader title="Official Enrollment Complete" subtitle="Your university registration is finalized." />
                <Card style={{ textAlign: 'center', padding: 'var(--space-8)', borderTop: '4px solid var(--success-text)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎉</div>
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Welcome to the University</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>The Registrar has successfully activated your official enrollment.</p>
                    <Badge colorScheme="success" style={{ marginTop: 'var(--space-4)' }}>Officially Enrolled</Badge>
                </Card>
            </div>
        );
    }

    // STATE B: Payment Settled (Awaiting downstream Registrar action; no false clearance claims)
    if (enrollmentInvoice?.status === 'PAID') {
        return (
            <div className="fade-in">
                <PageHeader title="Enrollment Payment" subtitle="Clear your financial requirements to finalize your registration." />
                <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>💳</div>
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Payment Successfully Settled</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Your payment has been reconciled in the ledger. You are currently awaiting Final Financial Clearance and Registrar Activation.</p>
                    <Badge colorScheme="warning" style={{ marginTop: 'var(--space-4)' }}>Awaiting Official Enrollment</Badge>
                </Card>
            </div>
        );
    }

    // STATE C: Awaiting Finance Assessment (No Invoice Exists Yet)
    if (!enrollmentInvoice) {
        return (
            <div className="fade-in">
                <PageHeader title="Enrollment Payment" subtitle="Clear your financial requirements to finalize your registration." />
                <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', opacity: 0.5, filter: 'grayscale(1)' }}>⏳</div>
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Awaiting Finance Assessment</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Your academic profile is currently queued for official tuition assessment by the Finance Office.</p>
                    <Badge colorScheme="info" style={{ marginTop: 'var(--space-4)' }}>Processing Upstream</Badge>
                </Card>
            </div>
        );
    }

    // STATE D: Payable Invoice Available (UNPAID or PARTIAL)
    const isProcessing = onlinePaymentMutation.isPending || generateTokenMutation.isPending;

    return (
        <div className="fade-in">
            <PageHeader title="Enrollment Payment" subtitle="Clear your financial requirements to finalize your university registration." />
            
            {actionError && (
                <div style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', color: 'var(--danger-text)' }}>
                    <strong>System Error:</strong> {actionError}
                </div>
            )}

            <div className="grid-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <Card>
                        <div className="card-accent-top" />
                        <h3 style={{ marginBottom: 'var(--space-4)' }}>Assessment Details</h3>
                        <div className="data-row">
                            <span className="data-label">Invoice Reference</span>
                            <span className="data-value" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{enrollmentInvoice.invoiceId}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">Description</span>
                            <span className="data-value">{enrollmentInvoice.description}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">Due Date</span>
                            <span className="data-value" style={{ color: 'var(--warning-text)' }}>
                                {new Date(enrollmentInvoice.dueDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)' }}>
                            <div className="data-row" style={{ borderBottom: 'none' }}>
                                <span className="data-label" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Due</span>
                                <span className="data-value" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                                    ${enrollmentInvoice.amountDue.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
                <div>
                    <Card style={{ height: '100%' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)' }}>
                            <Button variant={paymentMethod === 'online' ? 'primary' : 'outline'} onClick={() => setPaymentMethod('online')} style={{ flex: 1 }}>Pay Online</Button>
                            <Button variant={paymentMethod === 'cash' ? 'primary' : 'outline'} onClick={() => setPaymentMethod('cash')} style={{ flex: 1 }}>Pay at Cashier</Button>
                        </div>

                        {paymentMethod === 'online' && (
                            <div className="fade-in">
                                <h4 style={{ marginBottom: 'var(--space-4)' }}>Online Payment Gateway</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>You will be securely redirected to the University Payment Gateway.</p>
                                <Button variant="primary" style={{ width: '100%', padding: 'var(--space-3)', justifyContent: 'center' }} onClick={() => { setActionError(null); onlinePaymentMutation.mutate(); }} disabled={isProcessing}>
                                    {onlinePaymentMutation.isPending ? 'Connecting...' : 'Proceed to Checkout'}
                                </Button>
                            </div>
                        )}

                        {paymentMethod === 'cash' && (
                            <div className="fade-in">
                                <h4 style={{ marginBottom: 'var(--space-4)' }}>Over-the-Counter Cash</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>Generate a secure token to present to the Cashier.</p>
                                
                                {generatedToken ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-6)', background: 'var(--bg-elevated)', border: '1px dashed var(--brand-primary)', borderRadius: 'var(--radius-md)' }}>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-2)' }}>Your Cashier Token</p>
                                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>{generatedToken}</div>
                                        <Badge colorScheme="warning" style={{ marginTop: 'var(--space-4)' }}>Awaiting Cashier Verification</Badge>
                                    </div>
                                ) : (
                                    <Button variant="primary" style={{ width: '100%', padding: 'var(--space-3)', justifyContent: 'center' }} onClick={() => { setActionError(null); generateTokenMutation.mutate(); }} disabled={isProcessing}>
                                        {generateTokenMutation.isPending ? 'Generating Target...' : 'Generate Official Cash Token'}
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