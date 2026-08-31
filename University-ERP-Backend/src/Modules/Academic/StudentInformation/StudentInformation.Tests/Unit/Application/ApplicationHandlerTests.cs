using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using StudentInformation.Application.Abstractions;
using StudentInformation.Application.Features.EnrollStudent;
using StudentInformation.Application.Features.UpdateContactInfo;
using StudentInformation.Application.Features.GetAdvisees;
using StudentInformation.Application.Features.GetMyStudents;
using StudentInformation.Application.Features.GetStudentInformation;
using StudentInformation.Application.Features.Graduation;
using StudentInformation.Domain.Aggregates;
using StudentInformation.Domain.ValueObjects;
using Xunit;

namespace StudentInformation.Tests.Unit.Application
{
    public class ApplicationHandlerTests
    {
        // --- 1.1 Application Handlers & Queries (11 Scenarios) ---

        [Fact]
        public async Task TC01_EnrollStudentCommandHandler_Should_Return_Success_When_Valid()
        {
            var mockRepo = new Mock<IStudentRepository>();
            mockRepo.Setup(x => x.IsEnrollmentNumberUniqueAsync(It.IsAny<string>(), default)).ReturnsAsync(true);
            
            var handler = new EnrollStudentCommandHandler(mockRepo.Object);
            var result = await handler.Handle(new EnrollStudentCommand(Guid.NewGuid(), "STU-001"), CancellationToken.None);

            result.IsSuccess.Should().BeTrue();
            mockRepo.Verify(x => x.AddAsync(It.IsAny<Student>(), default), Times.Once);
        }

