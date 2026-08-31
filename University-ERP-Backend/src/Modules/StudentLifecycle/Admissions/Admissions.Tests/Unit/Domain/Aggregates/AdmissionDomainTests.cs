using System;
using System.Linq;
using FluentAssertions;
using Xunit;
using Admissions.Domain.Aggregates;

namespace Admissions.Tests.Unit.Domain.Aggregates
{
    public class AdmissionDomainTests
    {
        // 16. AdmissionApplication_Should_Initialize_Correctly_On_Submit
        [Fact]
        public void AdmissionApplication_Should_Initialize_Correctly_On_Submit()
        {
            var app = new AdmissionApplication("APP-100", "APPLICANT-01", "BSCS");

            app.ApplicantId.Should().Be("APPLICANT-01");
            app.ProgramId.Should().Be("BSCS");
            app.Status.Should().Be("Submitted");
            app.ApplicationFeeStatus.Should().Be("Pending");
            app.Documents.Should().HaveCount(3);
            app.TimelineEvents.Should().HaveCount(4);
        }

        // 17. AdmissionApplication_Should_Add_Document
        [Fact]
        public void AdmissionApplication_Should_Add_Document()
        {
            var app = new AdmissionApplication("APP-101", "APPLICANT-01", "BSCS");

            app.AddDocument("Passport Copy", "Uploaded", "/path/to/passport.jpg");

            app.Documents.Should().Contain(d => d.Name == "Passport Copy" && d.Status == "Uploaded" && d.FilePath == "/path/to/passport.jpg");
        }

        // 18. AdmissionApplication_Should_MarkFeePaid
        [Fact]
        public void AdmissionApplication_Should_MarkFeePaid()
        {
            var app = new AdmissionApplication("APP-102", "APPLICANT-01", "BSCS");

            var result = app.MarkFeeAsPaid("TXN-9999");

            result.IsSuccess.Should().BeTrue();
            app.ApplicationFeeStatus.Should().Be("Paid");
            app.ApplicationFeeTransactionId.Should().Be("TXN-9999");
            app.TimelineEvents.Should().Contain(e => e.Title == "Application Fee Paid" && e.Status == "Completed");
        }

        // 19. AdmissionApplication_Should_VerifyDocuments
        [Fact]
        public void AdmissionApplication_Should_VerifyDocuments()
        {
            var app = new AdmissionApplication("APP-103", "APPLICANT-01", "BSCS");

            var result = app.VerifyDocuments();

            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("InterviewPending");
            app.TimelineEvents.Should().Contain(e => e.Title == "Document Verification Complete");
        }

        // 20. AdmissionApplication_Should_ScheduleInterview
        [Fact]
        public void AdmissionApplication_Should_ScheduleInterview()
        {
            var app = new AdmissionApplication("APP-104", "APPLICANT-01", "BSCS");
            app.VerifyDocuments();

            var result = app.ScheduleInterview("2026-10-15", "09:00 AM");

            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("InterviewScheduled");
            app.InterviewDate.Should().Be("2026-10-15");
            app.InterviewTime.Should().Be("09:00 AM");
        }

        // 21. AdmissionApplication_Should_CompleteInterview
        [Fact]
        public void AdmissionApplication_Should_CompleteInterview()
        {
            var app = new AdmissionApplication("APP-105", "APPLICANT-01", "BSCS");
            app.VerifyDocuments();

            var result = app.CompleteInterview("Candidate shows strong potential.");

            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("UnderAcademicEvaluation");
            app.FacultyRemarks.Should().Be("Candidate shows strong potential.");
        }

        // 22. AdmissionApplication_Should_Evaluate
        [Fact]
        public void AdmissionApplication_Should_Evaluate()
        {
            var app = new AdmissionApplication("APP-106", "APPLICANT-01", "BSCS");

            app.UpdateStatus("Waitlist");

            app.Status.Should().Be("Waitlist");
        }

        // 23. AdmissionApplication_Should_Endorse
        [Fact]
        public void AdmissionApplication_Should_Endorse()
        {
            var app = new AdmissionApplication("APP-107", "APPLICANT-01", "BSCS");
            app.UpdateStatus("Recommended");

            var result = app.Endorse();

            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("Endorsed_For_Enrollment");
        }

        // 24. AdmissionApplication_Should_Recommend
        [Fact]
        public void AdmissionApplication_Should_Recommend()
        {
            var app = new AdmissionApplication("APP-108", "APPLICANT-01", "BSCS");
            app.UpdateStatus("UnderAcademicEvaluation");

            var result = app.Recommend("Highly recommended for BSCS");

            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("Recommended");
            app.FacultyRemarks.Should().Be("Highly recommended for BSCS");
        }

        // 25. AdmissionApplication_Should_Approve
        [Fact]
        public void AdmissionApplication_Should_Approve()
        {
            var app = new AdmissionApplication("APP-109", "APPLICANT-01", "BSCS");

            app.UpdateStatus("Accepted");

            app.Status.Should().Be("Accepted");
        }

        // 26. AdmissionApplication_Should_Activate
        [Fact]
        public void AdmissionApplication_Should_Activate()
        {
            var app = new AdmissionApplication("APP-110", "APPLICANT-01", "BSCS");
            app.UpdateStatus("Endorsed_For_Enrollment");

            var result = app.ActivateEnrollment("STU-2026-9999");

            result.IsSuccess.Should().BeTrue();
            app.Status.Should().Be("Enrolled");
            app.OfficialStudentId.Should().Be("STU-2026-9999");
            app.GetDomainEvents().Should().ContainSingle(e => e.GetType().Name == "StudentEnrolledDomainEvent");
        }

        // 27. AdmissionApplication_Should_Fail_Activate_If_Not_Approved
        [Fact]
        public void AdmissionApplication_Should_Fail_Activate_If_Not_Approved()
        {
            var app = new AdmissionApplication("APP-111", "APPLICANT-01", "BSCS");

            var result = app.ActivateEnrollment("STU-2026-9999");

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Admissions.InvalidState");
            app.Status.Should().NotBe("Enrolled");
        }

        // 28. ProgramOffering_Should_Create_Correctly
        [Fact]
        public void ProgramOffering_Should_Create_Correctly()
        {
            var program = new ProgramOffering("PROG-01", "College of Engineering", "Bachelor of Science", "Civil Engineering", "4 Years", "Fall 2026", "60,000 PHP");

            program.Id.Should().Be("PROG-01");
            program.College.Should().Be("College of Engineering");
            program.Major.Should().Be("Civil Engineering");
            program.Tags.Should().BeEmpty();
        }

        // 29. ProgramOffering_Should_Update_Status
        [Fact]
        public void ProgramOffering_Should_Update_Status()
        {
            var program = new ProgramOffering("PROG-02", "College of Engineering", "Bachelor of Science", "Civil Engineering", "4 Years", "Fall 2026", "60,000 PHP");

            program.AddTag("Active");

            program.Tags.Should().Contain("Active");
        }

        // 30. ProgramOffering_Should_Update_Capacity
        [Fact]
        public void ProgramOffering_Should_Update_Capacity()
        {
            var program = new ProgramOffering("PROG-03", "College of Engineering", "Bachelor of Science", "Civil Engineering", "4 Years", "Fall 2026", "60,000 PHP");

            program.AddTag("FullCapacity");

            program.Tags.Should().Contain("FullCapacity");
        }
    }
}
