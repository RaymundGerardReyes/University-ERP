namespace LmsOffline.Application.Features.SyncPendingSubmissions;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;

public class SyncPendingSubmissionsCommandHandler : IRequestHandler<SyncPendingSubmissionsCommand, Result<bool>>
{
    public Task<Result<bool>> Handle(SyncPendingSubmissionsCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<bool>.Success(true));
    }
}