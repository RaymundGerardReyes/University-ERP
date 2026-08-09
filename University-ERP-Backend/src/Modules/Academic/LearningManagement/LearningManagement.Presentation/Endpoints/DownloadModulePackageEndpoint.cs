namespace LearningManagement.Presentation.Endpoints;

using LearningManagement.Application.Features.GetOfflineModulePackage;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Endpoint for the Avalonia LmsOffline client to download encrypted course packages and delta updates.
/// GET /api/v1/lms/packages/{moduleId}/student/{studentId}
/// GET /api/v1/lms/packages/delta/{studentId}
/// </summary>
[ApiController]
[Route("api/v1/lms/packages")]
public sealed class DownloadModulePackageEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public DownloadModulePackageEndpoint(ISender sender) => _sender = sender;

    [HttpGet("{moduleId:guid}/student/{studentId:guid}")]
    [ProducesResponseType<ModulePackageDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> DownloadPackage(
        [FromRoute] Guid moduleId, 
        [FromRoute] Guid studentId, 
        CancellationToken cancellationToken)
    {
        var query = new GetOfflineModulePackageQuery(moduleId, studentId);
        var result = await _sender.Send(query, cancellationToken);
        
        return Ok(result);
    }

    [HttpGet("delta/{studentId}")]
    [ProducesResponseType<CoursePackageDeltaDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDeltaPackage(
        [FromRoute] string studentId,
        [FromQuery] DateTime? lastSyncUtc,
        CancellationToken cancellationToken)
    {
        var query = new GetOfflineDeltaPackageQuery(studentId, lastSyncUtc ?? DateTime.MinValue);
        var result = await _sender.Send(query, cancellationToken);

        return Ok(result);
    }
}