import React, { useState } from 'react';
import { PageHeader } from '@university-erp/ui-kit';
import './AcademicTranscript.styles.css';

// --- MOCK DATA ---
// This simulates the complex nested payload we will eventually get from the C# backend.
const MOCK_TRANSCRIPT = {
  cumulativeGpa: 3.84,
  totalCredits: 96,
  years: [
    {
      year: '1st Year',
      gpa: 3.75,
      semesters: [
        {
          name: 'Semester 1',
          gpa: 3.8,
          subjects: [
            { id: 'cs101', name: 'Intro to Computer Science', credits: 4, grade: 'A', score: 94, activities: [
              { name: 'Midterm Exam', score: '92%' },
              { name: 'Final Exam', score: '96%' },
              { name: 'Assignments', score: '95%' }
            ]},
            { id: 'mt101', name: 'Calculus I', credits: 4, grade: 'B+', score: 87, activities: [
              { name: 'Midterm Exam', score: '82%' },
              { name: 'Final Exam', score: '90%' },
              { name: 'Quizzes', score: '88%' }
            ]}
          ]
        },
        {
          name: 'Semester 2',
          gpa: 3.7,
          subjects: [
            { id: 'cs102', name: 'Data Structures', credits: 4, grade: 'A-', score: 91, activities: [
              { name: 'Midterm Exam', score: '89%' },
              { name: 'Final Exam', score: '92%' },
              { name: 'Project', score: '95%' }
            ]}
          ]
        }
      ]
    },
    {
      year: '2nd Year',
      gpa: 3.92,
      semesters: [
        {
          name: 'Semester 1',
          gpa: 3.95,
          subjects: [
            { id: 'cs201', name: 'Algorithms', credits: 4, grade: 'A', score: 97, activities: [
              { name: 'Midterm Exam', score: '98%' },
              { name: 'Final Exam', score: '95%' },
              { name: 'Coding Labs', score: '100%' }
            ]},
            { id: 'ph101', name: 'Physics I', credits: 4, grade: 'A-', score: 90, activities: [
              { name: 'Midterm Exam', score: '85%' },
              { name: 'Final Exam', score: '94%' },
              { name: 'Lab Reports', score: '92%' }
            ]}
          ]
        }
      ]
    }
  ]
};

// --- HELPER COMPONENTS ---

const getGradeColorClass = (score: number) => {
  if (score >= 90) return 'grade-excellent';
  if (score >= 80) return 'grade-good';
  if (score >= 70) return 'grade-average';
  return 'grade-poor';
};

const SubjectCard = ({ subject }: { subject: any }) => {
  const [expanded, setExpanded] = useState(false);
  const colorClass = getGradeColorClass(subject.score);

  return (
    <div className="subject-card" onClick={() => setExpanded(!expanded)}>
      <div className="subject-card-header">
        <div>
          <div className="subject-title">{subject.name}</div>
          <div className="subject-credits">{subject.credits} Credits • {subject.id.toUpperCase()}</div>
        </div>
        <div className={`subject-grade ${colorClass}`}>{subject.grade}</div>
      </div>

      {expanded && (
        <div className="activities-breakdown">
          <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Activity Breakdown</div>
          {subject.activities.map((act: any, idx: number) => (
            <div key={idx} className="activity-item">
              <span className="activity-name">{act.name}</span>
              <span className={`activity-score`}>{act.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const YearAccordion = ({ yearData }: { yearData: any }) => {
  const [isOpen, setIsOpen] = useState(false); // Default closed to encourage exploration

  return (
    <div className="year-accordion">
      <div className="year-header" onClick={() => setIsOpen(!isOpen)}>
        <div>{yearData.year}</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#aaa', fontWeight: 400 }}>Year GPA: <strong style={{color: 'white'}}>{yearData.gpa}</strong></span>
          <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="year-body">
          {yearData.semesters.map((sem: any, idx: number) => (
            <div key={idx} className="semester-box">
              <div className="semester-header">
                <span>{sem.name}</span>
                <span style={{ fontSize: '0.85rem', color: '#ccc' }}>Sem GPA: {sem.gpa}</span>
              </div>
              <div className="subject-grid">
                {sem.subjects.map((sub: any, subIdx: number) => (
                  <SubjectCard key={subIdx} subject={sub} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE ---
export const AcademicTranscriptPage: React.FC = () => {
  // Calculate the percentage for the CSS conic-gradient (GPA out of 4.0)
  const gpaPercentage = (MOCK_TRANSCRIPT.cumulativeGpa / 4.0) * 100;

  return (
    <div className="transcript-container">
      <PageHeader title="Grades & Transcript" />

      {/* Dashboard Overview */}
      <div className="overview-card">
        <div className="gpa-circle" style={{ '--progress': `${gpaPercentage}%` } as any}>
          <div className="gpa-circle-content">
            <h2>{MOCK_TRANSCRIPT.cumulativeGpa}</h2>
            <span>Cum. GPA</span>
          </div>
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>Academic Standing: <span style={{ color: 'hsl(140, 70%, 60%)' }}>Excellent</span></h3>
          <p style={{ margin: 0, color: '#aaa', lineHeight: '1.5' }}>
            You have completed <strong>{MOCK_TRANSCRIPT.totalCredits}</strong> credits towards your degree. 
            Click on the years below to drill down into specific semesters, subjects, and activities.
          </p>
        </div>
      </div>

      {/* Interactive Year Drill-Downs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MOCK_TRANSCRIPT.years.map((year, index) => (
          <YearAccordion key={index} yearData={year} />
        ))}
      </div>

    </div>
  );
};
