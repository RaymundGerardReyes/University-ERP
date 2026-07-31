namespace Library.Presentation.Endpoints;

using Library.Application.Features.CheckoutItem;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/library/catalog")]
public sealed class CheckoutItemEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public CheckoutItemEndpoint(ISender sender) => _sender = sender;

    [HttpPost("{itemId:guid}/checkout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Checkout([FromRoute] Guid itemId, [FromBody] CheckoutItemRequest payload, CancellationToken cancellationToken)
    {
        var command = new CheckoutItemCommand(itemId, payload.BorrowerId);
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok() 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}

public sealed record CheckoutItemRequest(Guid BorrowerId);
