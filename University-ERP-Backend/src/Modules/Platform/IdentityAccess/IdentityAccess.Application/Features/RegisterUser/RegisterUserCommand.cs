namespace IdentityAccess.Application.Features.RegisterUser;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using IdentityAccess.Domain.Aggregates;
using IdentityAccess.Application.Abstractions;

public sealed record RegisterUserCommand(string Email, string FirstName, string LastName, string PasswordHash) : IRequest<Result<Guid>>;

public sealed class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Result<Guid>>
{
    private readonly IUserRepository _repository;

    public RegisterUserCommandHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var userResult = User.Register(
            request.Email, 
            request.FirstName, 
            request.LastName, 
            request.PasswordHash);

        if (userResult.IsFailure)
        {
            return Result<Guid>.Failure(userResult.Error);
        }

        await _repository.AddAsync(userResult.Value, cancellationToken);
        return Result<Guid>.Success(userResult.Value.Id);
    }
}
