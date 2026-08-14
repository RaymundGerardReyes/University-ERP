import React, { useState } from 'react';
import { Card, Badge, Button, PageHeader } from '@university-erp/ui-kit';

export const DiplomaVerificationPage: React.FC = () => {
    const [serialNumber, setSerialNumber] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [verifiedDiploma, setVerifiedDiploma] = useState<any | null>(null);

    const handleVerify = () => {
        if (!serialNumber) return;
        setIsSearching(true);
        setVerifiedDiploma(null);
        
        // Simulate a blockchain/database ledger lookup
        setTimeout(() => {
            if (serialNumber.toUpperCase() === 'DIP-2025-10294') {
                setVerifiedDiploma({
                    serial: 'DIP-2025-10294',
                    name: 'Alexander Graham',
                    program: 'BS Telecommunications',
                    issueDate: 'May 15, 2025',
                    hash: '0x8f2a9c3b...4e1d',
                    status: 'Verified Authentic'
                });
            } else {
                setVerifiedDiploma({ status: 'Not Found' });
            }
            setIsSearching(false);
        }, 1200);
    };

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <PageHeader 
                title="Diploma Verification Terminal" 
                subtitle="Cryptographically verify digital and physical diplomas against the academic ledger." 
            />

            <Card style={{ marginBottom: 'var(--space-6)', borderTop: '4px solid var(--brand-primary)' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Enter Diploma Serial Number or Reference Hash
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="e.g., DIP-2025-10294" 
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                        style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-bright, var(--text-primary))', fontFamily: 'monospace' }} 
                    />
                    <Button variant="primary" onClick={handleVerify} disabled={isSearching || !serialNumber}>
                        {isSearching ? 'Querying Ledger...' : 'Verify Authenticity'}
                    </Button>
                </div>
            </Card>

            {verifiedDiploma && verifiedDiploma.status === 'Verified Authentic' && (
                <Card className="fade-in" style={{ background: 'var(--success-bg, rgba(16,185,129,0.1))', border: '1px solid var(--success-border, var(--border-color))', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.1 }}>🎓</div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--success-text, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem' }}>✓</div>
                        <div>
                            <h2 style={{ margin: 0, color: 'var(--success-text, #10b981)' }}>Verified Authentic</h2>
                            <div style={{ color: 'var(--text-secondary)' }}>Ledger match confirmed for serial: <span style={{ fontFamily: 'monospace' }}>{verifiedDiploma.serial}</span></div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Graduate Name</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{verifiedDiploma.name}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Degree Conferred</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{verifiedDiploma.program}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date Issued</div>
                                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{verifiedDiploma.issueDate}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cryptographic Hash</div>
                                <div style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{verifiedDiploma.hash}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <Button variant="outline">Download Verification Certificate (PDF)</Button>
                    </div>
                </Card>
            )}

            {verifiedDiploma && verifiedDiploma.status === 'Not Found' && (
                <Card className="fade-in" style={{ background: 'var(--danger-bg, rgba(239,68,68,0.1))', border: '1px solid var(--danger-border, var(--border-color))', textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--danger-text, #ef4444)' }}>Record Not Found</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>The serial number <strong>{serialNumber}</strong> does not match any official university records.</p>
                </Card>
            )}
        </div>
    );
};
