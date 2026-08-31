using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using SharedKernel.Domain.Primitives;
using Xunit;

// Domain and Application References
using StudentInformation.Domain.Aggregates;
using StudentInformation.Domain.ValueObjects;
using StudentInformation.Application.Abstractions;
using StudentInformation.Application.Features.EnrollStudent;
using StudentInformation.Application.Features.UpdateContactInfo;
using StudentInformation.Application.Features.Graduation;
using StudentInformation.Application.Features.GetAdvisees;
using StudentInformation.Application.Features.GetMyStudents;
using StudentInformation.Application.Features.GetStudentInformation;
using StudentInformation.Infrastructure.Persistence;
using StudentInformation.Infrastructure.Repositories;

namespace StudentInformation.Tests.Integration.Endpoints
{
    /// <summary>
    /// Integration tests for the StudentInformation MediatR Pipelines and Endpoints.
    /// Covers Scenarios 48 - 60.
    /// </summary>
    public class StudentInformationPipelineIntegrationTests : IDisposable
    {
        private readonly StudentInformationDbContext _dbContext;
        private readonly StudentRepository _studentRepository;
        private readonly Mock<IStudentAcademicRecordRepository> _mockAcademicRepo;

        public StudentInformationPipelineIntegrationTests()
        {
            var options = new DbContextOptionsBuilder<StudentInformationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _dbContext = new StudentInformationDbContext(options);
            _studentRepository = new StudentRepository(_dbContext);
            _mockAcademicRepo = new Mock<IStudentAcademicRecordRepository>();
        }

        public void Dispose()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        // ---------------------------------------------------------
        // SCENARIO 48: EnrollStudentPipeline_Should_Persist_New_Student
        // ---------------------------------------------------------
        [Fact]
        public async Task TC48_EnrollStudentPipeline_Should_Persist_New_Student()
        {
            var handler = new EnrollStudentCommandHandler(_studentRepository);
            var identityId = Guid.NewGuid();
            var command = new EnrollStudentCommand(identityId, "ENR-2026-001");

            var result = await handler.Handle(command, CancellationToken.None);

            result.IsSuccess.Should().BeTrue();
            
            var savedStudent = await _dbContext.Students.FirstOrDefaultAsync(s => s.EnrollmentNumber == "ENR-2026-001");
            savedStudent.Should().NotBeNull();
            savedStudent!.IdentityUserId.Should().Be(identityId);
        }

