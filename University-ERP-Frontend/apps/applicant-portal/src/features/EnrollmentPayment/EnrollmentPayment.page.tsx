import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi, financeApi, financeBillingApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import axios from 'axios';
import React, { useState } from 'react';

// Flexible mapping based on the actual Finance API return shape
interface ClientInvoiceDto {
    id?: string;
    invoiceId?: string;
    studentId?: string;
    applicantId?: string;
    amount?: number;
    amountDue?: number;
    totalAmount?: number;
    paidAmount?: number;
    description?: string;
    dueDate?: string;
    issuedOnUtc?: string;
    status?: string;
}

const getInvoiceId = (inv: ClientInvoiceDto) => inv.id || inv.invoiceId || '';
const getInvoiceAmount = (inv: ClientInvoiceDto) => inv.amount ?? inv.amountDue ?? inv.totalAmount ?? 0;
const PAID_INVOICE_STATUSES = new Set(['PAID', 'COMPLETED', 'SETTLED', 'VERIFIED', 'PAYMENT_VERIFIED']);
export const isInvoicePaid = (inv: ClientInvoiceDto) => PAID_INVOICE_STATUSES.has((inv.status || '').toUpperCase());

const isEnrollmentDownpaymentInvoice = (inv: ClientInvoiceDto, identityId: string) => {
    const ownerId = inv.studentId || inv.applicantId;
    const isOwner = !ownerId || ownerId === identityId;
    const desc = (inv.description || '').toLowerCase();
    const isDownpayment = desc.includes('downpayment') || desc.includes('enrollment') || desc.includes('admission') || desc.includes('tuition');
    return isOwner && isDownpayment;
};

export const resolveCheckoutRedirectUrl = (url?: string): string | null => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    const gatewayBase = (import.meta as any).env?.VITE_PAYMENT_GATEWAY_URL;
    if (gatewayBase && (gatewayBase.startsWith('http://') || gatewayBase.startsWith('https://'))) {
        return `${gatewayBase.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
    }
    return null;
};

export const EnrollmentPaymentPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { identity, user } = useAuth();
    const effectiveId = identity?.id || user?.id || 'usr-default';
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const { data: journey, isLoading: isJourneyLoading } = useQuery({
        queryKey: ['admissions', 'journey', effectiveId],
        queryFn: () => admissionsApi.getApplicantJourney(effectiveId),
        enabled: !!effectiveId
    });

    const { data: appStatuses, isLoading: isStatusLoading } = useQuery({
        queryKey: ['academic', 'admissionStatus', effectiveId],
        queryFn: () => admissionsApi.getApplicationStatus(effectiveId),
        enabled: !!effectiveId
    });

    const { data: invoices, isLoading: isInvoiceLoading, isError: isInvoiceError } = useQuery({
        queryKey: ['finance', 'invoices', effectiveId],
        queryFn: async () => await financeApi.getInvoices() as ClientInvoiceDto[],
        enabled: !!effectiveId
    });

    // Authoritative Application and Invoice isolation
    const activeApp = appStatuses?.find(app => app.id === journey?.applicantId || app.id === effectiveId);
    const enrollmentInvoice = invoices?.find(inv => isEnrollmentDownpaymentInvoice(inv, effectiveId));

    const invoiceId = enrollmentInvoice ? getInvoiceId(enrollmentInvoice) : '';
    const invoiceAmount = enrollmentInvoice ? getInvoiceAmount(enrollmentInvoice) : 0;
    const invoicePaid = enrollmentInvoice ? isInvoicePaid(enrollmentInvoice) : false;

    const onlinePaymentMutation = useMutation({
        mutationFn: async () => {
            if (!enrollmentInvoice) throw new Error("No active invoice found.");
            const returnUrl = `${window.location.origin}/payment-return?type=enrollment&invoiceId=${encodeURIComponent(invoiceId)}`;
            return await financeApi.createPaymentSession({
                invoiceId,
                applicantId: effectiveId,
                amount: invoiceAmount,
                purpose: enrollmentInvoice.description || 'Enrollment Downpayment',
                returnUrl
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['finance'] });
            queryClient.invalidateQueries({ queryKey: ['admissions'] });
            queryClient.invalidateQueries({ queryKey: ['academic'] });
            if (data.checkoutUrl) {
                const targetUrl = resolveCheckoutRedirectUrl(data.checkoutUrl);
                if (targetUrl) {
                    window.location.href = targetUrl;
                } else {
                    setActionError("Received an invalid checkout URL from payment gateway.");
                }
            } else {
                setActionError("Failed to retrieve checkout URL from the payment gateway.");
            }
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
            return await financeBillingApi.generateCashToken(invoiceId, invoiceAmount);
        },
        onSuccess: (token) => {
            queryClient.invalidateQueries({ queryKey: ['finance'] });
            queryClient.invalidateQueries({ queryKey: ['admissions'] });
            queryClient.invalidateQueries({ queryKey: ['academic'] });
            setGeneratedToken(token); 
            setActionError(null); 
        },
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
        const studentNumber = (activeApp as any)?.studentNumber || journey?.applicantId || effectiveId;
        const studentPortalUrl = (import.meta as any).env?.VITE_STUDENT_PORTAL_URL || '/student-portal';
        return (
            <div className="fade-in">
                <PageHeader title="Official Enrollment Complete" subtitle="Your university registration is finalized." />
                <Card style={{ textAlign: 'center', padding: 'var(--space-8)', borderTop: '4px solid var(--success-text)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎉</div>
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Welcome to the University</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>The Registrar has successfully activated your official enrollment.</p>
                    <div style={{ margin: 'var(--space-4) auto', maxWidth: '360px', background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Official University ID</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: "'JetBrains Mono', monospace", marginTop: 'var(--space-1)' }}>
                            {studentNumber}
                        </div>
                    </div>
                    <Badge colorScheme="success" style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>Officially Enrolled</Badge>
                    <div>
                        <Button
                            variant="primary"
                            size="large"
                            onClick={() => { window.location.href = studentPortalUrl; }}
                        >
                            Proceed to Student Portal →
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // STATE B: Payment Settled (Awaiting downstream Registrar action)
    if (invoicePaid) {
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
    const formattedDueDate = enrollmentInvoice.dueDate || enrollmentInvoice.issuedOnUtc 
        ? new Date(enrollmentInvoice.dueDate || enrollmentInvoice.issuedOnUtc!).toLocaleDateString()
        : 'Upon Enrollment';

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
                            <span className="data-value" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{invoiceId}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">Description</span>
                            <span className="data-value">{enrollmentInvoice.description || 'Enrollment Assessment Downpayment'}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">Due Date</span>
                            <span className="data-value" style={{ color: 'var(--warning-text)' }}>
                                {formattedDueDate}
                            </span>
                        </div>
                        <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)' }}>
                            <div className="data-row" style={{ borderBottom: 'none' }}>
                                <span className="data-label" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Due</span>
                                <span className="data-value" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                                    ${invoiceAmount.toFixed(2)}
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