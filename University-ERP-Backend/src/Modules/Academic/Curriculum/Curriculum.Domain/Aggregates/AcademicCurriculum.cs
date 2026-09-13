namespace Curriculum.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;

/// <summary>
/// Represents a versioned academic plan for a program.
/// One program can have multiple curricula (e.g., BSCS 2022 vs. BSCS 2026).
/// Owns a collection of CurriculumSubjects (the join between curriculum and subjects).
/// </summary>
public sealed class AcademicCurriculum : AggregateRoot<Guid>
{
    public Guid ProgramId { get; private set; }
    public string ProgramCode { get; private set; } = string.Empty;     // "BSCS" — denormalized for fast lookup
    public string AcademicYear { get; private set; } = string.Empty;   // "2024-2025"
    public string Version { get; private set; } = string.Empty;        // "1.0"
    public string Status { get; private set; } = "Draft";              // Draft | Active | Archived
    public int TotalUnits { get; private set; }

    private readonly List<CurriculumSubject> _curriculumSubjects = new();
    public IReadOnlyCollection<CurriculumSubject> CurriculumSubjects => _curriculumSubjects.AsReadOnly();

    private AcademicCurriculum() { } // EF Core

    public AcademicCurriculum(
        Guid id,
        Guid programId,
        string programCode,
        string academicYear,
        string version,
        int totalUnits)
        : base(id)
    {
        ProgramId = programId;
        ProgramCode = programCode;
        AcademicYear = academicYear;
        Version = version;
        TotalUnits = totalUnits;
    }

    public void AddSubject(Guid subjectId, string subjectCode, int yearLevel, string semester, int units, bool isElective = false)
    {
        if (_curriculumSubjects.Any(cs => cs.SubjectId == subjectId))
            return;

        _curriculumSubjects.Add(new CurriculumSubject(
            Guid.NewGuid(),
            Id,
            subjectId,
            subjectCode,
            yearLevel,
            semester,
            units,
            isElective));
    }

    public void Publish() => Status = "Active";
    public void Archive() => Status = "Archived";
}

/// <summary>
/// Join entity between AcademicCurriculum and CourseDefinition (Subject).
/// Carries placement metadata: year level, semester, whether the subject is elective.
/// </summary>
public sealed class CurriculumSubject : Entity<Guid>
{
    public Guid CurriculumId { get; private set; }
    public Guid SubjectId { get; private set; }
    public string SubjectCode { get; private set; } = string.Empty;  // Denormalized for query convenience
    public int YearLevel { get; private set; }                       // 1, 2, 3, 4
    public string Semester { get; private set; } = string.Empty;     // "First" | "Second" | "Summer"
    public int Units { get; private set; }
    public bool IsElective { get; private set; }

    private CurriculumSubject() { } // EF Core

    internal CurriculumSubject(
        Guid id,
        Guid curriculumId,
        Guid subjectId,
        string subjectCode,
        int yearLevel,
        string semester,
        int units,
        bool isElective)
        : base(id)
    {
        CurriculumId = curriculumId;
        SubjectId = subjectId;
        SubjectCode = subjectCode;
        YearLevel = yearLevel;
        Semester = semester;
        Units = units;
        IsElective = isElective;
    }
}

