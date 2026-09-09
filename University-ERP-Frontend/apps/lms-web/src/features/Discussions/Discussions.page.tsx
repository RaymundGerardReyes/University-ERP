import React from 'react';
import { PageHeader, Card, Button } from '@university-erp/ui-kit';
import { useDiscussions } from './Discussions.hooks';

export const DiscussionsPage: React.FC = () => {
  const { data: discussions, isLoading } = useDiscussions('CS-101');

  return (
    <div className="fade-in">
      <PageHeader 
        title="Course Discussion Forum" 
        subtitle="Engage in academic discussions with instructors and peer students." 
        action={<Button variant="primary">+ Start New Thread</Button>}
      />
      {isLoading ? (
        <div className="skeleton" style={{ height: '300px' }} />
      ) : (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Recursion vs Iteration in Graph Traversal</h4>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>
                Can someone explain stack depth overhead when using DFS on large graphs?
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted by Alice Chen · 4 replies</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DiscussionsPage;
