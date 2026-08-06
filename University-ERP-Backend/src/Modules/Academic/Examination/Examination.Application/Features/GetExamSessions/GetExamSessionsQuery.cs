namespace Examination.Application.Features.GetExamSessions;

using MediatR;
using SharedKernel.Domain.Primitives;
using System.Collections.Generic;

public record GetExamSessionsQuery : IRequest<Result<IReadOnlyList<ExamSessionDto>>>;

public record ExamSessionDto(string Id, string AssessmentId, string RoomNumber, string InvigilatorId, System.DateTime StartTimeUtc, IReadOnlyCollection<string> Incidents);
