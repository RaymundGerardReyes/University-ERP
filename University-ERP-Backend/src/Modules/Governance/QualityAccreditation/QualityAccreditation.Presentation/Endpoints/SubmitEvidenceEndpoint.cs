namespace QualityAccreditation.Presentation.Endpoints;

using QualityAccreditation.Application.Features.SubmitEvidence;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/governance/accreditation")]
public sealed class SubmitEvidenceEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public SubmitEvidenceEndpoint(ISender sender) => _sender = sender;

    [HttpPost("evidence")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Submit([FromBody] SubmitEvidenceCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { EvidenceId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
