namespace IdentityAccess.Infrastructure.Repositories;

using IdentityAccess.Application.Abstractions;
using IdentityAccess.Domain.Aggregates;
using IdentityAccess.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

public sealed class UserRepository(IdentityAccessDbContext dbContext) : IUserRepository
{
    public async Task AddAsync(User user, CancellationToken cancellationToken)
        => await dbContext.Users.AddAsync(user, cancellationToken);

    public async Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken)
        => await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

    public async Task<bool> ExistsWithEmailAsync(string email, CancellationToken cancellationToken)
        => await dbContext.Users.AnyAsync(u => u.Email == email, cancellationToken);

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
        => await dbContext.SaveChangesAsync(cancellationToken);
}
