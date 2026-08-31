using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Curriculum.Domain.Aggregates;
using Curriculum.Infrastructure.Persistence;
using Curriculum.Infrastructure.Repositories;
using Xunit;

namespace Curriculum.Tests.Integration.Persistence
{
    public class CourseDefinitionRepositoryIntegrationTests : IDisposable
    {
        private readonly CurriculumDbContext _dbContext;
        private readonly CourseDefinitionRepository _repository;

        public CourseDefinitionRepositoryIntegrationTests()
        {
            var options = new DbContextOptionsBuilder<CurriculumDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _dbContext = new CurriculumDbContext(options);
            _repository = new CourseDefinitionRepository(_dbContext);
        }

        public void Dispose()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Fact]
        public async Task TC31_CourseDefinitionRepository_Should_AddAsync_To_Database()
        {
            var course = new CourseDefinition(Guid.NewGuid(), "CS101", "Intro to Programming", 3, "CS", "Introductory course");

            await _repository.AddAsync(course, CancellationToken.None);
            await _dbContext.SaveChangesAsync();
            
            var savedCourse = await _dbContext.CourseDefinitions.FirstOrDefaultAsync(c => c.Code == "CS101");
            savedCourse.Should().NotBeNull();
            savedCourse!.Title.Should().Be("Intro to Programming");
        }

        [Fact]
        public async Task TC32_CourseDefinitionRepository_Should_GetByIdAsync()
        {
            var courseId = Guid.NewGuid();
            var course = new CourseDefinition(courseId, "MATH201", "Calculus", 4, "MATH", "Calculus I");
            await _dbContext.CourseDefinitions.AddAsync(course);
            await _dbContext.SaveChangesAsync();

            var retrievedCourse = await _repository.GetByIdAsync(courseId, CancellationToken.None);

            retrievedCourse.Should().NotBeNull();
            retrievedCourse!.Id.Should().Be(courseId);
            retrievedCourse.Code.Should().Be("MATH201");
        }

        [Fact]
        public async Task TC33_CourseDefinitionRepository_Should_Return_Null_When_Not_Found()
        {
            var result = await _repository.GetByIdAsync(Guid.NewGuid(), CancellationToken.None);

            result.Should().BeNull();
        }

        [Fact]
        public async Task TC34_CourseDefinitionRepository_Should_UpdateAsync()
        {
            var course = new CourseDefinition(Guid.NewGuid(), "ENG101", "English I", 3, "ENG", "English Course");
            await _dbContext.CourseDefinitions.AddAsync(course);
            await _dbContext.SaveChangesAsync();

            course.UpdateMasterData("English Composition I", 3, "Active", "Updated description");
            await _repository.UpdateAsync(course, CancellationToken.None);
            await _dbContext.SaveChangesAsync();

            var updatedCourse = await _dbContext.CourseDefinitions.FindAsync(course.Id);
            updatedCourse!.Title.Should().Be("English Composition I");
        }

        [Fact]
        public async Task TC35_CourseDefinitionRepository_Should_DeleteAsync()
        {
            var course = new CourseDefinition(Guid.NewGuid(), "HIST101", "History I", 3, "HIST", "History course");
            await _dbContext.CourseDefinitions.AddAsync(course);
            await _dbContext.SaveChangesAsync();

            _dbContext.CourseDefinitions.Remove(course);
            await _dbContext.SaveChangesAsync();

            var deletedCourse = await _dbContext.CourseDefinitions.FindAsync(course.Id);
            deletedCourse.Should().BeNull();
        }
    }
}
