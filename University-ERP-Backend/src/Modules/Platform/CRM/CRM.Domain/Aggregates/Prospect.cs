namespace CRM.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class Prospect : AggregateRoot<Guid>
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Source { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public DateTime CapturedOnUtc { get; private set; }

    private Prospect() { }

    private Prospect(Guid id, string firstName, string lastName, string email, string source) : base(id)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Source = source;
        Status = "New";
        CapturedOnUtc = DateTime.UtcNow;
    }

    public static Result<Prospect> Register(string firstName, string lastName, string email, string source)
    {
        if (string.IsNullOrWhiteSpace(email))
            return Result<Prospect>.Failure(new Error("CRM.InvalidEmail", "Email is required."));
            
        if (string.IsNullOrWhiteSpace(firstName))
            return Result<Prospect>.Failure(new Error("CRM.InvalidName", "First name is required."));

        return Result<Prospect>.Success(new Prospect(Guid.NewGuid(), firstName, lastName, email, source));
    }
}
