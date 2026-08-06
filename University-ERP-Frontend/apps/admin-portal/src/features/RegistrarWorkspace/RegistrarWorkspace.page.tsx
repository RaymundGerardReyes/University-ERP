import { PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { GraduationClearanceView } from './components/GraduationClearanceView';
import { TranscriptRequestsView } from './components/TranscriptRequestsView';

export const RegistrarWorkspacePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'clearance' | 'transcripts' | 'curriculum'>('clearance');

    return (
        <div className="fade-in">
            <PageHeader
                title="Registrar Workspace"
                subtitle="Manage graduation clearances, official transcripts, and academic curriculum."
            />
            
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
                <button 
                    onClick={() => setActiveTab('clearance')}
                    style={{ 
                        background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                        color: activeTab === 'clearance' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'clearance' ? '2px solid var(--brand-primary)' : '2px solid transparent',
                        paddingBottom: 'var(--space-2)'
                    }}
                >
                    Graduation Clearance
                </button>
                <button 
                    onClick={() => setActiveTab('transcripts')}
                    style={{ 
                        background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                        color: activeTab === 'transcripts' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'transcripts' ? '2px solid var(--brand-primary)' : '2px solid transparent',
                        paddingBottom: 'var(--space-2)'
                    }}
                >
                    Transcript Requests
                </button>
            </div>

            {activeTab === 'clearance' && <GraduationClearanceView />}
            {activeTab === 'transcripts' && <TranscriptRequestsView />}
            
        </div>
    );
};
