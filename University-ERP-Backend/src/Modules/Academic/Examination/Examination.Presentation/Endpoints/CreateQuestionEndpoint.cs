namespace Examination.Presentation.Endpoints;

using Examination.Application.Features.CreateQuestion;
using MediatR;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/examination/questions")]
public sealed class CreateQuestionEndpoint : ControllerBase
{
    private readonly ISender _sender;
    public CreateQuestionEndpoint(ISender sender) => _sender = sender;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateQuestionCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return result.IsSuccess ? Ok(new { QuestionId = result.Value }) : BadRequest(result.Error);
    }
}