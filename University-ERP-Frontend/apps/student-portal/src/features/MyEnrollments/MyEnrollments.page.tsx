import { Badge, Button, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useMyEnrollments } from './MyEnrollments.hooks';

export interface CourseOffering {
  id: string;
  code: string;
  title: string;
  section: string;
  credits: number;
  faculty: string;
  lmsData: any[];
  examinations: any[];
}

const SubjectCard: React.FC<{ subject: CourseOffering; delayIndex: number }> = ({ subject, delayIndex }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'lms' | 'exams'>('lms');

  return (
    <div className={`card fade-in-delay-${(delayIndex % 3) + 1}`} style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? 'var(--bg-hover)' : 'transparent', transition: 'background 0.2s' }}
      >
        <div>
          <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--brand-primary)', marginRight: 'var(--space-2)' }}>{subject.code}</span>
            {subject.title}
          </h4>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Section: <strong style={{ color: 'var(--text-primary)' }}>{subject.section}</strong> &bull; {subject.credits} Credits &bull; {subject.faculty}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Badge colorScheme="success">Enrolled</Badge>
          <span style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 'var(--space-4)', background: 'var(--bg-elevated)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
            <Button variant={activeTab === 'lms' ? 'primary' : 'outline'} onClick={() => setActiveTab('lms')} style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.8rem' }}>Learning Management</Button>
            <Button variant={activeTab === 'exams' ? 'primary' : 'outline'} onClick={() => setActiveTab('exams')} style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.8rem' }}>Examinations</Button>
          </div>

          <div className="grid-auto">
            {(activeTab === 'lms' ? subject.lmsData : subject.examinations).map((item: any, idx: number) => (
              <div key={item.id || idx} style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                  <span>{item.type || item.status}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>{item.title || `${item.type} Examination`}</div>
                <div style={{ marginTop: 'auto', fontSize: '1.2rem', fontWeight: 700, color: item.score ? 'var(--success-text)' : 'var(--text-muted)' }}>
                  {item.score !== undefined ? `${item.score} / ${item.maxScore}` : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const MyEnrollmentsPage: React.FC = () => {
  const { data: program, isLoading, isError } = useMyEnrollments();

  if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
  if (isError || !program) return <div className="stub-page fade-in"><div className="stub-icon">⚠️</div><div className="stub-title">Failed to load curriculum</div></div>;

  return (
    <div className="fade-in">
      <PageHeader title="My Enrollments" subtitle="Your academic timeline and course materials." />

      <div className="card fade-in-delay-1" style={{ marginBottom: 'var(--space-6)', background: 'var(--brand-gradient-soft)', borderColor: 'var(--brand-primary)' }}>
        <h2 style={{ margin: '0 0 var(--space-1) 0', fontSize: '1.4rem' }}>{program.programName}</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Curriculum Version: <strong style={{ color: 'var(--text-primary)' }}>{program.curriculumVersion}</strong></p>
      </div>

      {program.academicYears.map((ay: any, index: number) => (
        <div key={ay.id} style={{ marginBottom: 'var(--space-8)' }} className={`fade-in-delay-${(index % 3) + 1}`}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            {ay.yearName} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 400 }}>&bull; {ay.level}</span>
          </h3>

          {ay.semesters.map((sem: any) => (
            <div key={sem.id} style={{ marginBottom: 'var(--space-4)' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sem.name}</h4>
              {sem.offerings.map((subject: any, sIdx: number) => (
                <SubjectCard key={subject.id} subject={subject} delayIndex={sIdx} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};