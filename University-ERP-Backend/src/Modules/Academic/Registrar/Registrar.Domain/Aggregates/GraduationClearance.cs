namespace Registrar.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class GraduationClearance : AggregateRoot<Guid>
{
    public Guid StudentId { get; private set; }
    public string DegreeProgram { get; private set; } = string.Empty;
    public bool AcademicRequirementsMet { get; private set; }
    public bool FinancialObligationsCleared { get; private set; }
    public string ClearanceStatus { get; private set; } = string.Empty;

    private GraduationClearance() { }

    private GraduationClearance(Guid id, Guid studentId, string degreeProgram) : base(id)
    {
        StudentId = studentId;
        DegreeProgram = degreeProgram;
        AcademicRequirementsMet = false;
        FinancialObligationsCleared = false;
        ClearanceStatus = "Pending";
    }

    public static Result<GraduationClearance> Initiate(Guid studentId, string degreeProgram)
    {
        return Result<GraduationClearance>.Success(new GraduationClearance(Guid.NewGuid(), studentId, degreeProgram));
    }

    public Result<bool> EvaluateClearance(bool hasRequiredCredits, bool hasZeroBalance)
    {
        AcademicRequirementsMet = hasRequiredCredits;
        FinancialObligationsCleared = hasZeroBalance;

        if (AcademicRequirementsMet && FinancialObligationsCleared)
        {
            ClearanceStatus = "Cleared_For_Graduation";
            return Result<bool>.Success(true);
        }

        ClearanceStatus = "Deficient";
        return Result<bool>.Failure(new Error("Registrar.ClearanceFailed", "Student has outstanding academic or financial deficiencies."));
    }
}