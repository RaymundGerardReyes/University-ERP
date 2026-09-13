namespace Curriculum.Tests.Unit.Application;

using Curriculum.Application.Abstractions;
using Curriculum.Application.Features.GetCurriculumByProgram;
using Curriculum.Domain.Aggregates;
using FluentAssertions;
using NSubstitute;
using Xunit;

public class GetCurriculumByProgramQueryHandlerTests
{
    private readonly IAcademicProgramRepository _programRepo;
    private readonly ICurriculumPlanRepository _curriculumRepo;
    private readonly ICourseDefinitionRepository _courseRepo;
    private readonly GetCurriculumByProgramQueryHandler _handler;

    public GetCurriculumByProgramQueryHandlerTests()
    {
        _programRepo = Substitute.For<IAcademicProgramRepository>();
        _curriculumRepo = Substitute.For<ICurriculumPlanRepository>();
        _courseRepo = Substitute.For<ICourseDefinitionRepository>();
        _handler = new GetCurriculumByProgramQueryHandler(_programRepo, _curriculumRepo, _courseRepo);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenProgramNotFound()
    {
        // Arrange
        _programRepo.GetByCodeAsync("UNKNOWN", Arg.Any<CancellationToken>()).Returns((AcademicProgram?)null);

        // Act
        var result = await _handler.Handle(new GetCurriculumByProgramQuery("UNKNOWN"), CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Program.NotFound");
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenNoActiveCurriculumFound()
    {
        // Arrange
        var program = new AcademicProgram(Guid.NewGuid(), "BSA", "Bachelor of Science in Accountancy", "CBA", 173, 4);
        _programRepo.GetByCodeAsync("BSA", Arg.Any<CancellationToken>()).Returns(program);
        _curriculumRepo.GetActiveByProgramCodeAsync("BSA", Arg.Any<CancellationToken>()).Returns((AcademicCurriculum?)null);

        // Act
        var result = await _handler.Handle(new GetCurriculumByProgramQuery("BSA"), CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Curriculum.NotFound");
    }

    [Fact]
    public async Task Handle_ShouldReturnStructuredTree_WhenProgramAndCurriculumExist()
    {
        // Arrange
        var programId = Guid.NewGuid();
        var program = new AcademicProgram(programId, "BSA", "Bachelor of Science in Accountancy", "CBA", 173, 4);
        var curriculumId = Guid.NewGuid();
        var curriculum = new AcademicCurriculum(curriculumId, programId, "BSA", "2024-2025", "1.0", 173);

        var course1Id = Guid.NewGuid();
        var course2Id = Guid.NewGuid();
        curriculum.AddSubject(course1Id, "ACC101", 1, "First", 3);
        curriculum.AddSubject(course2Id, "ACC102", 1, "Second", 3);

        var course1 = new CourseDefinition(course1Id, "ACC101", "Financial Accounting 1", 3, "Accountancy", "Core");
        var course2 = new CourseDefinition(course2Id, "ACC102", "Financial Accounting 2", 3, "Accountancy", "Core");
        course2.AddPrerequisite("ACC101", "75", true);

        _programRepo.GetByCodeAsync("BSA", Arg.Any<CancellationToken>()).Returns(program);
        _curriculumRepo.GetActiveByProgramCodeAsync("BSA", Arg.Any<CancellationToken>()).Returns(curriculum);
        _courseRepo.GetAllAsync(Arg.Any<CancellationToken>()).Returns(new List<CourseDefinition> { course1, course2 });

        // Act
        var result = await _handler.Handle(new GetCurriculumByProgramQuery("BSA"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        var dto = result.Value;
        dto.ProgramCode.Should().Be("BSA");
        dto.TotalUnits.Should().Be(173);
        dto.Years.Should().HaveCount(1);
        dto.Years[0].YearLevel.Should().Be(1);
        dto.Years[0].Semesters.Should().HaveCount(2);

        var sem1 = dto.Years[0].Semesters.First(s => s.Semester == "First");
        sem1.Subjects.Should().HaveCount(1);
        sem1.Subjects[0].Code.Should().Be("ACC101");

        var sem2 = dto.Years[0].Semesters.First(s => s.Semester == "Second");
        sem2.Subjects.Should().HaveCount(1);
        sem2.Subjects[0].Code.Should().Be("ACC102");
        sem2.Subjects[0].PrerequisiteCodes.Should().Contain("ACC101");
    }
}
