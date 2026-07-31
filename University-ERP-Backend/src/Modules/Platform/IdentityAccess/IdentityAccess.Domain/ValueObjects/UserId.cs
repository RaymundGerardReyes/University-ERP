namespace IdentityAccess.Domain.ValueObjects;

using SharedKernel.Domain.Primitives;

/// <summary>
/// Strongly-typed identifier for a User aggregate root.
/// </summary>
public sealed class UserId : ValueObject
{
    public Guid Value { get; }

    private UserId(Guid value) => Value = value;

    public static UserId CreateUnique() => new(Guid.NewGuid());
    public static UserId From(Guid value) => new(value);

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}
