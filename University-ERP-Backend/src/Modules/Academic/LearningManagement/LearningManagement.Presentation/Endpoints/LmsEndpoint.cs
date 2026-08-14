namespace LearningManagement.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LearningManagement.Application.Features.GetCourseContent;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/lms")]
public sealed class LmsEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public LmsEndpoint(ISender sender) => _sender = sender;

    [HttpGet("courses/{sectionId}/content")]
    [ProducesResponseType(typeof(CourseContentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCourseContent([FromRoute] string sectionId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetCourseContentQuery(sectionId), cancellationToken);
        
        if (result == null)
            return NotFound(new { message = "Course syllabus not found for this section." });

        return Ok(result);
    }

    [HttpPost("courses/{sectionId}/syllabus")]
    public async Task<IActionResult> CreateSyllabus([FromRoute] string sectionId, [FromBody] LearningManagement.Application.Features.CreateSyllabus.CreateSyllabusCommand command, CancellationToken cancellationToken)
    {
        if (sectionId != command.SectionId) return BadRequest();
        var result = await _sender.Send(command, cancellationToken);
        return result.IsSuccess ? Ok(result) : BadRequest(result.Error);
    }

    [HttpPost("courses/{sectionId}/modules")]
    public async Task<IActionResult> AddModule([FromRoute] string sectionId, [FromBody] LearningManagement.Application.Features.AddLearningModule.AddLearningModuleCommand command, CancellationToken cancellationToken)
    {
        if (sectionId != command.SectionId) return BadRequest();
        var result = await _sender.Send(command, cancellationToken);
        return result.IsSuccess ? Ok(result) : BadRequest(result.Error);
    }

    [HttpPost("courses/{sectionId}/modules/{moduleId}/content")]
    public async Task<IActionResult> AddContent([FromRoute] string sectionId, [FromRoute] string moduleId, [FromBody] LearningManagement.Application.Features.AddContentItem.AddContentItemCommand command, CancellationToken cancellationToken)
    {
        if (sectionId != command.SectionId || moduleId != command.ModuleId) return BadRequest();
        var result = await _sender.Send(command, cancellationToken);
        return result.IsSuccess ? Ok(result) : BadRequest(result.Error);
    }
}
