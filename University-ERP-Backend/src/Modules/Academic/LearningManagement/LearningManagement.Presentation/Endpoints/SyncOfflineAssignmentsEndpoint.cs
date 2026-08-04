namespace LearningManagement.Presentation.Endpoints;

using LearningManagement.Application.Features.ProcessOfflineAssignmentSubmission;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Ingestion endpoint for offline assignment (essay/code) submissions.
/// </summary>
[ApiController]
[Route("api/v1/lms/sync")]
public sealed class SyncOfflineAssignmentsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public SyncOfflineAssignmentsEndpoint(ISender sender) => _sender = sender;

    [HttpPost("assignments")]
    [ProducesResponseType(typeof(SyncAssignmentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> SyncAssignment(
        [FromBody] SyncOfflineAssignmentRequest request,
        CancellationToken cancellationToken)
    {
        var command = new ProcessOfflineAssignmentSubmissionCommand(
            request.AssignmentId,
            request.StudentId,
            request.CourseCode,
            request.AssignmentTitle,
            request.EssayContent,
            request.ScheduleToken,
            request.SubmittedAtUtc
        );

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return UnprocessableEntity(new { code = result.Error.Code, message = result.Error.Description });
        }

        return Ok(new SyncAssignmentResponse(result.Value));
    }
}

public sealed record SyncOfflineAssignmentRequest(
    Guid AssignmentId,
    Guid StudentId,
    string CourseCode,
    string AssignmentTitle,
    string EssayContent,
    string ScheduleToken,
    DateTime SubmittedAtUtc
);

public sealed record SyncAssignmentResponse(Guid SubmissionId);