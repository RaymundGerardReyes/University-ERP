import { Badge, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { CourseOffering, useMyEnrollments } from './MyEnrollments.hooks';
import './MyEnrollments.styles.css';

// --- Level 3: Subject & Learning Management Component ---
const SubjectCard: React.FC<{ subject: CourseOffering }> = ({ subject }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'lms' | 'exams'>('lms');

  return (
    <div className="subject-card">
      <div className="subject-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="subject-info">
          <h4>{subject.code}: {subject.title}</h4>
          <div className="subject-meta">
            Section: <strong style={{ color: 'var(--text-primary)' }}>{subject.section}</strong> • {subject.credits} Credits • {subject.faculty}
          </div>
        </div>
        <Badge colorScheme="success">Enrolled</Badge>
      </div>

      {isExpanded && (
        <div className="subject-body">
          <div className="tabs-header">
            <button className={`tab-btn ${activeTab === 'lms' ? 'active' : ''}`} onClick={() => setActiveTab('lms')}>
              Learning Management
            </button>
            <button className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`} onClick={() => setActiveTab('exams')}>
              Examination
            </button>
          </div>

          {activeTab === 'lms' && (
            <div className="activities-grid">
              {subject.lmsData.map(act => (
                <div key={act.id} className="activity-card">
                  <span className="act-type">{act.type}</span>
                  <div className="act-title">{act.title}</div>
                  {act.score !== undefined ? (
                    <div className="act-score">{act.score} / {act.maxScore}</div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'auto' }}>Pending</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="activities-grid">
              {subject.examinations.map(exam => (
                <div key={exam.id} className="activity-card">
                  <span className="act-type">{exam.status}</span>
                  <div className="act-title">{exam.type} Examination</div>
                  {exam.score !== undefined ? (
                    <div className="act-score">{exam.score} / {exam.maxScore}</div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'auto' }}>Upcoming</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Level 2: Semester Accordion ---
const SemesterAccordion: React.FC<{ name: string; offerings: CourseOffering[]; isInitialOpen?: boolean }> = ({ name, offerings, isInitialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(isInitialOpen);

  return (
    <div className="semester-accordion">
      <div className="semester-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{name}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {offerings.length} Subjects Enrolled {isOpen ? '▲' : '▼'}
        </span>
      </div>
      {isOpen && (
        <div className="semester-body">
          {offerings.map(subject => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Level 1: Main Academic Hierarchy Page ---
export const MyEnrollmentsPage: React.FC = () => {
  const { data: program, isLoading, isError } = useMyEnrollments();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading enterprise curriculum data...</div>;
  if (isError || !program) return <div style={{ color: 'var(--danger-text)' }}>Failed to load curriculum.</div>;

  return (
    <div className="timeline-container">
      <PageHeader title="My Academic Timeline" subtitle="Enterprise Enrollment Hierarchy" />
      
      <div className="timeline-header-card">
        <h2>{program.programName}</h2>
        <p>Curriculum Version: {program.curriculumVersion}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {program.academicYears.map((ay, index) => (
          <div key={ay.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
              {ay.yearName} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>• {ay.level}</span>
            </h3>
            
            {ay.semesters.map((sem, sIdx) => (
              <SemesterAccordion 
                key={sem.id} 
                name={sem.name} 
                offerings={sem.offerings} 
                isInitialOpen={index === 0 && sIdx === 0} // Open the very first semester by default
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};