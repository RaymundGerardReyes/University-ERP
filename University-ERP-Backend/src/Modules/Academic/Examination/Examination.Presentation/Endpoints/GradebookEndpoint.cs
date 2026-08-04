namespace Examination.Presentation.Endpoints;

using Examination.Application.Features.GetGradebook;
using Examination.Application.Features.SubmitGrades;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/assessments/gradebook")] // Matches the frontend BASE_URL perfectly
public sealed class GradebookEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GradebookEndpoint(ISender sender) => _sender = sender;

    [HttpGet("{sectionId}")]
    [ProducesResponseType(typeof(IReadOnlyList<StudentGradeRecordDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetGradebook([FromRoute] string sectionId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetGradebookQuery(sectionId), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{sectionId}/submit")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitGrades(
        [FromRoute] string sectionId, 
        [FromBody] object payload, 
        CancellationToken cancellationToken)
    {
        var command = new SubmitGradesCommand(sectionId, payload);
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok() 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}