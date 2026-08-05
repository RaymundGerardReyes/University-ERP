namespace Communication.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Communication.Application.Abstractions;
using Communication.Domain.Aggregates;
using Communication.Infrastructure.Persistence;

public sealed class CommunicationRepository : ICommunicationRepository
{
    private readonly CommunicationDbContext _dbContext;

    public CommunicationRepository(CommunicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Directly supports your SendMessageCommand
    public async Task AddAsync(DirectMessage message, CancellationToken cancellationToken = default)
    {
        await _dbContext.DirectMessages.AddAsync(message, cancellationToken);
    }

    public async Task<IReadOnlyList<DirectMessage>> GetByReceiverIdAsync(string receiverId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.DirectMessages
            .AsNoTracking()
            .Where(m => m.ReceiverId == receiverId)
            .OrderByDescending(m => m.SentOnUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}