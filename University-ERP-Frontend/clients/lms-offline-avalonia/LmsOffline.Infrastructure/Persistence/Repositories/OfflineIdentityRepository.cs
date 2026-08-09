namespace LmsOffline.Infrastructure.Persistence.Repositories;

using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Aggregates;

public class OfflineIdentityRepository : IOfflineIdentityRepository
{
    private readonly EncryptedSqliteContext _dbContext;

    public OfflineIdentityRepository(EncryptedSqliteContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<StudentUser?> GetByEmailOrStudentIdAsync(string identifier, CancellationToken cancellationToken = default)
    {
        return await _dbContext.StudentUsers
            .FirstOrDefaultAsync(s => s.Email == identifier || s.StudentIdNumber == identifier || s.Id.ToString() == identifier, cancellationToken);
    }

    public async Task<StudentUser?> GetActiveStudentAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.StudentUsers
            .FirstOrDefaultAsync(s => s.IsActive, cancellationToken);
    }

    public async Task SaveStudentProfileAsync(StudentUser student, CancellationToken cancellationToken = default)
    {
        _dbContext.StudentUsers.Update(student);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task AddAsync(StudentUser student, CancellationToken cancellationToken = default)
    {
        await _dbContext.StudentUsers.AddAsync(student, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(StudentUser student, CancellationToken cancellationToken = default)
    {
        _dbContext.StudentUsers.Update(student);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
