using LearningManagement.Application.Features.ProcessOfflineAssessmentSubmission;
using LearningManagement.Contracts.IntegrationEvents;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagement.Presentation.Endpoints;

/// <summary>
/// Ingestion endpoint for offline assessment submissions posted by
/// the Avalonia LmsOffline client's OutboxSyncProcessor.
/// POST /api/v1/lms/sync/assessments
/// </summary>
[ApiController]
[Route("api/v1/lms/sync")]
public sealed class SyncOfflineAssessmentsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public SyncOfflineAssessmentsEndpoint(ISender sender) => _sender = sender;

    /// <summary>
    /// Ingests a single offline assessment submission payload from the Avalonia client.
    /// </summary>
    [HttpPost("assessments")]
    [ProducesResponseType<SyncAssessmentResponse>(StatusCodes.Status200OK)]
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
            request.Answers.Select(a => new AnswerPayload(a.QuestionId, a.SelectedOption)).ToList(),
            request.ScheduleToken,
            request.SubmittedAtUtc);

        var result = await _sender.Send(command, cancellationToken);

        if (!result.IsAccepted)
        {
            return UnprocessableEntity(new { error = result.RejectionReason });
        }

        return Ok(new SyncAssessmentResponse(result.AssessmentId, result.IsAccepted));
    }
}

// ─── Request / Response DTOs ───────────────────────────────────────────────────

public sealed record SyncOfflineAssessmentRequest(
    Guid AssessmentId,
    Guid StudentId,
    string CourseCode,
    string ModuleTitle,
    IReadOnlyList<AnswerDto> Answers,
    string ScheduleToken,
    DateTimeOffset SubmittedAtUtc
);

public sealed record AnswerDto(string QuestionId, string SelectedOption);

public sealed record SyncAssessmentResponse(Guid AssessmentId, bool IsAccepted);
