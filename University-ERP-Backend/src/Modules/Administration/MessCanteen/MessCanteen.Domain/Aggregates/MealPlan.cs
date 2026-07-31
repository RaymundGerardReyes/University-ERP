namespace MessCanteen.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class MealPlan : AggregateRoot<Guid>
{
    public string PlanName { get; private set; } = string.Empty;
    public decimal DailyCost { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedOnUtc { get; private set; }

    private MealPlan() { }

    private MealPlan(Guid id, string planName, decimal dailyCost) : base(id)
    {
        PlanName = planName;
        DailyCost = dailyCost;
        IsActive = true;
        CreatedOnUtc = DateTime.UtcNow;
    }

    public static Result<MealPlan> Create(string planName, decimal dailyCost)
    {
        if (string.IsNullOrWhiteSpace(planName))
        {
            return Result<MealPlan>.Failure(new Error("MessCanteen.InvalidPlan", "Plan name is required."));
        }

        return Result<MealPlan>.Success(new MealPlan(Guid.NewGuid(), planName, dailyCost));
    }
}
