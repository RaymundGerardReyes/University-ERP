namespace Contracts.PublicApiContracts.Academic;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Open Host Service contract exposed by the Examination Bounded Context.
/// Used synchronously by Student Portal and Registrar to view final grades.
/// </summary>
public interface IExaminationResultQueryApi
{
    Task<StudentSemesterResultDto> GetSemesterResultsAsync(Guid studentId, string semesterCode, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<CourseResultDto>> GetHistoricalResultsAsync(Guid studentId, CancellationToken cancellationToken = default);
}

public sealed record StudentSemesterResultDto(
    Guid StudentId,
    string SemesterCode,
    double Gpa,
    IReadOnlyCollection<CourseResultDto> Courses
);

public sealed record CourseResultDto(
    string CourseCode,
    string CourseName,
    int Credits,
    string Grade,
    bool Passed
);
