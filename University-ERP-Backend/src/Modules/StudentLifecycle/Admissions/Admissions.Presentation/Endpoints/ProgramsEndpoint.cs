namespace Admissions.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Admissions.Application.Features.GetProgramCatalog;

[ApiController]
[Route("api/v1/admissions/programs")]
public sealed class ProgramsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public ProgramsEndpoint(ISender sender) => _sender = sender;

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<ProgramOfferingDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPrograms(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetProgramCatalogQuery(), cancellationToken);
        return Ok(result);
    }
}
