namespace LmsOffline.Application.Features.SyncPendingSubmissions;

using MediatR;
using SharedKernel.Domain.Primitives;

public record SyncPendingSubmissionsCommand() : IRequest<Result<bool>>;