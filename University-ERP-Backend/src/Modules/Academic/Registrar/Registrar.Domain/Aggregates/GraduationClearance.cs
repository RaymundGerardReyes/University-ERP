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
    public decimal CumulativeGPA { get; private set; }
    public string LatinHonors { get; private set; } = "None";

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

    public Result<string> ComputeLatinHonors(decimal finalGpa)
    {
        if (ClearanceStatus != "Cleared_For_Graduation")
        {
            return Result<string>.Failure(new Error("Registrar.NotCleared", "Cannot compute honors for an uncleared student."));
        }

        CumulativeGPA = finalGpa;

        if (finalGpa <= 1.20m)
        {
            LatinHonors = "Summa Cum Laude";
        }
        else if (finalGpa <= 1.45m)
        {
            LatinHonors = "Magna Cum Laude";
        }
        else if (finalGpa <= 1.75m)
        {
            LatinHonors = "Cum Laude";
        }
        else
        {
            LatinHonors = "None";
        }

        return Result<string>.Success($"Successfully computed honors: {LatinHonors}");
    }
}