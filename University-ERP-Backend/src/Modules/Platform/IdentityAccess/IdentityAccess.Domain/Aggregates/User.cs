namespace IdentityAccess.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class User : AggregateRoot<Guid>
{
    public string Email { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }
    public DateTime CreatedOnUtc { get; private set; }

    private User() { }

    private User(Guid id, string email, string firstName, string lastName, string passwordHash) : base(id)
    {
        Email = email;
        FirstName = firstName;
        LastName = lastName;
        PasswordHash = passwordHash;
        IsActive = true;
        CreatedOnUtc = DateTime.UtcNow;
    }

    public static Result<User> Register(string email, string firstName, string lastName, string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(email))
            return Result<User>.Failure(new Error("User.InvalidEmail", "Email is required."));
            
        if (string.IsNullOrWhiteSpace(passwordHash))
            return Result<User>.Failure(new Error("User.InvalidPassword", "Password hash cannot be empty."));

        return Result<User>.Success(new User(Guid.NewGuid(), email, firstName, lastName, passwordHash));
    }

    public void Deactivate()
    {
        IsActive = false;
    }
}
