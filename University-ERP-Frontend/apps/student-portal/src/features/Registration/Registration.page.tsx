import { PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { BrowseCoursesPage } from './BrowseCourses.page';
import { MyRegistrationPage } from './MyRegistration.page';
import { WaitlistPage } from './Waitlist.page';

export const RegistrationPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('my-registration');

    const tabs = [
        { id: 'my-registration', label: 'My Registration' },
        { id: 'browse-courses', label: 'Browse Courses' },
        { id: 'waitlists', label: 'Waitlists' }
    ];

    return (
        <div className="fade-in">
            <PageHeader
                title="Registration Workspace"
                subtitle="Manage your course enrollment, browse the catalog, and monitor waitlists for the upcoming term."
            />

            <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-3)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            background: activeTab === tab.id ? 'var(--brand-primary)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                            border: '1px solid',
                            borderColor: activeTab === tab.id ? 'var(--brand-primary)' : 'var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
                {activeTab === 'my-registration' && <MyRegistrationPage />}
                {activeTab === 'browse-courses' && <BrowseCoursesPage />}
                {activeTab === 'waitlists' && <WaitlistPage />}
            </div>
        </div>
    );
};
