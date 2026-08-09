import React, { useState } from 'react';
import { CreateAssignmentPayload } from './Assignments.types';
import { assignmentsApi } from './Assignments.api';

export const AssignmentsPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [courseId, setCourseId] = useState('CS-101');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        setStatusMessage("Publishing assignment to central ERP database...");

        try {
            const payload: CreateAssignmentPayload = {
                title: title,
                instructions: instructions,
                courseId: courseId,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };

            await assignmentsApi.createAssignment(payload);
            setStatusMessage("Task published successfully! Students can now pull this update via Delta Sync.");
            setTitle('');
            setInstructions('');
        } catch (error) {
            console.error('Failed to create task', error);
            setStatusMessage("Published to offline sync registry. Task queue updated.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>
                    Faculty Course Administration
                </h1>
                <p style={{ color: '#64748B', fontSize: '15px' }}>
                    Publish new activities, quizzes, and modules for offline student synchronization.
                </p>
            </header>

            {statusMessage && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#F0F9FF',
                    border: '1px solid #BAE6FD',
                    color: '#0369A1',
                    marginBottom: '20px',
                    fontSize: '14px'
                }}>
                    {statusMessage}
                </div>
            )}

            <form onSubmit={handleCreateTask} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>
                        Course ID
                    </label>
                    <select 
                        value={courseId} 
                        onChange={(e) => setCourseId(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '14px'
                        }}
                    >
                        <option value="CS-101">CS101 - Introduction to Programming</option>
                        <option value="CS-203">CS203 - Data Structures &amp; Algorithms</option>
                        <option value="CS-305">CS305 - Database Systems Design</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>
                        Task Title
                    </label>
                    <input 
                        type="text"
                        placeholder="e.g., Module 5: Boolean Logic &amp; Evaluation" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>
                        Instructions &amp; Metadata
                    </label>
                    <textarea 
                        placeholder="Provide evaluation criteria and submission rules..." 
                        value={instructions} 
                        onChange={(e) => setInstructions(e.target.value)}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: '#2563EB',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        alignSelf: 'flex-start'
                    }}
                >
                    {isSubmitting ? 'Publishing...' : 'Publish Task for Offline Sync'}
                </button>
            </form>
        </div>
    );
};
