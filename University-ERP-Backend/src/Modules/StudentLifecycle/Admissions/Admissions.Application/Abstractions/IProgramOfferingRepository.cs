namespace Admissions.Application.Abstractions;

using Admissions.Domain.Aggregates;

public interface IProgramOfferingRepository
{
    Task<IReadOnlyList<ProgramOffering>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProgramOffering?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
}
