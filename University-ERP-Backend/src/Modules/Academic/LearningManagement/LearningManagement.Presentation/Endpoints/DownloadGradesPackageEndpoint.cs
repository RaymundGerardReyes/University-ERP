namespace LearningManagement.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using LearningManagement.Application.Features.GetOfflineGradesPackage;

/// <summary>
/// Endpoint for downloading student grade delta sync packages.
/// GET /api/v1/academic/lms/grades/delta/{studentId}
/// </summary>
[ApiController]
[Route("api/v1/academic/lms/grades")]
public sealed class DownloadGradesPackageEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public DownloadGradesPackageEndpoint(ISender sender) => _sender = sender;

    [HttpGet("delta/{studentId}")]
    [ProducesResponseType<GradesPackageDeltaDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetGradesDeltaPackage(
        [FromRoute] string studentId, 
        [FromQuery] DateTime? lastSyncUtc, 
        CancellationToken cancellationToken)
    {
        // Dispatch the query to our MediatR pipeline
        var query = new GetOfflineGradesPackageQuery(studentId, lastSyncUtc ?? DateTime.MinValue);
        var result = await _sender.Send(query, cancellationToken);
        
        return Ok(result);
    }
}
