namespace StudentInformation.Domain.ValueObjects;

using SharedKernel.Domain.Primitives;

/// <summary>
/// Strongly-typed identifier for the Student aggregate root.
/// </summary>
public sealed class StudentId : ValueObject
{
    public Guid Value { get; }

    private StudentId(Guid value) => Value = value;

    public static StudentId CreateUnique() => new(Guid.NewGuid());
    public static StudentId From(Guid value) => new(value);

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}