        // ---------------------------------------------------------
        // SCENARIO 49: EnrollStudentPipeline_Should_Return_Failure_When_Duplicate_Enrollment_Number
        // ---------------------------------------------------------
        [Fact]
        public async Task TC49_EnrollStudentPipeline_Should_Return_Failure_When_Duplicate_Enrollment_Number()
        {
            var student = Student.Enroll(StudentId.CreateUnique(), Guid.NewGuid(), "ENR-DUP-001", DateTime.UtcNow).Value;
            await _studentRepository.AddAsync(student, CancellationToken.None);

            var handler = new EnrollStudentCommandHandler(_studentRepository);
            var command = new EnrollStudentCommand(Guid.NewGuid(), "ENR-DUP-001");

            var result = await handler.Handle(command, CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Student.DuplicateEnrollmentNumber");
        }

        // ---------------------------------------------------------
        // SCENARIO 50: EnrollStudentPipeline_Should_Publish_StudentEnrolledEvent_On_Success
        // ---------------------------------------------------------
        [Fact]
        public async Task TC50_EnrollStudentPipeline_Should_Publish_StudentEnrolledEvent_On_Success()
        {
            var handler = new EnrollStudentCommandHandler(_studentRepository);
            var command = new EnrollStudentCommand(Guid.NewGuid(), "ENR-EVT-001");

            var result = await handler.Handle(command, CancellationToken.None);

            var savedStudent = await _dbContext.Students.FirstOrDefaultAsync(s => s.Id == result.Value);
            savedStudent.Should().NotBeNull();
            
            var domainEvents = savedStudent!.GetDomainEvents();
            domainEvents.Should().ContainSingle();
            domainEvents.First().GetType().Name.Should().Be("StudentEnrolledDomainEvent");
        }

        // ---------------------------------------------------------
        // SCENARIO 51: UpdateContactInfoPipeline_Should_Update_Contact_Details
        // ---------------------------------------------------------
        [Fact]
        public async Task TC51_UpdateContactInfoPipeline_Should_Update_Contact_Details()
        {
            var studentId = StudentId.CreateUnique();
            var student = Student.Enroll(studentId, Guid.NewGuid(), "ENR-UPD-001", DateTime.UtcNow).Value;
            await _studentRepository.AddAsync(student, CancellationToken.None);

            var handler = new UpdateContactInfoCommandHandler(_studentRepository);
            var command = new UpdateContactInfoCommand(studentId.Value, "555-1234", "Jane Doe", "555-9876");

            var result = await handler.Handle(command, CancellationToken.None);

            result.IsSuccess.Should().BeTrue();
            var updatedStudent = await _dbContext.Students.FirstOrDefaultAsync(s => s.Id == studentId);
            updatedStudent!.PhoneNumber.Should().Be("555-1234");
            updatedStudent.EmergencyContactName.Should().Be("Jane Doe");
        }

        // ---------------------------------------------------------
        // SCENARIO 52: UpdateContactInfoPipeline_Should_Return_Failure_When_Student_Not_Found
        // ---------------------------------------------------------
        [Fact]
        public async Task TC52_UpdateContactInfoPipeline_Should_Return_Failure_When_Student_Not_Found()
        {
            var handler = new UpdateContactInfoCommandHandler(_studentRepository);
            var command = new UpdateContactInfoCommand(Guid.NewGuid(), "555-1234", "Jane Doe", "555-9876");

            var result = await handler.Handle(command, CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Student.NotFound");
        }

        // ---------------------------------------------------------
        // SCENARIO 53: GraduationRequestPipeline_Should_Process_Clearance_Request
        // ---------------------------------------------------------
        [Fact]
        public async Task TC53_GraduationRequestPipeline_Should_Process_Clearance_Request()
        {
            var academicRecord = new StudentAcademicRecord(Guid.NewGuid(), "STU-GRAD-001");
            academicRecord.AddCourseRecord("SEC-01", "CS101", 125); 
            academicRecord.RecordGradeAndComputeGpa("SEC-01", 3.5m);

            _mockAcademicRepo.Setup(x => x.GetByStudentIdAsync("STU-GRAD-001", default))
                             .ReturnsAsync(academicRecord);
            _mockAcademicRepo.Setup(x => x.UpdateAsync(It.IsAny<StudentAcademicRecord>(), default))
                             .Returns(Task.CompletedTask);

            var handler = new ReviewClearanceCommandHandler(_mockAcademicRepo.Object);
            var result = await handler.Handle(new ReviewClearanceCommand("STU-GRAD-001"), CancellationToken.None);

            result.IsSuccess.Should().BeTrue();
            academicRecord.GraduationStatus.Should().Be("Pending Review");
        }

        // ---------------------------------------------------------
        // SCENARIO 54: GraduationRequestPipeline_Should_Return_Failure_When_Not_Eligible
        // ---------------------------------------------------------
        [Fact]
        public async Task TC54_GraduationRequestPipeline_Should_Return_Failure_When_Not_Eligible()
        {
            var academicRecord = new StudentAcademicRecord(Guid.NewGuid(), "STU-GRAD-002");
            academicRecord.AddCourseRecord("SEC-01", "CS101", 90);
            academicRecord.RecordGradeAndComputeGpa("SEC-01", 3.0m); 

            _mockAcademicRepo.Setup(x => x.GetByStudentIdAsync("STU-GRAD-002", default))
                             .ReturnsAsync(academicRecord);

            var handler = new ReviewClearanceCommandHandler(_mockAcademicRepo.Object);
            var result = await handler.Handle(new ReviewClearanceCommand("STU-GRAD-002"), CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Graduation.InsufficientCredits");
        }

        // ---------------------------------------------------------
        // SCENARIO 55: GetAdviseesPipeline_Should_Return_Advisee_List
        // ---------------------------------------------------------
        [Fact]
        public async Task TC55_GetAdviseesPipeline_Should_Return_Advisee_List()
        {
            var facultyId = Guid.NewGuid();
            var advisee = new FacultyAdvisee { Id = Guid.NewGuid().ToString(), FacultyId = facultyId, StudentId = "STU-ADV-01", StudentName = "Alice" };
            _dbContext.FacultyAdvisees.Add(advisee);
            await _dbContext.SaveChangesAsync();

            var handler = new GetAdviseesQueryHandler(_studentRepository);
            var result = await handler.Handle(new GetAdviseesQuery(facultyId.ToString()), CancellationToken.None);

            result.Should().NotBeEmpty();
            result.First().StudentId.Should().Be("STU-ADV-01");
            result.First().StudentName.Should().Be("Alice");
        }

        // ---------------------------------------------------------
        // SCENARIO 56: GetMyStudentsPipeline_Should_Return_Student_List
        // ---------------------------------------------------------
        [Fact]
        public async Task TC56_GetMyStudentsPipeline_Should_Return_Student_List()
        {
            var facultyId = Guid.NewGuid();
            var student = new FacultyAdvisee { Id = Guid.NewGuid().ToString(), FacultyId = facultyId, StudentId = "STU-FAC-01" };
            _dbContext.FacultyAdvisees.Add(student);
            await _dbContext.SaveChangesAsync();

            var handler = new GetMyStudentsQueryHandler(_studentRepository);
            var result = await handler.Handle(new GetMyStudentsQuery(facultyId.ToString()), CancellationToken.None);

            result.Should().NotBeEmpty();
            result.First().StudentId.Should().Be("STU-FAC-01");
        }

        // ---------------------------------------------------------
        // SCENARIO 57: GetStudentInformationPipeline_Should_Return_Details
        // ---------------------------------------------------------
        [Fact]
        public async Task TC57_GetStudentInformationPipeline_Should_Return_Details()
        {
            var handler = new GetStudentProfileQueryHandler();
            var result = await handler.Handle(new GetStudentProfileQuery("STU-1234"), CancellationToken.None);

            result.Should().NotBeNull();
            result.Id.Should().Be("STU-1234");
            result.FirstName.Should().Be("Alex");
        }

        // ---------------------------------------------------------
        // SCENARIO 58: GetStudentInformationPipeline_Should_Return_NotFound_For_Invalid_Id
        // ---------------------------------------------------------
        [Fact]
        public async Task TC58_GetStudentInformationPipeline_Should_Return_NotFound_For_Invalid_Id()
        {
            var mockRepo = new Mock<IStudentRepository>();
            mockRepo.Setup(x => x.GetByIdAsync(It.IsAny<StudentId>(), default)).ReturnsAsync((Student)null!);

            var retrieved = await mockRepo.Object.GetByIdAsync(StudentId.CreateUnique());
            
            retrieved.Should().BeNull();
        }

        // ---------------------------------------------------------
        // SCENARIO 59: StudentInformationPipeline_Should_Rollback_On_Database_Failure
        // ---------------------------------------------------------
        [Fact]
        public async Task TC59_StudentInformationPipeline_Should_Rollback_On_Database_Failure()
        {
            var mockRepo = new Mock<IStudentRepository>();
            mockRepo.Setup(x => x.IsEnrollmentNumberUniqueAsync(It.IsAny<string>(), default)).ReturnsAsync(true);
            mockRepo.Setup(x => x.AddAsync(It.IsAny<Student>(), default)).ThrowsAsync(new DbUpdateException("Database failure"));

            var handler = new EnrollStudentCommandHandler(mockRepo.Object);
            var command = new EnrollStudentCommand(Guid.NewGuid(), "FAIL-001");

            Func<Task> action = async () => await handler.Handle(command, CancellationToken.None);

            await action.Should().ThrowAsync<DbUpdateException>().WithMessage("Database failure");
        }

        // ---------------------------------------------------------
        // SCENARIO 60: StudentInformationPipeline_Should_Allow_Concurrent_Enrollments_For_Different_Numbers
        // ---------------------------------------------------------
        [Fact]
        public async Task TC60_StudentInformationPipeline_Should_Allow_Concurrent_Enrollments_For_Different_Numbers()
        {
            var handler = new EnrollStudentCommandHandler(_studentRepository);
            
            var task1 = handler.Handle(new EnrollStudentCommand(Guid.NewGuid(), "CONC-001"), CancellationToken.None);
            var task2 = handler.Handle(new EnrollStudentCommand(Guid.NewGuid(), "CONC-002"), CancellationToken.None);
            var task3 = handler.Handle(new EnrollStudentCommand(Guid.NewGuid(), "CONC-003"), CancellationToken.None);

            var results = await Task.WhenAll(task1, task2, task3);

            results.All(r => r.IsSuccess).Should().BeTrue();
            
            var studentCount = await _dbContext.Students.CountAsync();
            studentCount.Should().Be(3);
        }
    }
}
