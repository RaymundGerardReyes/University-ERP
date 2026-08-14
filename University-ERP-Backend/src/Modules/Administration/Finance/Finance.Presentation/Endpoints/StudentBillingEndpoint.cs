namespace Finance.Presentation.Endpoints;

using Finance.Application.Features.StudentBilling.GetStudentBillings;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/billings")]
public sealed class StudentBillingEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public StudentBillingEndpoint(ISender sender) => _sender = sender;

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<StudentBillingDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllBillings(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAllStudentBillingsQuery(), cancellationToken);
        return Ok(result);
    }
}
