namespace IdentityAccess.Application.Features.RegisterUser;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;

/// <summary>
/// CQRS Command to register a new user in the identity system.
/// </summary>
public sealed record RegisterUserCommand(
    string Email,
    string FirstName,
    string LastName,
    string Password
) : IRequest<Result<Guid>>;
