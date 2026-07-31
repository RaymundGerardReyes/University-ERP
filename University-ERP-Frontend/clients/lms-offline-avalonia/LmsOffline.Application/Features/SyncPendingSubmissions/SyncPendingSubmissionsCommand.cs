namespace LmsOffline.Application.Features.SyncPendingSubmissions;

using MediatR;
using SharedKernel.Domain.Primitives;

/// <summary>
/// CQRS Command to manually trigger the outbox sync processor.
/// </summary>
public sealed record SyncPendingSubmissionsCommand() : IRequest<Result<bool>>;
