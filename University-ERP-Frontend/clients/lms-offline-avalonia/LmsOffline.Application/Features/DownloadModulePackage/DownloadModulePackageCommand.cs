namespace LmsOffline.Application.Features.DownloadModulePackage;

using System;
using MediatR;
using SharedKernel.Domain.Primitives;

/// <summary>
/// CQRS Command to save a downloaded course module to the offline database.
/// </summary>
public sealed record DownloadModulePackageCommand(
    Guid ModuleId, 
    string CourseName, 
    string ModuleTitle
) : IRequest<Result<Guid>>;
