namespace DocumentManagement.Application.Abstractions;

using DocumentManagement.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IDocumentRepository
{
    Task AddAsync(CorporateDocument document, CancellationToken cancellationToken);
}
