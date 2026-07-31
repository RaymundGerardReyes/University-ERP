namespace LmsOffline.Application.Features.SyncPendingSubmissions;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Infrastructure.Sync;

public sealed class SyncPendingSubmissionsCommandHandler : IRequestHandler<SyncPendingSubmissionsCommand, Result<bool>>
{
    private readonly OutboxSyncProcessor _syncProcessor;

    public SyncPendingSubmissionsCommandHandler(OutboxSyncProcessor syncProcessor)
    {
        _syncProcessor = syncProcessor;
    }

    public async Task<Result<bool>> Handle(SyncPendingSubmissionsCommand request, CancellationToken cancellationToken)
    {
        // Delegate the heavy lifting to the Infrastructure sync processor
        await _syncProcessor.ProcessPendingOutboxAsync(cancellationToken);
        
        return Result<bool>.Success(true);
    }
}
