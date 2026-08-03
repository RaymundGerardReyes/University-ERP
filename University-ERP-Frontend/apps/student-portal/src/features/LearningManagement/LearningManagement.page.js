import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { PageHeader } from '@university-erp/ui-kit';
import { useParams, useNavigate } from 'react-router-dom';
import './LearningManagement.styles.css';
const COURSE_DATA = {
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
const AssessmentPeriodAccordion = ({ period }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs("div", { className: "lms-period-accordion", children: [_jsxs("div", { className: "lms-period-header", onClick: () => setIsOpen(!isOpen), children: [_jsx("h3", { children: period.title }), _jsx("span", { style: { transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }, children: "\u25BC" })] }), isOpen && (_jsx("div", { className: "lms-period-body", children: _jsx("div", { className: "lms-activities-grid", children: period.activities.map((act, idx) => (_jsxs("div", { className: "lms-activity-card", children: [_jsxs("div", { className: "lms-act-header", children: [_jsx("span", { className: "lms-act-type", children: act.type }), _jsx("span", { className: "lms-act-date", children: act.date })] }), _jsx("div", { className: "lms-act-title", children: act.title }), _jsx("div", { className: "lms-act-score", children: act.score })] }, idx))) }) }))] }));
};
export const LearningManagementPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const course = courseId ? COURSE_DATA[courseId.toLowerCase()] : COURSE_DATA['cs101'];
    if (!course) {
        return _jsx("div", { style: { color: 'white' }, children: "Course LMS not found." });
    }
    return (_jsxs("div", { className: "lms-container", children: [_jsx("button", { className: "lms-back-btn", onClick: () => navigate('/enrollments'), children: "\u2190 Back to Enrollments" }), _jsx(PageHeader, { title: `${course.code.toUpperCase()} LMS: ${course.name}` }), _jsx("div", { className: "lms-overview-card", children: _jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 0.5rem 0' }, children: "Gradebook & Activities" }), _jsxs("p", { style: { margin: 0, color: '#aaa', lineHeight: '1.5' }, children: ["Faculty: ", course.faculty, " ", _jsx("br", {}), "Track your granular academic progress across the primary assessment periods (Prelims, Midterms, Finals) below."] })] }) }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: course.modules.map((mod, index) => (_jsx(AssessmentPeriodAccordion, { period: mod }, index))) })] }));
};
