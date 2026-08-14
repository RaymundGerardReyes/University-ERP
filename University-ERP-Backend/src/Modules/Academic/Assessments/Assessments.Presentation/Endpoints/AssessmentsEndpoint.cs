namespace Assessments.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Assessments.Application.Features.SubmitGrades;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/assessments")]
public sealed class AssessmentsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public AssessmentsEndpoint(ISender sender) => _sender = sender;

    [HttpPost("gradebook/{sectionId}/submit")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitGrades(
        [FromRoute] string sectionId, 
        [FromBody] Dictionary<string, StudentGradePayload> payload, 
        CancellationToken cancellationToken)
    {
        var command = new SubmitGradesCommand(sectionId, payload);
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok() 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
