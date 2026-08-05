
// Using identity API context, mocking full user list for UI scaffolding
export const fetchSystemUsers = async () => {
    return [
        { id: 'USR-1001', name: 'Dr. Alan Turing', email: 'aturing@university.edu', role: 'Faculty', status: 'Active' },
        { id: 'USR-1002', name: 'Sarah Jenkins', email: 'sjenkins@student.edu', role: 'Student', status: 'Active' },
        { id: 'USR-1003', name: 'Marcus Johnson', email: 'mjohnson@admin.edu', role: 'Global Administrator', status: 'Locked' },
    ];
};

export const revokeUserAccess = async (userId: string) => {
    return Promise.resolve({ userId, action: 'revoked' });
};