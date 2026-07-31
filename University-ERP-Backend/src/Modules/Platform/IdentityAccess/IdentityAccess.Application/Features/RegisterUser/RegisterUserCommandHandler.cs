namespace IdentityAccess.Application.Features.RegisterUser;

using MediatR;
using SharedKernel.Domain.Primitives;
using IdentityAccess.Domain.Aggregates;
using IdentityAccess.Domain.ValueObjects;
using IdentityAccess.Application.Abstractions;

/// <summary>
/// Handles execution of the RegisterUserCommand.
/// </summary>
public sealed class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Result<UserId>>
{
    private readonly IUserRepository _userRepository;

    public RegisterUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<UserId>> Handle(
        RegisterUserCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Create and validate Email Value Object
        var emailResult = Email.Create(request.Email);
        if (emailResult.IsFailure)
        {
            return Result<UserId>.Failure(emailResult.Error);
        }

        // 2. Create and validate PersonName Value Object
        var nameResult = PersonName.Create(request.FirstName, request.LastName);
        if (nameResult.IsFailure)
        {
            return Result<UserId>.Failure(nameResult.Error);
        }

        // 3. Ensure email uniqueness across the system
        bool isUnique = await _userRepository.IsEmailUniqueAsync(emailResult.Value, cancellationToken);
        if (!isUnique)
        {
            return Result<UserId>.Failure(new Error(
                "User.EmailAlreadyInUse", 
                "The specified email address is already registered."));
        }

        // 4. Password hashing stub (will be replaced by IPasswordHasher)
        string dummyPasswordHash = $"hashed_{request.Password}";

        // 5. Instantiate User Aggregate Root
        var userId = UserId.CreateUnique();
        var userResult = User.Register(
            userId,
            emailResult.Value,
            nameResult.Value,
            dummyPasswordHash,
            DateTime.UtcNow);

        if (userResult.IsFailure)
        {
            return Result<UserId>.Failure(userResult.Error);
        }

        // 6. Persist Aggregate
        await _userRepository.AddAsync(userResult.Value, cancellationToken);

        return Result<UserId>.Success(userResult.Value.Id);
    }
}
