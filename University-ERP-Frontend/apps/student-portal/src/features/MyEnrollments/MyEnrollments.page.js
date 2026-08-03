import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, PageHeader } from '@university-erp/ui-kit';
import { useState } from 'react';
import { useMyEnrollments } from './MyEnrollments.hooks';
import './MyEnrollments.styles.css';
// --- Level 3: Subject & Learning Management Component ---
const SubjectCard = ({ subject }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('lms');
    return (_jsxs("div", { className: "subject-card", children: [_jsxs("div", { className: "subject-card-header", onClick: () => setIsExpanded(!isExpanded), children: [_jsxs("div", { className: "subject-info", children: [_jsxs("h4", { children: [subject.code, ": ", subject.title] }), _jsxs("div", { className: "subject-meta", children: ["Section: ", _jsx("strong", { style: { color: 'var(--text-primary)' }, children: subject.section }), " \u2022 ", subject.credits, " Credits \u2022 ", subject.faculty] })] }), _jsx(Badge, { colorScheme: "success", children: "Enrolled" })] }), isExpanded && (_jsxs("div", { className: "subject-body", children: [_jsxs("div", { className: "tabs-header", children: [_jsx("button", { className: `tab-btn ${activeTab === 'lms' ? 'active' : ''}`, onClick: () => setActiveTab('lms'), children: "Learning Management" }), _jsx("button", { className: `tab-btn ${activeTab === 'exams' ? 'active' : ''}`, onClick: () => setActiveTab('exams'), children: "Examination" })] }), activeTab === 'lms' && (_jsx("div", { className: "activities-grid", children: subject.lmsData.map(act => (_jsxs("div", { className: "activity-card", children: [_jsx("span", { className: "act-type", children: act.type }), _jsx("div", { className: "act-title", children: act.title }), act.score !== undefined ? (_jsxs("div", { className: "act-score", children: [act.score, " / ", act.maxScore] })) : (_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'auto' }, children: "Pending" }))] }, act.id))) })), activeTab === 'exams' && (_jsx("div", { className: "activities-grid", children: subject.examinations.map(exam => (_jsxs("div", { className: "activity-card", children: [_jsx("span", { className: "act-type", children: exam.status }), _jsxs("div", { className: "act-title", children: [exam.type, " Examination"] }), exam.score !== undefined ? (_jsxs("div", { className: "act-score", children: [exam.score, " / ", exam.maxScore] })) : (_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'auto' }, children: "Upcoming" }))] }, exam.id))) }))] }))] }));
};
// --- Level 2: Semester Accordion ---
const SemesterAccordion = ({ name, offerings, isInitialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(isInitialOpen);
    return (_jsxs("div", { className: "semester-accordion", children: [_jsxs("div", { className: "semester-header", onClick: () => setIsOpen(!isOpen), children: [_jsx("span", { children: name }), _jsxs("span", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }, children: [offerings.length, " Subjects Enrolled ", isOpen ? '▲' : '▼'] })] }), isOpen && (_jsx("div", { className: "semester-body", children: offerings.map(subject => (_jsx(SubjectCard, { subject: subject }, subject.id))) }))] }));
};
// --- Level 1: Main Academic Hierarchy Page ---
export const MyEnrollmentsPage = () => {
    const { data: program, isLoading, isError } = useMyEnrollments();
    if (isLoading)
        return _jsx("div", { style: { color: 'var(--text-secondary)' }, children: "Loading enterprise curriculum data..." });
    if (isError || !program)
        return _jsx("div", { style: { color: 'var(--danger-text)' }, children: "Failed to load curriculum." });
    return (_jsxs("div", { className: "timeline-container", children: [_jsx(PageHeader, { title: "My Academic Timeline", subtitle: "Enterprise Enrollment Hierarchy" }), _jsxs("div", { className: "timeline-header-card", children: [_jsx("h2", { children: program.programName }), _jsxs("p", { children: ["Curriculum Version: ", program.curriculumVersion] })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }, children: program.academicYears.map((ay, index) => (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }, children: [_jsxs("h3", { style: { margin: 0, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }, children: [ay.yearName, " ", _jsxs("span", { style: { color: 'var(--text-secondary)', fontWeight: 400 }, children: ["\u2022 ", ay.level] })] }), ay.semesters.map((sem, sIdx) => (_jsx(SemesterAccordion, { name: sem.name, offerings: sem.offerings, isInitialOpen: index === 0 && sIdx === 0 }, sem.id)))] }, ay.id))) })] }));
};
