import React, { useState } from 'react';
import { PageHeader } from '@university-erp/ui-kit';
import { useParams, useNavigate } from 'react-router-dom';
import './LearningManagement.styles.css';

const COURSE_DATA: Record<string, any> = {
  'cs101': {
    name: 'Intro to Computer Science',
    code: 'cs101',
    faculty: 'Dr. Smith',
    modules: [
      {
        title: 'Prelims',
        activities: [
          { type: 'Attendance', title: 'Week 1-4', score: '100%', date: 'Sept 30' },
          { type: 'Quiz', title: 'Quiz 1: Logic Gates', score: '95%', date: 'Oct 5' },
          { type: 'Assignment', title: 'Binary Addition', score: '92%', date: 'Oct 10' },
          { type: 'Exam', title: 'Prelim Examination', score: '88%', date: 'Oct 15' }
        ]
      },
      {
        title: 'Midterms',
        activities: [
          { type: 'Attendance', title: 'Week 5-9', score: '100%', date: 'Nov 15' },
          { type: 'Laboratory', title: 'Python Basics', score: '98%', date: 'Nov 20' },
          { type: 'Quiz', title: 'Quiz 2: Control Flow', score: '90%', date: 'Nov 25' },
          { type: 'Project', title: 'Midterm CLI App', score: '95%', date: 'Dec 1' },
          { type: 'Exam', title: 'Midterm Examination', score: '92%', date: 'Dec 5' }
        ]
      },
      {
        title: 'Finals',
        activities: [
          { type: 'Attendance', title: 'Week 10-14', score: '100%', date: 'Jan 15' },
          { type: 'Laboratory', title: 'Data Structures', score: '94%', date: 'Jan 20' },
          { type: 'Quiz', title: 'Quiz 3: OOP', score: '91%', date: 'Jan 25' },
          { type: 'Exam', title: 'Final Examination', score: '96%', date: 'Feb 5' }
        ]
      }
    ]
  }
};

const AssessmentPeriodAccordion = ({ period }: { period: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lms-period-accordion">
      <div className="lms-period-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>{period.title}</h3>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
      </div>
      
      {isOpen && (
        <div className="lms-period-body">
          <div className="lms-activities-grid">
            {period.activities.map((act: any, idx: number) => (
              <div key={idx} className="lms-activity-card">
                <div className="lms-act-header">
                  <span className="lms-act-type">{act.type}</span>
                  <span className="lms-act-date">{act.date}</span>
                </div>
                <div className="lms-act-title">{act.title}</div>
                <div className="lms-act-score">{act.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const LearningManagementPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const course = courseId ? COURSE_DATA[courseId.toLowerCase()] : COURSE_DATA['cs101'];

  if (!course) {
    return <div style={{color:'white'}}>Course LMS not found.</div>;
  }

  return (
    <div className="lms-container">
      <button className="lms-back-btn" onClick={() => navigate('/enrollments')}>← Back to Enrollments</button>
      
      <PageHeader title={`${course.code.toUpperCase()} LMS: ${course.name}`} />
      
      <div className="lms-overview-card">
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Gradebook & Activities</h3>
          <p style={{ margin: 0, color: '#aaa', lineHeight: '1.5' }}>
            Faculty: {course.faculty} <br />
            Track your granular academic progress across the primary assessment periods (Prelims, Midterms, Finals) below.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {course.modules.map((mod: any, index: number) => (
          <AssessmentPeriodAccordion key={index} period={mod} />
        ))}
      </div>
    </div>
  );
};
