namespace GrievanceManagement.Application.Abstractions;

using GrievanceManagement.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IGrievanceRepository
{
    Task AddAsync(Complaint complaint, CancellationToken cancellationToken);
}
