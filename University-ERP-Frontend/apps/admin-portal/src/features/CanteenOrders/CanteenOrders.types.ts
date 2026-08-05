export interface CanteenOrdersPageProps { }

export interface CanteenOrder {
    id: string;
    student: string;
    plan: string;
    time: string;
    status: 'Served' | 'Pending' | 'Cancelled';
}