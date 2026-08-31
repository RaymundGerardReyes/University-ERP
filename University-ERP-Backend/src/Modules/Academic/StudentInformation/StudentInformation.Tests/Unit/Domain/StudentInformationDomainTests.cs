using System;
using System.Linq;
using FluentAssertions;
using FluentValidation.TestHelper;
using StudentInformation.Domain.Aggregates;
using StudentInformation.Domain.ValueObjects;
using StudentInformation.Application.Features.EnrollStudent;
using Xunit;

namespace StudentInformation.Tests.Unit.Domain
{
    public class StudentInformationDomainTests
    {
        // --- 1.3 Domain Aggregates (15 Scenarios) ---

        [Fact]
        public void TC16_Student_Should_Enroll_Successfully()
        {
            var studentId = StudentId.CreateUnique();
            var identityId = Guid.NewGuid();
            var result = Student.Enroll(studentId, identityId, "STU-2026-001", DateTime.UtcNow);

            result.IsSuccess.Should().BeTrue();
            result.Value.EnrollmentNumber.Should().Be("STU-2026-001");
            result.Value.Status.Should().Be(EnrollmentStatus.Active);
        }

        [Fact]
        public void TC17_Student_Should_Raise_StudentEnrolledDomainEvent()
        {
            var studentId = StudentId.CreateUnique();
            var result = Student.Enroll(studentId, Guid.NewGuid(), "STU-2026-002", DateTime.UtcNow);

            var domainEvents = result.Value.GetDomainEvents();
            domainEvents.Should().ContainSingle();
            domainEvents.First().GetType().Name.Should().Be("StudentEnrolledDomainEvent");
        }

        [Fact]
        public void TC18_Student_Should_Reject_Enroll_When_EnrollmentNumber_Empty()
        {
            var result = Student.Enroll(StudentId.CreateUnique(), Guid.NewGuid(), "", DateTime.UtcNow);
            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Student.InvalidEnrollmentNumber");
        }

        [Fact]
        public void TC19_Student_Should_Reject_Enroll_When_IdentityUserId_Empty()
        {
            var result = Student.Enroll(StudentId.CreateUnique(), Guid.Empty, "STU-2026-003", DateTime.UtcNow);
            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Student.MissingIdentity");
        }

        [Fact]
        public void TC20_Student_Should_Suspend_Successfully_And_Update_Status()
        {
            var student = Student.Enroll(StudentId.CreateUnique(), Guid.NewGuid(), "STU-2026-004", DateTime.UtcNow).Value;
            student.Suspend();
            student.Status.Should().Be(EnrollmentStatus.Suspended);
        }

        [Fact]
        public void TC21_Student_Should_UpdateContactInformation_Successfully()
        {
            var student = Student.Enroll(StudentId.CreateUnique(), Guid.NewGuid(), "STU-2026-005", DateTime.UtcNow).Value;
            var result = student.UpdateContactInformation("555-0100", "Jane Doe", "555-0101");
            
            result.IsSuccess.Should().BeTrue();
            student.PhoneNumber.Should().Be("555-0100");
            student.EmergencyContactName.Should().Be("Jane Doe");
        }

        [Fact]
        public void TC22_Student_Should_Reject_UpdateContactInformation_When_Phone_Empty()
        {
            var student = Student.Enroll(StudentId.CreateUnique(), Guid.NewGuid(), "STU-2026-005", DateTime.UtcNow).Value;
            var result = student.UpdateContactInformation("", "Jane Doe", "555-0101");
            
            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Student.InvalidContact");
        }

        [Fact]
        public void TC23_Student_Should_Initialize_EnrolledOnUtc_Correctly()
        {
            var date = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc);
            var student = Student.Enroll(StudentId.CreateUnique(), Guid.NewGuid(), "STU-2026-006", date).Value;
            student.EnrolledOnUtc.Should().Be(date);
        }

        [Fact]
        public void TC24_FacultyAdvisee_Should_Have_Default_Values()
        {
            var advisee = new FacultyAdvisee();
            advisee.Id.Should().Be(string.Empty);
            advisee.DegreeProgress.Should().Be(0);
        }

        [Fact]
        public void TC25_FacultyAdvisee_Should_Assign_Properties_Correctly()
        {
            var facultyId = Guid.NewGuid();
            var advisee = new FacultyAdvisee { FacultyId = facultyId, StudentName = "Alex", Program = "BSCS" };
            advisee.FacultyId.Should().Be(facultyId);
            advisee.Program.Should().Be("BSCS");
        }

        [Fact]
        public void TC26_CourseGradeRecord_Should_Initialize_As_UnGraded()
        {
            var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-001");
            record.AddCourseRecord("SEC-01", "CS101", 3);
            
            var course = record.CourseRecords.First();
            course.IsGraded.Should().BeFalse();
            course.Grade.Should().BeNull();
        }

        [Fact]
        public void TC27_CourseGradeRecord_Should_Assign_Grade_Correctly()
        {
            var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-001");
            record.AddCourseRecord("SEC-01", "CS101", 3);
            record.RecordGradeAndComputeGpa("SEC-01", 3.5m);
            
            record.CourseRecords.First().IsGraded.Should().BeTrue();
            record.CourseRecords.First().Grade.Should().Be(3.5m);
        }

        [Fact]
        public void TC28_StudentId_Should_Create_Unique_Value()
        {
            var id1 = StudentId.CreateUnique();
            var id2 = StudentId.CreateUnique();
            id1.Should().NotBe(id2);
        }

        [Fact]
        public void TC29_StudentId_Should_Compare_Equality_Correctly()
        {
            var guid = Guid.NewGuid();
            var id1 = StudentId.From(guid);
            var id2 = StudentId.From(guid);
            (id1 == id2).Should().BeTrue();
        }

        [Fact]
        public void TC30_StudentId_Should_Match_Base_Primitive_Value()
        {
            var guid = Guid.NewGuid();
            var id = StudentId.From(guid);
            id.Value.Should().Be(guid);
        }
    }

    public class EnrollStudentCommandValidatorTests
    {
        // --- 1.2 FluentValidation Validators (4 Scenarios) ---
        private readonly EnrollStudentCommandValidator _validator = new();

        [Fact]
        public void TC12_EnrollStudentCommandValidator_Should_Pass_When_Valid()
        {
            var command = new EnrollStudentCommand(Guid.NewGuid(), "STU-2026-001");
            var result = _validator.TestValidate(command);
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Fact]
        public void TC13_EnrollStudentCommandValidator_Should_Fail_When_IdentityUserId_Empty()
        {
            var command = new EnrollStudentCommand(Guid.Empty, "STU-2026-001");
            var result = _validator.TestValidate(command);
            result.ShouldHaveValidationErrorFor(x => x.IdentityUserId);
        }

        [Fact]
        public void TC14_EnrollStudentCommandValidator_Should_Fail_When_EnrollmentNumber_Empty()
        {
            var command = new EnrollStudentCommand(Guid.NewGuid(), "");
            var result = _validator.TestValidate(command);
            result.ShouldHaveValidationErrorFor(x => x.EnrollmentNumber);
        }

        [Fact]
        public void TC15_EnrollStudentCommandValidator_Should_Fail_When_EnrollmentNumber_Exceeds_20Chars()
        {
            var command = new EnrollStudentCommand(Guid.NewGuid(), "STU-2026-001-TOO-LONG-NUMBER");
            var result = _validator.TestValidate(command);
            result.ShouldHaveValidationErrorFor(x => x.EnrollmentNumber);
        }
    }
}
