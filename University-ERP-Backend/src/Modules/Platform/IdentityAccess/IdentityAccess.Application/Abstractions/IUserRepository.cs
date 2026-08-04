namespace IdentityAccess.Application.Abstractions;

using IdentityAccess.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IUserRepository
{
    Task AddAsync(User user, CancellationToken cancellationToken);
    Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken);
    Task<bool> ExistsWithEmailAsync(string email, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}

