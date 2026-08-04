namespace Admissions.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Admissions.Application.Features.SubmitApplication;
using Admissions.Application.Features.UploadDocument;
using Admissions.Application.Features.GetApplicantJourney;

[ApiController]
[Route("api/v1/admissions/applications")]
public sealed class ApplicationsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public ApplicationsEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType<string>(StatusCodes.Status200OK)]
    public async Task<IActionResult> SubmitApplication([FromBody] SubmitApplicationCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpGet("journey/{studentId}")]
    [ProducesResponseType<JourneyStateDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetApplicantJourney([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetApplicantJourneyQuery(studentId), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{id}/documents")]
    [ProducesResponseType<bool>(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadDocument([FromRoute] string id, [FromBody] UploadDocumentDto request, CancellationToken cancellationToken)
    {
        var command = new UploadDocumentCommand(id, request.DocumentName, request.FilePath);
        var result = await _sender.Send(command, cancellationToken);
        if (!result) return NotFound();
        
        return Ok(result);
    }
}

public sealed record UploadDocumentDto(string DocumentName, string FilePath);
