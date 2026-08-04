namespace Communication.Presentation.Endpoints;

using Communication.Application.Features.GetInbox;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/communication")] // Note: Update frontend axios BASE_URL to match this
public sealed class GetInboxEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public GetInboxEndpoint(ISender sender) => _sender = sender;

    [HttpGet("{facultyId}/inbox")]
    [ProducesResponseType(typeof(IReadOnlyList<InboxMessageDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetInbox([FromRoute] string facultyId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetInboxQuery(facultyId), cancellationToken);
        return Ok(result);
    }
}