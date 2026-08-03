import { useEffect, useState } from 'react';
// Massive mock data generator
const generateMockData = () => {
    const years = [
        { name: '2023-2024', level: '1st Year' },
        { name: '2024-2025', level: '2nd Year' },
        { name: '2025-2026', level: '3rd Year' },
        { name: '2026-2027', level: '4th Year' }
    ];
    const sems = ['First Semester', 'Second Semester'];
    // Base CS Subjects pool to randomize slightly
    const subjectPool = [
        'Introduction to Computing', 'Computer Programming 1', 'Data Structures', 'Algorithms',
        'Discrete Mathematics', 'Database Management Systems', 'Software Engineering 1', 'Web Development',
        'Computer Architecture', 'Operating Systems', 'Automata Theory', 'Artificial Intelligence',
        'Information Assurance', 'Networks and Communications', 'Calculus 1', 'Physics for IT',
        'Understanding the Self', 'Purposive Communication', 'Readings in History', 'Ethics'
    ];
    const getSubjectsForSem = (yearIdx, semIdx) => {
        const subs = [];
        for (let i = 0; i < 8; i++) {
            const subjectName = subjectPool[(yearIdx * 16 + semIdx * 8 + i) % subjectPool.length];
            const code = `CS${yearIdx + 1}${semIdx + 1}0${i + 1}`;
            subs.push({
                id: `offering-${code}`,
                code: code,
                title: subjectName,
                credits: 3,
                section: `BSCS-${yearIdx + 1}A`,
                faculty: `Dr. Faculty ${i + 1}`,
                lmsData: [
                    { id: `lms-${code}-1`, type: 'Module', title: 'Course Orientation & Syllabus' },
                    { id: `lms-${code}-2`, type: 'Lesson', title: 'Chapter 1: Fundamentals' },
                    { id: `lms-${code}-3`, type: 'Quiz', title: 'Quiz 1', score: Math.floor(Math.random() * 10) + 90, maxScore: 100 },
                    { id: `lms-${code}-4`, type: 'Assignment', title: 'Homework 1: Problem Set', score: 95, maxScore: 100 },
                    { id: `lms-${code}-5`, type: 'Discussion', title: 'Week 2 Forum' }
                ],
                examinations: [
                    { id: `exam-${code}-1`, type: 'Prelim', score: Math.floor(Math.random() * 15) + 85, maxScore: 100, status: 'Graded' },
                    { id: `exam-${code}-2`, type: 'Midterm', score: Math.floor(Math.random() * 20) + 80, maxScore: 100, status: 'Graded' },
                    { id: `exam-${code}-3`, type: 'Final', status: 'Pending' }
                ]
            });
        }
        return subs;
    };
    const academicYears = years.map((y, yIdx) => ({
        id: `ay-${yIdx}`,
        yearName: y.name,
        level: y.level,
        semesters: sems.map((s, sIdx) => ({
            id: `sem-${yIdx}-${sIdx}`,
            name: s,
            offerings: getSubjectsForSem(yIdx, sIdx)
        }))
    }));
    return {
        programId: 'prog-bscs',
        programName: 'Bachelor of Science in Computer Science',
        curriculumVersion: '2023-Rev-A',
        academicYears
    };
};
export const useMyEnrollments = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Simulate network delay for massive payload
        const timer = setTimeout(() => {
            setData(generateMockData());
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);
    return { data, isLoading, isError: false };
};
