export interface ProgramExplorerPageProps { }

export interface AcademicProgram {
    id: string;
    name: string;
    college: string;
    duration: string;
    status: 'Open' | 'Waitlist' | 'Closed';
}