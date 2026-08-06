namespace Finance.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Finance.Application.Features.GetInvoices;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/invoices")]
public class InvoicesEndpoint : ControllerBase
{
    private readonly IMediator _mediator;

    public InvoicesEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetInvoices(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetInvoicesQuery(), cancellationToken);
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }
        
        return BadRequest(result.Error);
    }
}
