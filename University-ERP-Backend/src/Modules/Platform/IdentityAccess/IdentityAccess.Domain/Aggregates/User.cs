namespace IdentityAccess.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using IdentityAccess.Domain.ValueObjects;
using IdentityAccess.Domain.DomainEvents;

/// <summary>
/// Aggregate root representing an authenticated user account.
/// </summary>
public sealed class User : AggregateRoot<UserId>
{
    public Email Email { get; private set; } = null!;
    public PersonName Name { get; private set; } = null!;
    public string PasswordHash { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }
    public DateTime CreatedOnUtc { get; private set; }

    private User(UserId id, Email email, PersonName name, string passwordHash, DateTime createdOnUtc)
        : base(id)
    {
        Email = email;
        Name = name;
        PasswordHash = passwordHash;
        IsActive = true;
        CreatedOnUtc = createdOnUtc;
    }

    // Required by EF Core
    private User() : base() { }

    public static Result<User> Register(
        UserId id,
        Email email,
        PersonName name,
        string passwordHash,
        DateTime createdOnUtc)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            return Result<User>.Failure(new Error(
                "User.PasswordHashEmpty", 
                "Password hash cannot be empty."));
        }

        var user = new User(id, email, name, passwordHash, createdOnUtc);

        user.RaiseDomainEvent(new UserRegisteredDomainEvent(
            Guid.NewGuid(),
            createdOnUtc,
            user.Id,
            user.Email));

        return Result<User>.Success(user);
    }

    public void Deactivate()
    {
        IsActive = false;
    }
}
