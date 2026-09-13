namespace Curriculum.Tests.Unit.Application;

using Curriculum.Application.Abstractions;
using Curriculum.Application.Features.GetAllPrograms;
using Curriculum.Domain.Aggregates;
using FluentAssertions;
using NSubstitute;
using Xunit;

public class GetAllProgramsQueryHandlerTests
{
    private readonly IAcademicProgramRepository _repository;
    private readonly GetAllProgramsQueryHandler _handler;

    public GetAllProgramsQueryHandlerTests()
    {
        _repository = Substitute.For<IAcademicProgramRepository>();
        _handler = new GetAllProgramsQueryHandler(_repository);
    }

    [Fact]
    public async Task Handle_ShouldReturnAllPrograms_WhenProgramsExist()
    {
        // Arrange
        var programs = new List<AcademicProgram>
        {
            new(Guid.NewGuid(), "BSA", "Bachelor of Science in Accountancy", "CBA", 173, 4),
            new(Guid.NewGuid(), "BSCS", "Bachelor of Science in Computer Science", "CCS", 145, 4),
            new(Guid.NewGuid(), "BSIT", "Bachelor of Science in Information Technology", "CCS", 143, 4)
        };

        _repository.GetAllAsync(Arg.Any<CancellationToken>()).Returns(programs);

        // Act
        var result = await _handler.Handle(new GetAllProgramsQuery(), CancellationToken.None);

        // Assert
        result.Should().HaveCount(3);
        result[0].Code.Should().Be("BSA");
        result[0].TotalUnits.Should().Be(173);
        result[1].Code.Should().Be("BSCS");
        result[1].TotalUnits.Should().Be(145);
        result[2].Code.Should().Be("BSIT");
        result[2].TotalUnits.Should().Be(143);
    }

    [Fact]
    public async Task Handle_ShouldReturnEmptyList_WhenNoProgramsExist()
    {
        // Arrange
        _repository.GetAllAsync(Arg.Any<CancellationToken>()).Returns(new List<AcademicProgram>());

        // Act
        var result = await _handler.Handle(new GetAllProgramsQuery(), CancellationToken.None);

        // Assert
        result.Should().BeEmpty();
    }
}

