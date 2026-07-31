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
namespace LmsOffline.Application.Features.SyncPendingSubmissions;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;

public sealed class SyncPendingSubmissionsCommandHandler : IRequestHandler<SyncPendingSubmissionsCommand, Result<bool>>
{
    private readonly ISyncProcessor _syncProcessor;

    public SyncPendingSubmissionsCommandHandler(ISyncProcessor syncProcessor)
    {
        _syncProcessor = syncProcessor;
    }

    public async Task<Result<bool>> Handle(SyncPendingSubmissionsCommand request, CancellationToken cancellationToken)
    {
        // Triggers the OutboxSyncProcessor to push encrypted SQLite records to the backend LMS
        bool syncResult = await _syncProcessor.ProcessPendingSubmissionsAsync(cancellationToken);

        if (!syncResult)
        {
            return Result<bool>.Failure(new Error("Sync.NetworkFailure", "Could not reach the University ERP Backend. Submissions remain safely in the Outbox."));
        }

        return Result<bool>.Success(true);
    }
}