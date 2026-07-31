namespace IdentityAccess.Application.Abstractions;

using IdentityAccess.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IUserRepository
{
    Task AddAsync(User user, CancellationToken cancellationToken);
}
