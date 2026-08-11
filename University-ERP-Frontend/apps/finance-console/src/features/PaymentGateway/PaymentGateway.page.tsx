import { Badge, Button, Card, FormInput } from '@university-erp/ui-kit';
import React, { useState } from 'react';

// ---------------------------------------------------------
// PREVIOUS IMPLEMENTATION (Conceptual)
// ---------------------------------------------------------
// The old code likely used hardcoded styles like:
// <div style={{ backgroundColor: '#1A2035', padding: '20px' }}>
//   <button style={{ backgroundColor: '#2563EB' }}>Pay</button>
// </div>

// ---------------------------------------------------------
// NEW UPDATED IMPLEMENTATION
// ---------------------------------------------------------
export const PaymentGatewayPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'card' | 'bank' | 'ewallet'>('card');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API call to the Finance Backend
        setTimeout(() => {
            setIsProcessing(false);
            alert('Payment successfully processed!');
        }, 2000);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh'
        }}>

            {/* Header Section */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '500px',
                marginBottom: 'var(--space-6)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--brand-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                    }}>
                        🏛️
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-bright)' }}>University ERP</h1>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secure Decoupled Payment Gateway</p>
                    </div>
                </div>
                <Badge colorScheme="success" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    🔒 256-Bit Encrypted
                </Badge>
            </div>

            {/* Main Payment Card */}
            <Card style={{ width: '100%', maxWidth: '500px', padding: 'var(--space-8)' }}>

                {/* Amount Display */}
                <div style={{
                    background: 'var(--bg-elevated)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: 'var(--space-6)'
                }}>
                    <p style={{ margin: '0 0 var(--space-2) 0', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Application Processing Fee
                    </p>
                    <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-bright)', letterSpacing: '-0.02em' }}>
                        PHP 50.00
                    </h2>
                    <p style={{ margin: 'var(--space-4) 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Invoice: APP-FEE-b030ff09-7be5-413f-b35d-6a86d9d14bb6
                    </p>
                </div>

                {/* Payment Method Tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                    <Button
                        variant={activeTab === 'card' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('card')}
                        style={{ padding: 'var(--space-3)', fontSize: '0.85rem' }}
                    >
                        💳 Card
                    </Button>
                    <Button
                        variant={activeTab === 'bank' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('bank')}
                        style={{ padding: 'var(--space-3)', fontSize: '0.85rem' }}
                    >
                        🏦 Online Bank
                    </Button>
                    <Button
                        variant={activeTab === 'ewallet' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('ewallet')}
                        style={{ padding: 'var(--space-3)', fontSize: '0.85rem' }}
                    >
                        📱 e-Wallet
                    </Button>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePayment}>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Card Number
                        </label>
                        <FormInput
                            type="text"
                            placeholder="4532 •••• •••• 8892"
                            required
                            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Expiry Date
                            </label>
                            <FormInput
                                type="text"
                                placeholder="MM/YY"
                                required
                                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                CVC / CVV
                            </label>
                            <FormInput
                                type="text"
                                placeholder="•••"
                                required
                                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isProcessing}
                        style={{ width: '100%', padding: 'var(--space-4)', fontSize: '1rem' }}
                    >
                        {isProcessing ? 'Processing Securely...' : 'Pay PHP 50.00 Now'}
                    </Button>
                </form>

            </Card>
        </div>
    );
};