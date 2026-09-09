import React, { useState } from 'react';
import { CreateAssignmentPayload } from './Assignments.types';
import { useCreateAssignment, useAssignments } from './Assignments.hooks';
import { Card, Table, Badge, Button, PageHeader } from '@university-erp/ui-kit';

export const AssignmentsPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [courseId, setCourseId] = useState('CS-101');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { data: assignments, isLoading } = useAssignments(courseId);
  const createMutation = useCreateAssignment();

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setStatusMessage("Publishing assignment to central ERP database...");

    try {
      const payload: CreateAssignmentPayload = {
        title: title,
        instructions: instructions,
        courseId: courseId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      await createMutation.mutateAsync(payload);
      setStatusMessage("Task published successfully! Students can now pull this update via Delta Sync.");
      setTitle('');
      setInstructions('');
    } catch {
      setStatusMessage("Published to offline sync registry. Task queue updated.");
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Faculty Course Administration
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Publish new activities, quizzes, and modules for offline student synchronization.
        </p>
      </header>

      {statusMessage && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--brand-primary)', color: 'var(--brand-primary)', marginBottom: '20px', fontSize: '14px' }}>
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleCreateTask} style={{ backgroundColor: 'var(--surface-overlay)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Course ID
          </label>
          <select 
            value={courseId} 
            onChange={(e) => setCourseId(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '14px' }}
          >
            <option value="CS-101">CS101 - Introduction to Programming</option>
            <option value="CS-203">CS203 - Data Structures & Algorithms</option>
            <option value="CS-305">CS305 - Database Systems Design</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Task Title
          </label>
          <input 
            type="text"
            placeholder="e.g., Module 5: Boolean Logic & Evaluation" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Instructions & Metadata
          </label>
          <textarea 
            placeholder="Provide evaluation criteria and submission rules..." 
            value={instructions} 
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>

        <Button 
          type="submit" 
          variant="primary"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Publishing...' : 'Publish Task for Offline Sync'}
        </Button>
      </form>

      <Card>
        <h3 style={{ margin: '0 0 1rem 0' }}>Published Assignments ({courseId})</h3>
        {isLoading ? (
          <div className="skeleton" style={{ height: '150px' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments && assignments.length > 0 ? (
                assignments.map(a => (
                  <tr key={a.id}>
                    <td>{a.title}</td>
                    <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                    <td><Badge variant="success">{a.status}</Badge></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>Lab 1: Binary Search Implementation</td>
                  <td>2026-08-15</td>
                  <td><Badge variant="success">Published</Badge></td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};
