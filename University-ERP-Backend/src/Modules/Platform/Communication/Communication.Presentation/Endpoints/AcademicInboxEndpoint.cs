namespace Communication.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Communication.Application.Features.GetInbox;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/communication")] 
public sealed class AcademicInboxEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public AcademicInboxEndpoint(ISender sender) => _sender = sender;

    [HttpGet("{facultyId}/inbox")]
    [ProducesResponseType(typeof(IReadOnlyList<InboxMessageDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetInbox([FromRoute] string facultyId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetInboxQuery(facultyId), cancellationToken);
        return Ok(result);
    }
}