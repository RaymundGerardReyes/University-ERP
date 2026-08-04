import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useApplicantJourney } from '../ApplicantJourney.hooks';
import { Link } from 'react-router-dom';

export const ProgramExplorerPage: React.FC = () => {
  const { data, isLoading } = useApplicantJourney();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  if (isLoading) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ height: '80px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          <div style={{ height: '300px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
          <div style={{ height: '300px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
          <div style={{ height: '300px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
        </div>
      </div>
    );
  }
  if (!data) return null;

  const filters = ['All', ...Array.from(new Set(data.programs.map(p => p.college)))];
  
  const filteredPrograms = data.programs.filter(prog => {
    const matchesSearch = prog.major.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prog.degree.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || prog.college === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <PageHeader 
        title="Program Explorer" 
        subtitle="Discover your future degree path and explore our world-class programs." 
      />
      
      {/* Search & Filter Bar */}
      <Card style={{ padding: 'var(--space-4)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '14px', fontSize: '1.2rem', color: 'var(--text-muted)' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search programs, majors, degrees..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px',
              border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.3)',
              color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.2s'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                border: filter === selectedFilter ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                background: filter === selectedFilter ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: filter === selectedFilter ? 'var(--brand-primary)' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              className="hover-bg-subtle"
            >
              {filter}
            </button>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {filteredPrograms.length > 0 ? filteredPrograms.map((prog, idx) => (
          <Card 
            key={prog.id} 
            style={{ 
              display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
              animation: `fadeInUp 0.4s ease forwards ${idx * 0.1}s`, opacity: 0, transform: 'translateY(10px)',
              borderTop: '3px solid var(--border-color)',
              transition: 'all 0.3s ease'
            }}
            className="hover-lift"
          >
            {/* Dynamic Accent Bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {prog.college}
              </div>
              <div style={{ fontSize: '1.5rem' }}>🎓</div>
            </div>
            
            <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-primary)', fontSize: '1.3rem' }}>
              <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>{prog.degree} in </span><br/>
              {prog.major}
            </h3>
            
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', margin: 'var(--space-3) 0 var(--space-5) 0' }}>
              {prog.tags.map(tag => (
                <Badge key={tag} colorScheme="info" style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                  {tag}
                </Badge>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'auto', marginBottom: 'var(--space-6)', background: 'rgba(0,0,0,0.1)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>⏱️ Duration:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{prog.duration}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>📅 Intake:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{prog.intake}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>💰 Est. Tuition:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{prog.tuitionEstimate}</strong>
              </div>
            </div>

            <Link to="/apply" style={{ textDecoration: 'none' }}>
              <Button variant="outline" style={{ width: '100%' }}>Apply for this Program →</Button>
            </Link>
          </Card>
        )) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔍</div>
            <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-primary)' }}>No programs found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
