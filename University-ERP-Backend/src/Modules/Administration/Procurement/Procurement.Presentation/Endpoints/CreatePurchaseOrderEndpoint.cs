namespace Procurement.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Procurement.Application.Features.CreatePurchaseOrder;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/procurement/orders")]
public sealed class CreatePurchaseOrderEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public CreatePurchaseOrderEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreatePurchaseOrderCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { OrderId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
