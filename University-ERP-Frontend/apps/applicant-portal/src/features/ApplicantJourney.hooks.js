import { useEffect, useState } from 'react';
const mockJourney = {
    applicantName: 'Jane Doe',
    applicantId: 'APP-2027-84920',
    currentStage: 4, // Currently at Document Verification
    milestones: [
        { id: 'm1', title: 'Account Created', status: 'Completed', dateCompleted: '2026-08-01', description: 'Basic identity established.' },
        { id: 'm2', title: 'Profile Completed', status: 'Completed', dateCompleted: '2026-08-01', description: 'Personal and educational background filled.' },
        { id: 'm3', title: 'Program Selected', status: 'Completed', dateCompleted: '2026-08-02', description: 'BS Computer Science selected.' },
        { id: 'm4', title: 'Documents Uploaded', status: 'Active', description: 'Submit all required enrollment documents.' },
        { id: 'm5', title: 'Application Submitted', status: 'Pending', description: 'Finalize and submit for review.' },
        { id: 'm6', title: 'Entrance Examination', status: 'Locked', description: 'Take the university entrance exam.' },
        { id: 'm7', title: 'Interview', status: 'Locked', description: 'Faculty interview.' },
        { id: 'm8', title: 'Admission Decision', status: 'Locked', description: 'Wait for official offer.' },
    ],
    programs: [
        { id: 'p1', college: 'College of Computing', degree: 'Bachelor of Science', major: 'Computer Science', duration: '4 Years', tuitionEstimate: '$12,000/yr', intake: 'Fall 2027', tags: ['STEM', 'High Demand'] },
        { id: 'p2', college: 'College of Computing', degree: 'Bachelor of Science', major: 'Information Technology', duration: '4 Years', tuitionEstimate: '$11,500/yr', intake: 'Fall 2027', tags: ['STEM'] },
        { id: 'p3', college: 'College of Business', degree: 'Bachelor of Science', major: 'Accountancy', duration: '4 Years', tuitionEstimate: '$10,000/yr', intake: 'Fall 2027', tags: ['Board Exam'] },
        { id: 'p4', college: 'College of Engineering', degree: 'Bachelor of Science', major: 'Civil Engineering', duration: '5 Years', tuitionEstimate: '$13,000/yr', intake: 'Fall 2027', tags: ['STEM', 'Board Exam'] },
    ],
    documents: [
        { id: 'd1', name: 'Birth Certificate', status: 'Verified', uploadedAt: '2026-08-02T10:00:00Z' },
        { id: 'd2', name: 'High School Transcript', status: 'Uploaded', uploadedAt: '2026-08-02T11:30:00Z' },
        { id: 'd3', name: 'Certificate of Good Moral Character', status: 'Pending' },
        { id: 'd4', name: '2x2 ID Photo', status: 'Rejected', uploadedAt: '2026-08-02T12:00:00Z', feedback: 'Background must be pure white.' },
        { id: 'd5', name: 'Government ID', status: 'Needs Resubmission', uploadedAt: '2026-08-02T12:15:00Z', feedback: 'Image is too blurry to read details.' }
    ],
    timeline: [
        { date: '2026-08-01 09:00 AM', event: 'Account Registered', detail: 'Email verified successfully.' },
        { date: '2026-08-01 09:15 AM', event: 'Profile Updated', detail: 'Educational background added.' },
        { date: '2026-08-02 10:00 AM', event: 'Document Uploaded', detail: 'Birth Certificate uploaded.' },
        { date: '2026-08-02 10:15 AM', event: 'Document Verified', detail: 'Birth Certificate verified by Admissions.' },
        { date: '2026-08-02 11:30 AM', event: 'Document Uploaded', detail: 'High School Transcript uploaded.' }
    ]
};
export const useApplicantJourney = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setData(mockJourney);
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);
    return { data, isLoading };
};
