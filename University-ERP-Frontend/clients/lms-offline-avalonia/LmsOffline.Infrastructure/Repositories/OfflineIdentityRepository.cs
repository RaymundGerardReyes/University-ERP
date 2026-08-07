namespace LmsOffline.Infrastructure.Repositories;

using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Infrastructure.Persistence;

public sealed class OfflineIdentityRepository : IOfflineIdentityRepository
{
    private readonly EncryptedSqliteContext _context;

    public OfflineIdentityRepository(EncryptedSqliteContext context)
    {
        _context = context;
    }

    public async Task<StudentUser?> GetByEmailOrStudentIdAsync(string identifier, CancellationToken cancellationToken = default)
    {
        return await _context.Set<StudentUser>()
            .FirstOrDefaultAsync(s => s.Email == identifier || s.StudentIdNumber == identifier, cancellationToken);
    }

    public async Task AddAsync(StudentUser student, CancellationToken cancellationToken = default)
    {
        await _context.Set<StudentUser>().AddAsync(student, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(StudentUser student, CancellationToken cancellationToken = default)
    {
        _context.Set<StudentUser>().Update(student);
        await _context.SaveChangesAsync(cancellationToken);
    }
}