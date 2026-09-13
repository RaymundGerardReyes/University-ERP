namespace Curriculum.Presentation.Endpoints;

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Curriculum.Application.Features.GetAllCourses;
using Curriculum.Application.Features.GetAllPrograms;
using Curriculum.Application.Features.GetCurriculumByProgram;
using Curriculum.Application.Features.UpdateMasterData;
using Curriculum.Application.Features.UpdatePrerequisite;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/academic/registrar/curriculum")]
public sealed class CurriculumEndpoint : ControllerBase
{
    private readonly ISender _sender;

    public CurriculumEndpoint(ISender sender) => _sender = sender;

    // ─── Subject Catalog (existing) ───────────────────────────────────────────

    [HttpGet("catalog")]
    [ProducesResponseType(typeof(IReadOnlyList<CourseCatalogDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSubjectCatalog(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAllCoursesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPost("catalog/{courseId}")]
    public async Task<IActionResult> UpdateMasterData(
        [FromRoute] string courseId,
        [FromBody] UpdateCourseMasterDataCommand command,
        CancellationToken cancellationToken)
    {
        if (courseId != command.CourseId) return BadRequest();
        var result = await _sender.Send(command, cancellationToken);
        return result.IsSuccess
            ? Ok(result)
            : BadRequest(new { error = result.Error.Code, message = result.Error.Description });
    }

    [HttpPost("prerequisites/{courseId}/{ruleId}/enforcement")]
    public async Task<IActionResult> TogglePrerequisite(
        [FromRoute] string courseId,
        [FromRoute] string ruleId,
        [FromBody] bool isEnforced,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new UpdatePrerequisiteEnforcementCommand(courseId, ruleId, isEnforced), cancellationToken);
        return result.IsSuccess
            ? Ok(result)
            : BadRequest(new { error = result.Error.Code, message = result.Error.Description });
    }

    // ─── Academic Programs (new) ───────────────────────────────────────────────

    /// <summary>GET /api/v1/academic/registrar/curriculum/programs — Returns all academic programs.</summary>
    [HttpGet("programs")]
    [ProducesResponseType(typeof(IReadOnlyList<AcademicProgramDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllPrograms(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAllProgramsQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>GET /api/v1/academic/registrar/curriculum/programs/{programCode} — Returns full curriculum for a program.</summary>
    [HttpGet("programs/{programCode}")]
    [ProducesResponseType(typeof(ProgramCurriculumDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurriculumByProgram(
        [FromRoute] string programCode,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetCurriculumByProgramQuery(programCode), cancellationToken);
        return result.IsSuccess
            ? Ok(result.Value)
            : NotFound(new { error = result.Error.Code, message = result.Error.Description });
    }
}
