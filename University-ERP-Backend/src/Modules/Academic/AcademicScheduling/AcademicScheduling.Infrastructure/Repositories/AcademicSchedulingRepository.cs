namespace AcademicScheduling.Infrastructure.Repositories;

using AcademicScheduling.Application.Abstractions;
using AcademicScheduling.Domain.Aggregates;
using AcademicScheduling.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public sealed class AcademicSchedulingRepository(AcademicSchedulingDbContext dbContext) : IAcademicSchedulingRepository
{
    public async Task<IReadOnlyList<CourseSection>> GetFacultyCoursesAsync(string facultyId, CancellationToken cancellationToken)
    {
        if (System.Guid.TryParse(facultyId, out var parsedGuid))
        {
            return await dbContext.CourseSections
                .AsNoTracking()
                .Where(cs => cs.FacultyId == parsedGuid)
                .ToListAsync(cancellationToken);
        }
        return new List<CourseSection>();
    }

    public async Task<IReadOnlyList<CourseSection>> GetStudentTimetableAsync(string studentId, CancellationToken cancellationToken)
    {
        // In DBMA, a student is enrolled in courses. For this query to replicate the raw SQL, 
        // we'll fetch all courses. (Raw SQL didn't filter by studentId, it just returned all sections).
        return await dbContext.CourseSections
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task AddAttendanceRecordAsync(AttendanceRecord record, CancellationToken cancellationToken)
    {
        await dbContext.AttendanceRecords.AddAsync(record, cancellationToken);
    }

    public async Task AddRoomAllocationAsync(RoomAllocation allocation, CancellationToken cancellationToken)
    {
        await dbContext.RoomAllocations.AddAsync(allocation, cancellationToken);
    }

    public async Task<bool> HasRoomConflictAsync(string roomNumber, string dayOfWeek, System.TimeSpan startTime, System.TimeSpan endTime, CancellationToken cancellationToken)
    {
        return await dbContext.RoomAllocations
            .AnyAsync(r => r.RoomNumber == roomNumber 
                        && r.DayOfWeek == dayOfWeek 
                        && r.StartTime < endTime 
                        && r.EndTime > startTime, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
