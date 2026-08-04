namespace QualityAccreditation.Application.Features.GetActiveWorkflows;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public sealed record WorkflowStepDto(string StepName, string Status);
public sealed record WorkflowDto(string WorkflowName, IReadOnlyList<WorkflowStepDto> Steps);

public sealed record GetActiveWorkflowsQuery() : IRequest<IReadOnlyList<WorkflowDto>>;

public sealed class GetActiveWorkflowsQueryHandler : IRequestHandler<GetActiveWorkflowsQuery, IReadOnlyList<WorkflowDto>>
{
    public Task<IReadOnlyList<WorkflowDto>> Handle(GetActiveWorkflowsQuery request, CancellationToken cancellationToken)
    {
        var mockWorkflows = new List<WorkflowDto>
        {
            new("Undergraduate Admissions Routing", new List<WorkflowStepDto>
            {
                new("Application Submitted", "Completed"),
                new("Secretary (Document Verification)", "Completed"),
                new("Faculty (Evaluation)", "Completed"),
                new("Dean (Final Decision)", "Active")
            }),
            new("Grade Appeal Process", new List<WorkflowStepDto>
            {
                new("Appeal Filed", "Completed"),
                new("Professor Review", "Pending"),
                new("Department Head", "Pending")
            })
        };

        return Task.FromResult<IReadOnlyList<WorkflowDto>>(mockWorkflows);
    }
}