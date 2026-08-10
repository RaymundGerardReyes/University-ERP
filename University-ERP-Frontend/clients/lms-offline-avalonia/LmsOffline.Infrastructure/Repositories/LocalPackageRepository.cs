namespace LmsOffline.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Application.Interfaces;
using LmsOffline.Infrastructure.Persistence;

public sealed class LocalPackageRepository : ILocalPackageRepository
{
    private readonly EncryptedSqliteContext _context;

    public LocalPackageRepository(EncryptedSqliteContext context)
    {
        _context = context;
    }

    public async Task<List<CoursePackage>> GetAllInstalledAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Packages.ToListAsync(cancellationToken);
    }

    public async Task<CoursePackage?> GetByCourseCodeAsync(string courseCode, CancellationToken cancellationToken = default)
    {
        return await _context.Packages.FirstOrDefaultAsync(p => p.CourseCode == courseCode, cancellationToken);
    }

    public async Task AddAsync(CoursePackage package, CancellationToken cancellationToken = default)
    {
        await _context.Packages.AddAsync(package, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
