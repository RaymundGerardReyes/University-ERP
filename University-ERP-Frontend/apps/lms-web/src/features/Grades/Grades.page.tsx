import React from 'react';
import { PageHeader, Card, Table, Badge } from '@university-erp/ui-kit';
import { useGrades } from './Grades.hooks';

export const GradesPage: React.FC = () => {
  const { data: grades, isLoading } = useGrades();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Student Grades & Academic Standing" 
        subtitle="Review assignment scores, midterm marks, and overall course evaluations." 
      />
      {isLoading ? (
        <div className="skeleton" style={{ height: '300px' }} />
      ) : (
        <Card>
          <Table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Assessment</th>
                <th>Score</th>
                <th>Letter Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CS101</td>
                <td>Lab 1: Binary Search</td>
                <td>95 / 100</td>
                <td><Badge variant="success">A</Badge></td>
              </tr>
              <tr>
                <td>CS101</td>
                <td>Midterm Examination</td>
                <td>88 / 100</td>
                <td><Badge variant="success">B+</Badge></td>
              </tr>
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default GradesPage;
