namespace AcademicScheduling.Application.Abstractions;

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AcademicScheduling.Domain.Aggregates;

public interface IAcademicSchedulingRepository
{
    Task<IReadOnlyList<CourseSection>> GetFacultyCoursesAsync(string facultyId, CancellationToken cancellationToken);
    Task<IReadOnlyList<CourseSection>> GetStudentTimetableAsync(string studentId, CancellationToken cancellationToken);
    Task AddAttendanceRecordAsync(AttendanceRecord record, CancellationToken cancellationToken);
    Task AddRoomAllocationAsync(RoomAllocation allocation, CancellationToken cancellationToken);
    Task<bool> HasRoomConflictAsync(string roomNumber, string dayOfWeek, System.TimeSpan startTime, System.TimeSpan endTime, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
