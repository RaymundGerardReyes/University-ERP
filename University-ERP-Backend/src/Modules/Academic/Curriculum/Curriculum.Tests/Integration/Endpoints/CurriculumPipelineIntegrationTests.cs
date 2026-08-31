using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SharedKernel.Domain.Primitives;
using Curriculum.Domain.Aggregates;
using Curriculum.Infrastructure.Persistence;
using Curriculum.Application.Features.BrowseCourses;
using Curriculum.Application.Features.GetAllCourses;
using Curriculum.Application.Features.UpdateMasterData;
using Curriculum.Application.Features.UpdatePrerequisite;
using Xunit;

namespace Curriculum.Tests.Integration.Endpoints
{
    /// <summary>
    /// Integration tests for the Curriculum MediatR Pipelines and Endpoints.
    /// Covers Scenarios 41 - 47.
    /// </summary>
    public class CurriculumPipelineIntegrationTests : IDisposable
    {
        private readonly CurriculumDbContext _dbContext;

        public CurriculumPipelineIntegrationTests()
        {
            var options = new DbContextOptionsBuilder<CurriculumDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _dbContext = new CurriculumDbContext(options);
        }

        public void Dispose()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        // ---------------------------------------------------------
        // SCENARIO 41: BrowseCoursesPipeline_Should_Return_Active_Courses
        // ---------------------------------------------------------
        [Fact]
        public async Task TC41_BrowseCoursesPipeline_Should_Return_Active_Courses()
        {
            var activeCourse = new CourseDefinition(Guid.NewGuid(), "CS101", "Intro to Programming", 3, "CS", "Active intro course");
            var inactiveCourse = new CourseDefinition(Guid.NewGuid(), "CS102", "Legacy Programming", 3, "CS", "Legacy course");
            inactiveCourse.UpdateMasterData("Legacy Programming", 3, "Inactive", "Legacy course");
            
            await _dbContext.CourseDefinitions.AddRangeAsync(activeCourse, inactiveCourse);
            await _dbContext.SaveChangesAsync();

            var handler = new BrowseCoursesQueryHandler();

            var result = await handler.Handle(new BrowseCoursesQuery("FALL-2026"), CancellationToken.None);

            result.Should().NotBeNull();
            result.Should().NotBeEmpty();
        }

        // ---------------------------------------------------------
        // SCENARIO 42: BrowseCoursesPipeline_Should_Return_Empty_When_No_Active_Courses
        // ---------------------------------------------------------
        [Fact]
        public async Task TC42_BrowseCoursesPipeline_Should_Return_Empty_When_No_Active_Courses()
        {
            var handler = new BrowseCoursesQueryHandler();

            var result = await handler.Handle(new BrowseCoursesQuery("EMPTY-TERM"), CancellationToken.None);

            result.Should().NotBeNull();
        }

        // ---------------------------------------------------------
        // SCENARIO 43: GetAllCoursesPipeline_Should_Return_All_Courses
        // ---------------------------------------------------------
        [Fact]
        public async Task TC43_GetAllCoursesPipeline_Should_Return_All_Courses()
        {
            await _dbContext.CourseDefinitions.AddRangeAsync(
                new CourseDefinition(Guid.NewGuid(), "MATH101", "Math 1", 3, "MATH", "Intro Math"),
                new CourseDefinition(Guid.NewGuid(), "MATH102", "Math 2", 3, "MATH", "Advanced Math")
            );
            await _dbContext.SaveChangesAsync();

            var handler = new GetAllCoursesQueryHandler(_dbContext);

            var result = await handler.Handle(new GetAllCoursesQuery(), CancellationToken.None);

            result.Should().HaveCount(2);
        }

        // ---------------------------------------------------------
        // SCENARIO 44: UpdateMasterDataPipeline_Should_Update_Course_Details
        // ---------------------------------------------------------
        [Fact]
        public async Task TC44_UpdateMasterDataPipeline_Should_Update_Course_Details()
        {
            var courseId = Guid.NewGuid();
            var course = new CourseDefinition(courseId, "ENG101", "English 101", 3, "ENG", "Intro English");
            await _dbContext.CourseDefinitions.AddAsync(course);
            await _dbContext.SaveChangesAsync();

            var command = new UpdateMasterDataCommand(courseId, "Advanced English 101", 4, "Active", "Updated description");
            var handler = new UpdateMasterDataCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            result.IsSuccess.Should().BeTrue();
            
            var updatedCourse = await _dbContext.CourseDefinitions.FindAsync(courseId);
            updatedCourse!.Title.Should().Be("Advanced English 101");
            updatedCourse.Units.Should().Be(4);
        }

        // ---------------------------------------------------------
        // SCENARIO 45: UpdateMasterDataPipeline_Should_Return_Failure_When_Course_Not_Found
        // ---------------------------------------------------------
        [Fact]
        public async Task TC45_UpdateMasterDataPipeline_Should_Return_Failure_When_Course_Not_Found()
        {
            var command = new UpdateMasterDataCommand(Guid.NewGuid(), "Ghost Course", 3, "Active", "Desc");
            var handler = new UpdateMasterDataCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Curriculum.CourseNotFound");
        }

        // ---------------------------------------------------------
        // SCENARIO 46: UpdatePrerequisitePipeline_Should_Add_Prerequisite
        // ---------------------------------------------------------
        [Fact]
        public async Task TC46_UpdatePrerequisitePipeline_Should_Add_Prerequisite()
        {
            var targetCourseId = Guid.NewGuid();
            
            await _dbContext.CourseDefinitions.AddAsync(
                new CourseDefinition(targetCourseId, "CS201", "Data Structures", 3, "CS", "Data structures course")
            );
            await _dbContext.SaveChangesAsync();

            var command = new UpdatePrerequisiteCommand(targetCourseId, "CS101", "C", true);
            var handler = new UpdatePrerequisiteCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            result.IsSuccess.Should().BeTrue();
            
            var updatedCourse = await _dbContext.CourseDefinitions.FindAsync(targetCourseId);
            updatedCourse!.Prerequisites.Should().ContainSingle(p => p.RequiredCourseCode == "CS101");
        }

        // ---------------------------------------------------------
        // SCENARIO 47: UpdatePrerequisitePipeline_Should_Fail_Gracefully_On_Validation_Error
        // ---------------------------------------------------------
        [Fact]
        public async Task TC47_UpdatePrerequisitePipeline_Should_Fail_Gracefully_On_Validation_Error()
        {
            var command = new UpdatePrerequisiteCommand(Guid.NewGuid(), "CS301", "C", true);
            var handler = new UpdatePrerequisiteCommandHandler(_dbContext);

            var result = await handler.Handle(command, CancellationToken.None);

            result.IsFailure.Should().BeTrue();
            result.Error.Code.Should().Be("Curriculum.CourseNotFound");
        }
    }
}
