namespace GrievanceManagement.Presentation.Endpoints;

using GrievanceManagement.Application.Features.SubmitComplaint;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/governance/grievances")]
public sealed class SubmitComplaintEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public SubmitComplaintEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Submit([FromBody] SubmitComplaintCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { ComplaintId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
