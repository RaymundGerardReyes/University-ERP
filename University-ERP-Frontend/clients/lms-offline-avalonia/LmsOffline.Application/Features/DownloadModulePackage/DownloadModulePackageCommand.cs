namespace LmsOffline.Application.Features.DownloadModulePackage;

using System;
using MediatR;
using SharedKernel.Domain.Primitives;

public record DownloadModulePackageCommand(
    Guid ModuleId,
    Guid StudentId
) : IRequest<Result<bool>>;