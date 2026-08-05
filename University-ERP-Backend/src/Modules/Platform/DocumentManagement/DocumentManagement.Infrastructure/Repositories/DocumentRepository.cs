namespace DocumentManagement.Infrastructure.Repositories;

using System.Threading;
using System.Threading.Tasks;
using DocumentManagement.Application.Abstractions;
using DocumentManagement.Domain.Aggregates;
using DocumentManagement.Infrastructure.Persistence;

public sealed class DocumentRepository : IDocumentRepository
{
    private readonly DocumentManagementDbContext _dbContext;

    public DocumentRepository(DocumentManagementDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(CorporateDocument document, CancellationToken cancellationToken = default)
    {
        await _dbContext.Documents.AddAsync(document, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}