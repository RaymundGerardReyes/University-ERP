import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const DiplomaVerificationPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Diploma Verification</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Verify digital and physical diplomas against the academic blockchain ledger.</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input type="text" placeholder="Enter Diploma Serial No..." style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }} />
                <Button variant="primary">Verify Authenticity</Button>
            </div>

            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Serial No</th>
                            <th>Graduate Name</th>
                            <th>Degree Program</th>
                            <th>Date Issued</th>
                            <th>Authenticity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>DIP-2025-10294</td>
                            <td>Alexander Graham</td>
                            <td>BS Telecommunications</td>
                            <td>May 15, 2025</td>
                            <td><Badge variant="success">Verified Authentic</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
