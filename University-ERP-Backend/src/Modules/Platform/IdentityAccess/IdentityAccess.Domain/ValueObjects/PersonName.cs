namespace IdentityAccess.Domain.ValueObjects;

using SharedKernel.Domain.Primitives;

/// <summary>
/// Encapsulates a person's name components.
/// </summary>
public sealed class PersonName : ValueObject
{
    public string FirstName { get; }
    public string LastName { get; }

    private PersonName(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    public static Result<PersonName> Create(string firstName, string lastName)
    {
        if (string.IsNullOrWhiteSpace(firstName))
        {
            return Result<PersonName>.Failure(new Error(
                "PersonName.FirstNameEmpty", 
                "First name is required."));
        }

        if (string.IsNullOrWhiteSpace(lastName))
        {
            return Result<PersonName>.Failure(new Error(
                "PersonName.LastNameEmpty", 
                "Last name is required."));
        }

        return Result<PersonName>.Success(new PersonName(firstName.Trim(), lastName.Trim()));
    }

    public string FullName => $"{FirstName} {LastName}";

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return FirstName;
        yield return LastName;
    }
}
