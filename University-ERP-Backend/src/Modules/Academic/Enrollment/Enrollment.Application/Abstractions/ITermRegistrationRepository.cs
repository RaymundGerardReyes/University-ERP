namespace Enrollment.Application.Abstractions;

using Enrollment.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

using System.Collections.Generic;

public interface ITermRegistrationRepository
{
    Task<IReadOnlyList<TermRegistration>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TermRegistration?> GetActiveRegistrationAsync(string studentId, CancellationToken cancellationToken = default);
    Task AddAsync(TermRegistration registration, CancellationToken cancellationToken = default);
    Task UpdateAsync(TermRegistration registration, CancellationToken cancellationToken = default);
}
