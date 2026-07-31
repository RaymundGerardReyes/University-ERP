namespace IdentityAccess.Domain.ValueObjects;

using SharedKernel.Domain.Primitives;

/// <summary>
/// Immutable email value object with built-in format validation.
/// </summary>
public sealed class Email : ValueObject
{
    public string Value { get; }

    private Email(string value) => Value = value;

    public static Result<Email> Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return Result<Email>.Failure(new Error(
                "Email.Empty", 
                "Email address cannot be empty."));
        }

        string trimmedEmail = email.Trim();
        if (!trimmedEmail.Contains('@') || !trimmedEmail.Contains('.'))
        {
            return Result<Email>.Failure(new Error(
                "Email.InvalidFormat", 
                "Email address format is invalid."));
        }

        return Result<Email>.Success(new Email(trimmedEmail.ToLowerInvariant()));
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}
