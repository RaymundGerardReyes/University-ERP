import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplicantJourney } from '../ApplicantJourney.hooks';

export const ProgramExplorerPage: React.FC = () => {
  const { data, isLoading } = useApplicantJourney();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  if (isLoading) return <div className="skeleton fade-in" style={{ height: '600px' }} />;
  if (!data) return null;

  const filters = ['All', ...Array.from(new Set(data.programs.map(p => p.college)))];
  const filteredPrograms = data.programs.filter(prog => {
    const matchesSearch = prog.major.toLowerCase().includes(searchTerm.toLowerCase()) || prog.degree.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || prog.college === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fade-in">
      <PageHeader title="Program Explorer" subtitle="Discover your future degree path and explore our world-class programs." />

      <Card style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', padding: 'var(--space-3)' }} className="fade-in-delay-1">
        <input
          type="text" placeholder="Search programs, majors, degrees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: '1 1 250px', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: '4px' }}>
          {filters.map(filter => (
            <button key={filter} onClick={() => setSelectedFilter(filter)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, border: filter === selectedFilter ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)', background: filter === selectedFilter ? 'var(--info-bg)' : 'transparent', color: filter === selectedFilter ? 'var(--text-accent)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {filter}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid-auto fade-in-delay-2">
        {filteredPrograms.length > 0 ? filteredPrograms.map((prog, idx) => (
          <Card key={prog.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-accent-top" />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-2)' }}>{prog.college}</div>
            <h3 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-primary)', fontSize: '1.3rem', lineHeight: 1.3 }}>
              <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>{prog.degree} in </span><br />{prog.major}
            </h3>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
              {prog.tags.map(tag => <Badge key={tag} colorScheme="info">{tag}</Badge>)}
            </div>

            <div style={{ marginTop: 'auto', background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
              <div className="data-row"><span className="data-label">Duration</span><span className="data-value">{prog.duration}</span></div>
              <div className="data-row"><span className="data-label">Intake</span><span className="data-value">{prog.intake}</span></div>
              <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0 }}><span className="data-label">Est. Tuition</span><span className="data-value">{prog.tuitionEstimate}</span></div>
            </div>

            <Link to="/apply" style={{ textDecoration: 'none' }}>
              <Button variant="outline" style={{ width: '100%' }}>Apply for this Program</Button>
            </Link>
          </Card>
        )) : (
          <div className="stub-page" style={{ gridColumn: '1 / -1' }}>
            <div className="stub-title">No programs found</div>
            <div className="stub-subtitle">Try adjusting your search or filter.</div>
          </div>
        )}
      </div>
    </div>
  );
};