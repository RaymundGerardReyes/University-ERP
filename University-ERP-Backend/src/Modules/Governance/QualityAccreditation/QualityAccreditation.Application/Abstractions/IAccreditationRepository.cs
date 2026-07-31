namespace QualityAccreditation.Application.Abstractions;

using QualityAccreditation.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IAccreditationRepository
{
    Task AddAsync(AccreditationEvidence evidence, CancellationToken cancellationToken);
}
