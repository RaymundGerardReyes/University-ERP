export interface UserAdministrationPageProps { }

export interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Locked' | 'Pending';
}