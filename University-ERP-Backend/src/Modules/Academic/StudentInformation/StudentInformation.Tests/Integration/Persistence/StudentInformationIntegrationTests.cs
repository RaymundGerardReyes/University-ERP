using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using StudentInformation.Domain.Aggregates;
using StudentInformation.Domain.ValueObjects;
using StudentInformation.Infrastructure.Persistence;
using StudentInformation.Infrastructure.Repositories;
using Xunit;

namespace StudentInformation.Tests.Integration.Persistence
{
    public class StudentInformationIntegrationTests : IDisposable
    {
        private readonly StudentInformationDbContext _dbContext;
        private readonly StudentRepository _studentRepository;
        private readonly StudentAcademicRecordRepository _recordRepository;

        public StudentInformationIntegrationTests()
        {
            var options = new DbContextOptionsBuilder<StudentInformationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _dbContext = new StudentInformationDbContext(options);
            _studentRepository = new StudentRepository(_dbContext);
            _recordRepository = new StudentAcademicRecordRepository(_dbContext); 
        }

        public void Dispose()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        // --- 2.1 Repositories / Persistence (13 Scenarios) ---

        [Fact]
        public async Task TC31_StudentRepository_Should_AddAsync_To_Database()
        {
            var studentId = StudentId.CreateUnique();
            var student = Student.Enroll(studentId, Guid.NewGuid(), "INT-001", DateTime.UtcNow).Value;
            
            await _studentRepository.AddAsync(student, CancellationToken.None);
            var saved = await _dbContext.Students.FirstOrDefaultAsync(s => s.Id == studentId);
            
            saved.Should().NotBeNull();
            saved!.EnrollmentNumber.Should().Be("INT-001");
        }

        [Fact]
        public async Task TC32_StudentRepository_Should_GetByIdAsync()
        {
            var studentId = StudentId.CreateUnique();
            var student = Student.Enroll(studentId, Guid.NewGuid(), "INT-002", DateTime.UtcNow).Value;
            await _studentRepository.AddAsync(student, CancellationToken.None);

            var retrieved = await _studentRepository.GetByIdAsync(studentId, CancellationToken.None);
            retrieved.Should().NotBeNull();
            retrieved!.Id.Should().Be(studentId);
        }

        [Fact]
        public async Task TC33_StudentRepository_Should_Check_IsEnrollmentNumberUniqueAsync_True_When_New()
        {
            var isUnique = await _studentRepository.IsEnrollmentNumberUniqueAsync("NEW-NUM", CancellationToken.None);
            isUnique.Should().BeTrue();
        }

        [Fact]
        public async Task TC34_StudentRepository_Should_Check_IsEnrollmentNumberUniqueAsync_False_When_Duplicate()
        {
            var studentId = StudentId.CreateUnique();
            var student = Student.Enroll(studentId, Guid.NewGuid(), "DUP-001", DateTime.UtcNow).Value;
            await _studentRepository.AddAsync(student, CancellationToken.None);

            var isUnique = await _studentRepository.IsEnrollmentNumberUniqueAsync("DUP-001", CancellationToken.None);
            isUnique.Should().BeFalse();
        }

        [Fact]
        public async Task TC35_StudentRepository_Should_GetAdviseesByFacultyIdAsync()
        {
            var facultyId = Guid.NewGuid();
            var advisee = new FacultyAdvisee { Id = Guid.NewGuid().ToString(), FacultyId = facultyId, StudentId = "STU-999" };
            _dbContext.FacultyAdvisees.Add(advisee);
            await _dbContext.SaveChangesAsync();

            var list = await _studentRepository.GetAdviseesByFacultyIdAsync(facultyId, CancellationToken.None);
            list.Should().HaveCount(1);
            list.First().StudentId.Should().Be("STU-999");
        }

        [Fact]
        public async Task TC36_StudentAcademicRecordRepository_Should_AddAsync()
        {
            var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-REC-01");
            await _recordRepository.AddAsync(record, CancellationToken.None);

            var saved = await _dbContext.Set<StudentAcademicRecord>().FirstOrDefaultAsync(r => r.StudentId == "STU-REC-01");
            saved.Should().NotBeNull();
        }

        [Fact]
        public async Task TC37_StudentAcademicRecordRepository_Should_GetByStudentIdAsync()
        {
            var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-REC-02");
            await _recordRepository.AddAsync(record, CancellationToken.None);

            var retrieved = await _recordRepository.GetByStudentIdAsync("STU-REC-02", CancellationToken.None);
            retrieved.Should().NotBeNull();
        }

