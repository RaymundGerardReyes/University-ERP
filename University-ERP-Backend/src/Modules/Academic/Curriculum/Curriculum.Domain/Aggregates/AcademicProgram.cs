namespace Curriculum.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

/// <summary>
/// Represents a degree-granting academic program (e.g., BSCS, BSA, BSIT).
/// This is the top-level academic unit that owns one or more versioned Curricula.
/// </summary>
public sealed class AcademicProgram : AggregateRoot<Guid>
{
    public string Code { get; private set; } = string.Empty;           // "BSCS"
    public string Name { get; private set; } = string.Empty;           // "Bachelor of Science in Computer Science"
    public string College { get; private set; } = string.Empty;        // "College of Computer Studies"
    public int TotalUnits { get; private set; }                        // 145
    public int YearsToComplete { get; private set; }                   // 4
    public bool IsActive { get; private set; } = true;

    private AcademicProgram() { } // EF Core

    public AcademicProgram(Guid id, string code, string name, string college, int totalUnits, int yearsToComplete)
        : base(id)
    {
        Code = code;
        Name = name;
        College = college;
        TotalUnits = totalUnits;
        YearsToComplete = yearsToComplete;
    }

    public void Deactivate() => IsActive = false;
    public void Activate() => IsActive = true;

    public void UpdateDetails(string name, string college, int totalUnits)
    {
        Name = name;
        College = college;
        TotalUnits = totalUnits;
    }
}

