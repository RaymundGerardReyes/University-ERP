namespace Finance.Tests.Integration.Endpoints;

using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.GetBankStatements;
using Finance.Presentation.Endpoints;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SharedKernel.Domain.Primitives;
using Xunit;

public class FinancialReportsEndpointIntegrationTests
{
    private readonly Mock<IStudentBillingRepository> _billingRepoMock = new();
    private readonly Mock<IPaymentSessionRepository> _sessionRepoMock = new();
    private readonly Mock<ICashTransactionRepository> _cashRepoMock = new();
    private readonly Mock<ISender> _senderMock = new();

    private FinancialReportsEndpoint CreateEndpoint()
    {
        return new FinancialReportsEndpoint(
            _billingRepoMock.Object,
            _sessionRepoMock.Object,
            _cashRepoMock.Object,
            _senderMock.Object);
    }

    [Fact]
    public async Task GetBankStatements_WhenQuerySucceeds_ReturnsContentWithApplicationJson()
    {
        // Arrange (INT-REP-01)
        var statementsJson = "{\"account\":\"4859220013371001\",\"statements\":[]}";
        _senderMock
            .Setup(s => s.Send(It.IsAny<GetBankStatementsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Success(statementsJson));

        var endpoint = CreateEndpoint();

        // Act
        var actionResult = await endpoint.GetBankStatements(CancellationToken.None);

        // Assert
        var contentResult = actionResult.Should().BeOfType<ContentResult>().Subject;
        contentResult.ContentType.Should().Be("application/json");
        contentResult.Content.Should().Be(statementsJson);
    }

    [Fact]
    public async Task GetBankStatements_WhenQueryFails_ReturnsBadRequest()
    {
        // Arrange (INT-REP-02)
        _senderMock
            .Setup(s => s.Send(It.IsAny<GetBankStatementsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Failure(new Error("Finance.BankingError", "Bank connection timeout")));

        var endpoint = CreateEndpoint();

        // Act
        var actionResult = await endpoint.GetBankStatements(CancellationToken.None);

        // Assert
        var badRequestResult = actionResult.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequestResult.Value.Should().NotBeNull();
    }
}

