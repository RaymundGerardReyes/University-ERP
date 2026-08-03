namespace IdentityAccess.Application.Features.AuthenticateUser;

using MediatR;
using SharedKernel.Domain.Primitives;

public record AuthenticateUserQuery(string Email, string PasswordHash) : IRequest<Result<AuthResponseDto>>;

public record AuthResponseDto(string Token, UserDto User);

public record UserDto(string Id, string Email, string Name, string Role);
