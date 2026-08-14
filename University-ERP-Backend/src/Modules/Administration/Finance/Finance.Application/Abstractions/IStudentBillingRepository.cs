namespace Finance.Application.Abstractions;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Finance.Domain.Aggregates;

public interface IStudentBillingRepository
{
    Task AddAsync(StudentBilling billing, CancellationToken cancellationToken = default);
    Task<StudentBilling?> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task<StudentBilling?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default); 
    Task<IReadOnlyList<StudentBilling>> GetAllAsync(CancellationToken cancellationToken = default);
    Task UpdateAsync(StudentBilling billing, CancellationToken cancellationToken = default);
}

