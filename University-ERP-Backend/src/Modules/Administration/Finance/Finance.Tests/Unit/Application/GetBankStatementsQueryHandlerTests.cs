namespace Finance.Tests.Unit.Application;

using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.GetBankStatements;
using FluentAssertions;
using Moq;
using SharedKernel.Domain.Primitives;
using Xunit;

public class GetBankStatementsQueryHandlerTests
{
    private readonly Mock<IPaymentGatewayService> _gatewayMock = new();

    [Fact]
    public async Task Handle_WhenFetchStatementsFails_ReturnsFailure()
    {
        // Arrange (HS-02)
        _gatewayMock
            .Setup(g => g.FetchStatementsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Failure(new Error("Finance.BankingError", "Statements service unavailable")));

        var handler = new GetBankStatementsQueryHandler(_gatewayMock.Object);
        var query = new GetBankStatementsQuery();

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingError");
    }

    [Fact]
    public async Task Handle_WhenFetchStatementsSucceeds_ReturnsJsonString()
    {
        // Arrange (HS-01)
        var expectedJson = "{\"account\":\"4859220013371001\",\"balance\":1250000.00}";
        _gatewayMock
            .Setup(g => g.FetchStatementsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Success(expectedJson));

        var handler = new GetBankStatementsQueryHandler(_gatewayMock.Object);
        var query = new GetBankStatementsQuery();

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(expectedJson);
    }
}

