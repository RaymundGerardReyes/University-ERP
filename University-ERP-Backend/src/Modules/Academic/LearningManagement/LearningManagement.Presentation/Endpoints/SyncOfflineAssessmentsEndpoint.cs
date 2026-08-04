namespace LearningManagement.Presentation.Endpoints;

using LearningManagement.Application.Features.ProcessOfflineAssessmentSubmission;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Ingestion endpoint for offline assessment submissions posted by
/// the Avalonia LmsOffline client's OutboxSyncProcessor.
/// </summary>
[ApiController]
[Route("api/v1/lms/sync")]
public sealed class SyncOfflineAssessmentsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public SyncOfflineAssessmentsEndpoint(ISender sender) => _sender = sender;

    [HttpPost("assessments")]
    [ProducesResponseType(typeof(SyncAssessmentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> SyncAssessment(
        [FromBody] SyncOfflineAssessmentRequest request,
        CancellationToken cancellationToken)
    {
        var command = new ProcessOfflineAssessmentSubmissionCommand(
            request.AssessmentId,
            request.StudentId,
            request.CourseCode,
            request.ModuleTitle,
            request.AnswersJson,
            request.ScheduleToken,
            request.SubmittedAtUtc
        );

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return UnprocessableEntity(new { code = result.Error.Code, message = result.Error.Description });
        }

        return Ok(new SyncAssessmentResponse(result.Value));
    }
}

public sealed record SyncOfflineAssessmentRequest(
    Guid AssessmentId,
    Guid StudentId,
    string CourseCode,
    string ModuleTitle,
    string AnswersJson,
    string ScheduleToken,
    DateTime SubmittedAtUtc
);

public sealed record SyncAssessmentResponse(Guid SubmissionId);