namespace LmsOffline.Infrastructure.Repositories;

using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Application.Interfaces;
using LmsOffline.Infrastructure.Data;

public sealed class OfflineModuleRepository : IOfflineModuleRepository
{
    private readonly EncryptedSqliteContext _context;

    public OfflineModuleRepository(EncryptedSqliteContext context)
    {
        _context = context;
    }

    public async Task AddAsync(OfflineModule module, CancellationToken cancellationToken = default)
    {
        await _context.Modules.AddAsync(module, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<OfflineModule?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Modules.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }
}