        [Fact]
        public async Task TC02_EnrollStudentCommandHandler_Should_Return_Failure_When_EnrollmentNumber_Is_Not_Unique()
        {
            var mockRepo = new Mock<IStudentRepository>();
            mockRepo.Setup(x => x.IsEnrollmentNumberUniqueAsync(It.IsAny<string>(), default)).ReturnsAsync(false);
            
            var handler = new EnrollStudentCommandHandler(mockRepo.Object);
            var result = await handler.Handle(new EnrollStudentCommand(Guid.NewGuid(), "STU-001"), CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Student.DuplicateEnrollmentNumber");
        }

        [Fact]
        public async Task TC03_EnrollStudentCommandHandler_Should_Return_Failure_When_Domain_Creation_Fails()
        {
            var mockRepo = new Mock<IStudentRepository>();
            mockRepo.Setup(x => x.IsEnrollmentNumberUniqueAsync(It.IsAny<string>(), default)).ReturnsAsync(true);
            
            var handler = new EnrollStudentCommandHandler(mockRepo.Object);
            // Passing empty IdentityUserId to force domain failure
            var result = await handler.Handle(new EnrollStudentCommand(Guid.Empty, "STU-001"), CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Student.MissingIdentity");
        }

        [Fact]
        public async Task TC04_UpdateContactInfoCommandHandler_Should_Return_Success_When_Found()
        {
            var mockRepo = new Mock<IStudentRepository>();
            var studentId = StudentId.CreateUnique();
            var student = Student.Enroll(studentId, Guid.NewGuid(), "STU-001", DateTime.UtcNow).Value;
            
            mockRepo.Setup(x => x.GetByIdAsync(It.IsAny<StudentId>(), default)).ReturnsAsync(student);
            
            var handler = new UpdateContactInfoCommandHandler(mockRepo.Object);
            var result = await handler.Handle(new UpdateContactInfoCommand(studentId.Value, "123", "Mom", "321"), CancellationToken.None);

            result.IsSuccess.Should().BeTrue();
        }

        [Fact]
        public async Task TC05_UpdateContactInfoCommandHandler_Should_Return_Failure_When_Not_Found()
        {
            var mockRepo = new Mock<IStudentRepository>();
            mockRepo.Setup(x => x.GetByIdAsync(It.IsAny<StudentId>(), default)).ReturnsAsync((Student)null!);
            
            var handler = new UpdateContactInfoCommandHandler(mockRepo.Object);
            var result = await handler.Handle(new UpdateContactInfoCommand(Guid.NewGuid(), "123", "Mom", "321"), CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Student.NotFound");
        }

        [Fact]
        public async Task TC06_GraduationRequestCommandHandler_Should_Return_Success()
        {
            var mockRepo = new Mock<IStudentAcademicRecordRepository>();
            var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-001");
            record.AddCourseRecord("SEC1", "CS101", 130);
            record.RecordGradeAndComputeGpa("SEC1", 3.0m); // Puts in GOOD standing
            
            mockRepo.Setup(x => x.GetByStudentIdAsync("STU-001", default)).ReturnsAsync(record);
            
            var handler = new ReviewClearanceCommandHandler(mockRepo.Object);
            var result = await handler.Handle(new ReviewClearanceCommand("STU-001"), CancellationToken.None);

            result.IsSuccess.Should().BeTrue();
        }

        [Fact]
        public async Task TC07_GraduationRequestCommandHandler_Should_Return_Failure_When_Not_Found()
        {
            var mockRepo = new Mock<IStudentAcademicRecordRepository>();
            mockRepo.Setup(x => x.GetByStudentIdAsync(It.IsAny<string>(), default)).ReturnsAsync((StudentAcademicRecord)null!);
            
            var handler = new ReviewClearanceCommandHandler(mockRepo.Object);
            var result = await handler.Handle(new ReviewClearanceCommand("STU-001"), CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("AcademicRecord.NotFound");
        }

        [Fact]
        public async Task TC08_GetAdviseesQueryHandler_Should_Return_List_When_Found()
        {
            var mockRepo = new Mock<IStudentRepository>();
            mockRepo.Setup(x => x.GetAdviseesByFacultyIdAsync(It.IsAny<Guid>(), default))
                    .ReturnsAsync(new List<FacultyAdvisee> { new FacultyAdvisee { StudentId = "STU-001" } });
            
            var handler = new GetAdviseesQueryHandler(mockRepo.Object);
            var result = await handler.Handle(new GetAdviseesQuery(Guid.NewGuid().ToString()), CancellationToken.None);

            result.Should().NotBeEmpty();
            result.First().StudentId.Should().Be("STU-001");
        }

        [Fact]
        public async Task TC09_GetAdviseesQueryHandler_Should_Return_Empty_When_Not_Found()
        {
            var mockRepo = new Mock<IStudentRepository>();
            mockRepo.Setup(x => x.GetAdviseesByFacultyIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync(new List<FacultyAdvisee>());
            
            var handler = new GetAdviseesQueryHandler(mockRepo.Object);
            var result = await handler.Handle(new GetAdviseesQuery(Guid.NewGuid().ToString()), CancellationToken.None);

            result.Should().BeEmpty();
        }

        [Fact]
        public async Task TC10_GetMyStudentsQueryHandler_Should_Return_List_When_Found()
        {
            var mockRepo = new Mock<IStudentRepository>();
            mockRepo.Setup(x => x.GetAdviseesByFacultyIdAsync(It.IsAny<Guid>(), default))
                    .ReturnsAsync(new List<FacultyAdvisee> { new FacultyAdvisee { StudentId = "STU-002" } });
            
            var handler = new GetMyStudentsQueryHandler(mockRepo.Object);
            var result = await handler.Handle(new GetMyStudentsQuery(Guid.NewGuid().ToString()), CancellationToken.None);

            result.Should().NotBeEmpty();
        }

        [Fact]
        public async Task TC11_GetStudentInformationQueryHandler_Should_Return_Details_When_Found()
        {
            var handler = new GetStudentProfileQueryHandler();
            var result = await handler.Handle(new GetStudentProfileQuery("STU-001"), CancellationToken.None);
            
            result.Should().NotBeNull();
            result.Id.Should().Be("STU-001");
        }
    }
}
