namespace Inventory.Presentation.Endpoints;

using Inventory.Application.Features.AdjustStock;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/inventory/stock")]
public sealed class AdjustStockEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public AdjustStockEndpoint(ISender sender) => _sender = sender;

    [HttpPost("{stockItemId:guid}/adjust")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Adjust([FromRoute] Guid stockItemId, [FromBody] AdjustStockRequest payload, CancellationToken cancellationToken)
    {
        var command = new AdjustStockCommand(stockItemId, payload.Amount, payload.Reason);
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok() 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}

public sealed record AdjustStockRequest(int Amount, string Reason);
