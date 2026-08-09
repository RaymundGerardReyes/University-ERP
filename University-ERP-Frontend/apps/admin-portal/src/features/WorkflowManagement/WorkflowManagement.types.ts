export interface WorkflowStepDto {
    stepName: string;
    status: string;
}

export interface WorkflowDto {
    workflowName: string;
    steps: WorkflowStepDto[];
}