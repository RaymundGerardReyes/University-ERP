using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Academic.Application.Features.Registrar.GetValidationQueue;
using Academic.Application.Features.Registrar.GetPendingClearances;

namespace Academic.Presentation.Endpoints
{
    [ApiController]
    [Route("api/v1/academic/registrar")]
    public class RegistrarController : ControllerBase
    {
        private readonly ISender _sender;

        public RegistrarController(ISender sender) => _sender = sender;

        [HttpGet("enrollment/validation-queue")]
        public async Task<IActionResult> GetValidationQueue(CancellationToken cancellationToken)
        {
            var result = await _sender.Send(new GetEnrollmentValidationQueueQuery(), cancellationToken);
            return Ok(result);
        }

        [HttpGet("clearances/pending")]
        public async Task<IActionResult> GetPendingClearances(CancellationToken cancellationToken)
        {
            var result = await _sender.Send(new GetPendingClearancesQuery(), cancellationToken);
            return Ok(result);
        }

        [HttpGet("certifications/transcript-requests")]
        public IActionResult GetTranscriptRequests() => Ok(new List<object>());

        [HttpGet("records/official-grades")]
        public IActionResult GetOfficialGrades() => Ok(new List<object>());

        [HttpGet("curriculum/catalog")]
        public IActionResult GetSubjectCatalog() => Ok(new List<object>());

        [HttpGet("graduation/candidates")]
        public IActionResult GetGraduationCandidates() => Ok(new List<object>());

        [HttpGet("security/audit-logs")]
        public IActionResult GetAuditLogs() => Ok(new List<object>());
    }
}
