import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useCourses, useUpdatePrerequisite } from './Curriculum.hooks';

export const PrerequisitesPage: React.FC = () => {
    const { data: courses, isLoading } = useCourses();
    const updateMutation = useUpdatePrerequisite();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Prerequisite Management"
                subtitle="Configure and enforce prerequisites and co-requisites for the university catalog."
            />

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Required Course</th>
                            <th>Minimum Grade</th>
                            <th>Enforcement</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses?.flatMap(course =>
                            course.prerequisites.map((rule: any) => (
                                <tr key={rule.ruleId}>
                                    <td><strong>{course.code}</strong></td>
                                    <td>{rule.requiredCourseId}</td>
                                    <td>{rule.minimumGrade}</td>
                                    <td>
                                        <Badge colorScheme={rule.isEnforced ? 'success' : 'warning'}>
                                            {rule.isEnforced ? 'STRICT' : 'ADVISORY'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline"
                                            size="small"
                                            onClick={() => updateMutation.mutate({ ruleId: rule.ruleId, payload: { isEnforced: !rule.isEnforced } })}
                                        >
                                            Toggle Enforcement
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};