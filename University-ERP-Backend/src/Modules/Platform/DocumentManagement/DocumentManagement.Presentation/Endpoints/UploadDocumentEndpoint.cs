namespace DocumentManagement.Presentation.Endpoints;

using DocumentManagement.Application.Features.UploadDocument;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/platform/documents")]
public sealed class UploadDocumentEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public UploadDocumentEndpoint(ISender sender) => _sender = sender;

    [HttpPost("upload")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Upload([FromBody] UploadDocumentCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        
        return result.IsSuccess 
            ? Ok(new { DocumentId = result.Value }) 
            : BadRequest(new { code = result.Error.Code, message = result.Error.Description });
    }
}
