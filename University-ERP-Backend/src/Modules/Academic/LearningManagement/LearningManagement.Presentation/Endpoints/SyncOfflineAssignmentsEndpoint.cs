using LearningManagement.Application.Features.ProcessOfflineAssignmentSubmission;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagement.Presentation.Endpoints;

/// <summary>
/// Ingestion endpoint for offline assignment (essay) submissions posted by
/// the Avalonia LmsOffline client's OutboxSyncProcessor.
/// POST /api/v1/lms/sync/assignments
/// </summary>
[ApiController]
[Route("api/v1/lms/sync")]
public sealed class SyncOfflineAssignmentsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public SyncOfflineAssignmentsEndpoint(ISender sender) => _sender = sender;

    /// <summary>
    /// Ingests a single offline assignment submission payload from the Avalonia client.
    /// </summary>
    [HttpPost("assignments")]
    [ProducesResponseType<SyncAssignmentResponse>(StatusCodes.Status200OK)]
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
            request.SubmittedAtUtc);

        var result = await _sender.Send(command, cancellationToken);

        if (!result.IsAccepted)
        {
            return UnprocessableEntity(new { error = result.RejectionReason });
        }

        return Ok(new SyncAssignmentResponse(result.AssignmentId, result.IsAccepted));
    }
}

// ─── Request / Response DTOs ───────────────────────────────────────────────────

public sealed record SyncOfflineAssignmentRequest(
    Guid AssignmentId,
    Guid StudentId,
    string CourseCode,
    string AssignmentTitle,
    string EssayContent,
    string ScheduleToken,
    DateTimeOffset SubmittedAtUtc
);

public sealed record SyncAssignmentResponse(Guid AssignmentId, bool IsAccepted);
