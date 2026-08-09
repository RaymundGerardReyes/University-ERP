// File: src\Modules\Academic\LearningManagement\LearningManagement.Presentation\Endpoints\SyncOfflineAssessmentsEndpoint.cs
namespace LearningManagement.Presentation.Endpoints;

using LearningManagement.Application.Features.ProcessOfflineAssessmentSubmission;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/lms/sync")]
public sealed class SyncOfflineAssessmentsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public SyncOfflineAssessmentsEndpoint(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("assessments")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SyncAssessments([FromBody] ProcessOfflineAssessmentSubmissionCommand command, CancellationToken cancellationToken)
    {
        // Route the incoming payload to the Application layer via MediatR
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { SyncStatus = "Success", Message = "Offline assessment processed securely." }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}