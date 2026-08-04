namespace DocumentManagement.Presentation.Endpoints;

using DocumentManagement.Application.Features.GetFacultyDocuments;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/documents")] // Bridging Platform logic to the Academic routing namespace
public sealed class AcademicDocumentsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public AcademicDocumentsEndpoint(ISender sender) => _sender = sender;

    [HttpGet("{facultyId}")]
    [ProducesResponseType(typeof(IReadOnlyList<FacultyDocumentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDocuments([FromRoute] string facultyId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetFacultyDocumentsQuery(facultyId), cancellationToken);
        return Ok(result);
    }
}