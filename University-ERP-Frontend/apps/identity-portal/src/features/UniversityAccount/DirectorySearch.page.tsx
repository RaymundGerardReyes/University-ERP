import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const DirectorySearchPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Global Directory Search</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Search the active directory for students, faculty, and staff.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <div style={{ padding: '2rem' }}>
                    <input 
                        type="text" 
                        placeholder="Search by Name, ID, or Email..." 
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-light)', background: 'var(--surface-base)', color: 'var(--text-primary)' }}
                    />
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>Directory ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Account Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>jwilson</td>
                            <td>James Wilson</td>
                            <td>Student</td>
                            <td><Badge variant="success">Active</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