        [Fact]
        public async Task TC38_StudentAcademicRecordRepository_Should_UpdateAsync()
        {
            var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-REC-03");
            await _recordRepository.AddAsync(record, CancellationToken.None);

            record.AddCourseRecord("SEC-01", "CS101", 3);
            await _recordRepository.UpdateAsync(record, CancellationToken.None);

            var updated = await _recordRepository.GetByStudentIdAsync("STU-REC-03", CancellationToken.None);
            updated!.CourseRecords.Should().HaveCount(1);
        }

        [Fact]
        public async Task TC39_StudentInformationDbContext_Should_Save_EnrolledOnUtc()
        {
            var date = DateTime.UtcNow;
            var student = Student.Enroll(StudentId.CreateUnique(), Guid.NewGuid(), "DB-001", date).Value;
            await _studentRepository.AddAsync(student);

            var saved = await _studentRepository.GetByIdAsync(student.Id);
            saved!.EnrolledOnUtc.Should().Be(date);
        }

        [Fact]
        public async Task TC40_StudentInformationDbContext_Should_Update_ContactInfo_In_Database()
        {
            var student = Student.Enroll(StudentId.CreateUnique(), Guid.NewGuid(), "DB-002", DateTime.UtcNow).Value;
            await _studentRepository.AddAsync(student);

            student.UpdateContactInformation("999", "Emergency", "888");
            await _dbContext.SaveChangesAsync();

            var updated = await _studentRepository.GetByIdAsync(student.Id);
            updated!.PhoneNumber.Should().Be("999");
        }

        [Fact]
        public async Task TC41_FacultyAdvisee_Should_Persist_DegreeProgress()
        {
            var advisee = new FacultyAdvisee { Id = "ADV-01", FacultyId = Guid.NewGuid(), DegreeProgress = 75 };
            _dbContext.FacultyAdvisees.Add(advisee);
            await _dbContext.SaveChangesAsync();

            var saved = await _dbContext.FacultyAdvisees.FindAsync("ADV-01");
            saved!.DegreeProgress.Should().Be(75);
        }

        [Fact]
        public async Task TC42_StudentAcademicRecord_Should_Persist_CourseRecords()
        {
            var record = new StudentAcademicRecord(Guid.NewGuid(), "DB-003");
            record.AddCourseRecord("SEC", "CS", 3);
            record.RecordGradeAndComputeGpa("SEC", 4.0m);
            await _recordRepository.AddAsync(record);

            var saved = await _recordRepository.GetByStudentIdAsync("DB-003");
            saved!.CumulativeGpa.Should().Be(4.0m);
            saved.TotalEarnedUnits.Should().Be(3);
        }

        [Fact]
        public async Task TC43_StudentInformationDbContext_Should_Support_Concurrent_Enrollments()
        {
            var s1 = Student.Enroll(StudentId.CreateUnique(), Guid.NewGuid(), "CONC-01", DateTime.UtcNow).Value;
            var s2 = Student.Enroll(StudentId.CreateUnique(), Guid.NewGuid(), "CONC-02", DateTime.UtcNow).Value;

            await _studentRepository.AddAsync(s1);
            await _studentRepository.AddAsync(s2);

            var count = await _dbContext.Students.CountAsync();
            count.Should().Be(2);
        }
    }

    internal class StudentAcademicRecordRepository : StudentInformation.Application.Abstractions.IStudentAcademicRecordRepository
    {
        private readonly StudentInformationDbContext _context;
        public StudentAcademicRecordRepository(StudentInformationDbContext context) => _context = context;
        public async Task AddAsync(StudentAcademicRecord record, CancellationToken ct = default)
        {
            await _context.Set<StudentAcademicRecord>().AddAsync(record, ct);
            await _context.SaveChangesAsync(ct);
        }
        public async Task<StudentAcademicRecord?> GetByStudentIdAsync(string id, CancellationToken ct = default) =>
            await _context.Set<StudentAcademicRecord>().FirstOrDefaultAsync(r => r.StudentId == id, ct);
        public async Task UpdateAsync(StudentAcademicRecord record, CancellationToken ct = default)
        {
            _context.Set<StudentAcademicRecord>().Update(record);
            await _context.SaveChangesAsync(ct);
        }
        public Task<System.Collections.Generic.IReadOnlyList<StudentAcademicRecord>> GetAllAsync(CancellationToken ct = default) => throw new NotImplementedException();
    }
}
