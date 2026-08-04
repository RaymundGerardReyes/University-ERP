import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const ReportsPage: React.FC = () => {
    const reportCategories = [
        { title: 'Admissions & Enrollment', desc: 'Conversion rates, demographic breakdowns, and enrollment trends.', icon: '📊' },
        { title: 'Academic Performance', desc: 'University-wide GPA distributions and at-risk student metrics.', icon: '🎓' },
        { title: 'Financial Summaries', desc: 'Tuition collection, outstanding balances, and department budgets.', icon: '💰' },
        { title: 'Faculty & HR', desc: 'Teaching loads, faculty evaluations, and staffing reports.', icon: '👥' },
    ];

    return (
        <div className="fade-in">
            <PageHeader title="Institutional Reports" subtitle="Generate and export global university analytics." />

            <div className="grid-auto fade-in-delay-1">
                {reportCategories.map((report, idx) => (
                    <Card key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{report.icon}</div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{report.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{report.desc}</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button variant="primary" style={{ flex: 1 }}>Generate</Button>
                            <Button variant="outline" style={{ flex: 1 }}>Schedule</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};