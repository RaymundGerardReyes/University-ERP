namespace IdentityAccess.Application.Features.RegisterUser;

using MediatR;
using SharedKernel.Domain.Primitives;
using IdentityAccess.Domain.ValueObjects;

/// <summary>
/// CQRS Command to register a new system user.
/// Returns a Result containing the generated UserId upon success.
/// </summary>
public sealed record RegisterUserCommand(
    string Email,
    string FirstName,
    string LastName,
    string Password
) : IRequest<Result<UserId>>;
