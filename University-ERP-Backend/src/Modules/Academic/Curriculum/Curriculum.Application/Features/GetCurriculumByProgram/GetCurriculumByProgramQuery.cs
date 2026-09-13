namespace Curriculum.Application.Features.GetCurriculumByProgram;

using MediatR;
using Curriculum.Application.Abstractions;
using SharedKernel.Domain.Primitives;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// ─── DTOs ────────────────────────────────────────────────────────────────────

public sealed record CurriculumSubjectDto(
    string SubjectId,
    string Code,
    string Title,
    int Units,
    string Department,
    string SubjectType,         // "Core" | "GE" | "PE" | "NSTP" | "Professional" | "Elective"
    bool IsElective,
    IReadOnlyList<string> PrerequisiteCodes);

public sealed record CurriculumSemesterDto(
    string Semester,            // "First" | "Second" | "Summer"
    int TotalUnits,
    IReadOnlyList<CurriculumSubjectDto> Subjects);

public sealed record CurriculumYearDto(
    int YearLevel,
    IReadOnlyList<CurriculumSemesterDto> Semesters);

public sealed record ProgramCurriculumDto(
    string CurriculumId,
    string ProgramId,
    string ProgramCode,
    string ProgramName,
    string AcademicYear,
    string Version,
    string Status,
    int TotalUnits,
    IReadOnlyList<CurriculumYearDto> Years);

// ─── Query & Handler ──────────────────────────────────────────────────────────

public sealed record GetCurriculumByProgramQuery(string ProgramCode)
    : IRequest<Result<ProgramCurriculumDto>>;

public sealed class GetCurriculumByProgramQueryHandler
    : IRequestHandler<GetCurriculumByProgramQuery, Result<ProgramCurriculumDto>>
{
    private readonly IAcademicProgramRepository _programRepo;
    private readonly ICurriculumPlanRepository _curriculumRepo;
    private readonly ICourseDefinitionRepository _courseRepo;

    public GetCurriculumByProgramQueryHandler(
        IAcademicProgramRepository programRepo,
        ICurriculumPlanRepository curriculumRepo,
        ICourseDefinitionRepository courseRepo)
    {
        _programRepo = programRepo;
        _curriculumRepo = curriculumRepo;
        _courseRepo = courseRepo;
    }

    public async Task<Result<ProgramCurriculumDto>> Handle(
        GetCurriculumByProgramQuery request,
        CancellationToken cancellationToken)
    {
        var program = await _programRepo.GetByCodeAsync(request.ProgramCode, cancellationToken);
        if (program is null)
            return Result<ProgramCurriculumDto>.Failure(
                new Error("Program.NotFound", $"Program '{request.ProgramCode}' was not found."));

        var curriculum = await _curriculumRepo.GetActiveByProgramCodeAsync(program.Code, cancellationToken);
        if (curriculum is null)
            return Result<ProgramCurriculumDto>.Failure(
                new Error("Curriculum.NotFound", $"No active curriculum found for program '{program.Code}'."));

        // Load all course definitions once for O(1) lookup
        var allCourses = await _courseRepo.GetAllAsync(cancellationToken);
        var courseMap = allCourses.ToDictionary(c => c.Id);

        // Build the Year → Semester → Subjects hierarchy
        var yearGroups = curriculum.CurriculumSubjects
            .GroupBy(cs => cs.YearLevel)
            .OrderBy(g => g.Key);

        var years = new List<CurriculumYearDto>();

        foreach (var yearGroup in yearGroups)
        {
            var semesterGroups = yearGroup
                .GroupBy(cs => cs.Semester)
                .OrderBy(g => SemesterOrder(g.Key));

            var semesters = new List<CurriculumSemesterDto>();

            foreach (var semGroup in semesterGroups)
            {
                var subjects = semGroup
                    .Select(cs =>
                    {
                        courseMap.TryGetValue(cs.SubjectId, out var course);
                        var prereqCodes = course?.Prerequisites
                            .Select(p => p.RequiredCourseCode)
                            .ToList() ?? new List<string>();

                        return new CurriculumSubjectDto(
                            cs.SubjectId.ToString(),
                            cs.SubjectCode,
                            course?.Title ?? cs.SubjectCode,
                            cs.Units,
                            course?.Department ?? "",
                            course?.Status ?? "Active",     // repurposing Status as SubjectType from seed
                            cs.IsElective,
                            prereqCodes);
                    })
                    .ToList();

                semesters.Add(new CurriculumSemesterDto(
                    semGroup.Key,
                    subjects.Sum(s => s.Units),
                    subjects));
            }

            years.Add(new CurriculumYearDto(yearGroup.Key, semesters));
        }

        return Result<ProgramCurriculumDto>.Success(new ProgramCurriculumDto(
            curriculum.Id.ToString(),
            program.Id.ToString(),
            program.Code,
            program.Name,
            curriculum.AcademicYear,
            curriculum.Version,
            curriculum.Status,
            curriculum.TotalUnits,
            years));
    }

    private static int SemesterOrder(string semester) => semester switch
    {
        "First" => 1,
        "Second" => 2,
        "Summer" => 3,
        _ => 99
    };
}

