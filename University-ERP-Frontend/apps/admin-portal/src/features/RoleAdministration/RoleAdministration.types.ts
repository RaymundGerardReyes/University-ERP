export interface RoleAdministrationPageProps { }

export interface SystemRole {
    id: string;
    name: string;
    users: number;
    riskLevel: 'High' | 'Medium' | 'Low';
    access: string;
}