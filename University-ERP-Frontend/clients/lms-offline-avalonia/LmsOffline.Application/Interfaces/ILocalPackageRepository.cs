namespace LmsOffline.Application.Interfaces;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Domain.Aggregates;

public interface ILocalPackageRepository
{
    Task<List<CoursePackage>> GetAllInstalledAsync(CancellationToken cancellationToken = default);
    Task<CoursePackage?> GetByCourseCodeAsync(string courseCode, CancellationToken cancellationToken = default);
    Task AddAsync(CoursePackage package, CancellationToken cancellationToken = default);
}
