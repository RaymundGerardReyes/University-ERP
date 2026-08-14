namespace Curriculum.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;

public sealed class CourseDefinition : AggregateRoot<Guid>
{
    public string Code { get; private set; } = string.Empty;
    public string Title { get; private set; } = string.Empty;
    public int Units { get; private set; }
    public string Department { get; private set; } = string.Empty;
    public string Status { get; private set; } = "Active"; // "Active" or "Inactive"
    public string Description { get; private set; } = string.Empty;

    private readonly List<PrerequisiteRule> _prerequisites = new();
    public IReadOnlyCollection<PrerequisiteRule> Prerequisites => _prerequisites.AsReadOnly();

    private CourseDefinition() { } // EF Core

    public CourseDefinition(Guid id, string code, string title, int units, string department, string description) : base(id)
    {
        Code = code;
        Title = title;
        Units = units;
        Department = department;
        Description = description;
    }

    public void UpdateMasterData(string title, int units, string status, string description)
    {
        Title = title;
        Units = units;
        Status = status;
        Description = description;
    }

    public void AddPrerequisite(string requiredCourseCode, string minimumGrade, bool isEnforced)
    {
        if (!_prerequisites.Any(p => p.RequiredCourseCode == requiredCourseCode))
        {
            _prerequisites.Add(new PrerequisiteRule(Guid.NewGuid(), requiredCourseCode, minimumGrade, isEnforced));
        }
    }

    public Result<bool> TogglePrerequisiteEnforcement(string ruleId, bool isEnforced)
    {
        var rule = _prerequisites.FirstOrDefault(p => p.Id.ToString() == ruleId);
        if (rule == null)
        {
            return Result<bool>.Failure(new Error("Prerequisite.NotFound", "The specified prerequisite rule was not found."));
        }

        rule.UpdateEnforcement(isEnforced);
        return Result<bool>.Success(true);
    }
}

public sealed class PrerequisiteRule : Entity<Guid>
{
    public string RequiredCourseCode { get; private set; } = string.Empty;
    public string MinimumGrade { get; private set; } = string.Empty;
    public bool IsEnforced { get; private set; }

    private PrerequisiteRule() { } // EF Core

    internal PrerequisiteRule(Guid id, string requiredCourseCode, string minimumGrade, bool isEnforced) : base(id)
    {
        RequiredCourseCode = requiredCourseCode;
        MinimumGrade = minimumGrade;
        IsEnforced = isEnforced;
    }

    internal void UpdateEnforcement(bool isEnforced)
    {
        IsEnforced = isEnforced;
    }
}
