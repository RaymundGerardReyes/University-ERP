namespace Admissions.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Admissions.Application.Features.CheckEligibility;

[ApiController]
[Route("api/v1/admissions/eligibility")]
public sealed class EligibilityEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public EligibilityEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType<EligibilityResultDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> CheckEligibility([FromBody] CheckEligibilityQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }
}
