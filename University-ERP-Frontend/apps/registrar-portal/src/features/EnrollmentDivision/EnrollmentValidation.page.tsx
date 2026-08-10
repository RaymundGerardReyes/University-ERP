import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useEnrollmentValidationQueue, useValidateEnrollment } from './Enrollment.hooks';
import { EnrollmentValidationItem } from './Enrollment.types';

export const EnrollmentValidationPage: React.FC = () => {
    const { data: validations = [], isLoading } = useEnrollmentValidationQueue();
    const validateMutation = useValidateEnrollment();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    const handleValidate = (id: string) => {
        validateMutation.mutate(id);
    };

    return (
        <div className="fade-in">
            <PageHeader title="Enrollment Validation" subtitle="Review and validate student subject loads." />

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Total Units</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validations.map((item: EnrollmentValidationItem) => (
                            <tr key={item.id}>
                                <td style={{ fontFamily: 'monospace' }}>{item.id}</td>
                                <td>{item.studentName}</td>
                                <td>{item.units}</td>
                                <td>
                                    <Badge colorScheme={item.status === 'Validated' ? 'success' : 'warning'}>
                                        {item.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={() => handleValidate(item.id)}
                                        disabled={item.status === 'Validated' || validateMutation.isPending}
                                    >
                                        {validateMutation.isPending ? 'Validating...' : 'Validate'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};