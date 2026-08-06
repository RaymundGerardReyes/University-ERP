namespace Finance.Application.Abstractions;

using Finance.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IStudentBillingRepository
{
    Task AddAsync(StudentBilling billing, CancellationToken cancellationToken);
    Task<StudentBilling?> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken);
    Task<System.Collections.Generic.IReadOnlyList<StudentBilling>> GetAllAsync(CancellationToken cancellationToken);
    Task UpdateAsync(StudentBilling billing, CancellationToken cancellationToken);
}
