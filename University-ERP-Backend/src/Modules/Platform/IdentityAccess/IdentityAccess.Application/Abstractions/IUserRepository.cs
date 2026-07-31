namespace IdentityAccess.Application.Abstractions;

using IdentityAccess.Domain.Aggregates;
using IdentityAccess.Domain.ValueObjects;

/// <summary>
/// Repository interface for User aggregate persistence.
/// </summary>
public interface IUserRepository
{
    Task<User?> GetByIdAsync(UserId id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(Email email, CancellationToken cancellationToken = default);
    Task<bool> IsEmailUniqueAsync(Email email, CancellationToken cancellationToken = default);
    Task AddAsync(User user, CancellationToken cancellationToken = default);
}
