namespace Enrollment.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Enrollment.Application.Features.GetValidationQueue;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/registrar")]
public sealed class RegistrarEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public RegistrarEndpoint(ISender sender) => _sender = sender;

    [HttpGet("enrollment/validation-queue")]
    [ProducesResponseType(typeof(IReadOnlyList<ValidationQueueItemDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetValidationQueue(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetEnrollmentValidationQueueQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("clearances/pending")]
    public async Task<IActionResult> GetPendingClearances(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new StudentInformation.Application.Features.Graduation.GetPendingClearancesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPost("clearances/{studentId}/request")]
    public async Task<IActionResult> RequestClearance([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new StudentInformation.Application.Features.Graduation.ReviewClearanceCommand(studentId), cancellationToken);
        return result.IsSuccess ? Ok(result) : BadRequest(new { error = result.Error.Code, message = result.Error.Description });
    }

    [HttpPost("clearances/{studentId}/approve")]
    public async Task<IActionResult> ApproveGraduation([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new StudentInformation.Application.Features.Graduation.ApproveGraduationCommand(studentId), cancellationToken);
        return result.IsSuccess ? Ok(result) : BadRequest(new { error = result.Error.Code, message = result.Error.Description });
    }
}
