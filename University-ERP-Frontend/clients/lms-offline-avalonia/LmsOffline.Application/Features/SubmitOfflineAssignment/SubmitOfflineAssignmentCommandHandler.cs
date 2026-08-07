namespace LmsOffline.Application.Features.SubmitOfflineAssignment;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;

public class SubmitOfflineAssignmentCommandHandler : IRequestHandler<SubmitOfflineAssignmentCommand, Result<bool>>
{
    private readonly IOfflineAssignmentRepository _assignmentRepository;

    public SubmitOfflineAssignmentCommandHandler(IOfflineAssignmentRepository assignmentRepository)
    {
        _assignmentRepository = assignmentRepository;
    }

    public Task<Result<bool>> Handle(SubmitOfflineAssignmentCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<bool>.Success(true));
    }
}