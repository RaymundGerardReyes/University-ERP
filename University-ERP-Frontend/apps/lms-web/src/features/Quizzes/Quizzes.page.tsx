import React from 'react';
import { Card, Table, Badge, Button, PageHeader } from '@university-erp/ui-kit';
import { useQuizzes } from './Quizzes.hooks';

export const QuizzesPage: React.FC = () => {
  const { data: quizzes, isLoading } = useQuizzes('CS-101');

  const defaultQuizzes = [
    { id: 'QZ-01', title: 'Quiz 1: Logic Gates & Truth Tables', timeLimitMinutes: 30, totalQuestions: 15, status: 'Available' as const },
    { id: 'QZ-02', title: 'Quiz 2: Arrays & Memory Pointers', timeLimitMinutes: 45, totalQuestions: 20, status: 'Locked' as const }
  ];

  const quizList = (quizzes && quizzes.length > 0) ? quizzes : defaultQuizzes;

  return (
    <div className="fade-in" style={{ padding: '1rem' }}>
      <PageHeader
        title="Course Quizzes & Assessments"
        subtitle="Complete timed quizzes with local integrity protection."
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '300px' }} />
      ) : (
        <Card style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-light)' }}>
          <Table>
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Time Limit</th>
                <th>Questions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {quizList.map((q: any) => (
                <tr key={q.id}>
                  <td style={{ fontWeight: 600 }}>{q.title}</td>
                  <td>{q.timeLimitMinutes} mins</td>
                  <td>{q.totalQuestions} items</td>
                  <td>
                    <Badge variant={q.status === 'Available' ? 'success' : 'default'}>
                      {q.status}
                    </Badge>
                  </td>
                  <td>
                    <Button size="small" variant="primary" disabled={q.status === 'Locked'}>
                      {q.status === 'Available' ? 'Start Quiz' : 'Locked'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default QuizzesPage;
