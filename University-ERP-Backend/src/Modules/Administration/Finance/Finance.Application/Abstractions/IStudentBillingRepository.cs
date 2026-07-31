namespace Finance.Application.Abstractions;

using Finance.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IStudentBillingRepository
{
    Task AddAsync(StudentBilling billing, CancellationToken cancellationToken);
}
