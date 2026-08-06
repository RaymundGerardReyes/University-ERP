namespace Examination.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Examination.Application.Features.GetExamSessions;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/examination/sessions")]
public class SessionsEndpoint : ControllerBase
{
    private readonly IMediator _mediator;

    public SessionsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetExamSessions(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetExamSessionsQuery(), cancellationToken);
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }
        
        return BadRequest(result.Error);
    }
}
