namespace Finance.Tests.Integration.Endpoints;

using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Features.PayrollProcessing;
using Finance.Presentation.Endpoints;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SharedKernel.Domain.Primitives;
using Xunit;

public class PayrollEndpointIntegrationTests
{
    private readonly Mock<ISender> _senderMock = new();

    [Fact]
    public async Task Disburse_WhenCommandSucceeds_ReturnsOkWithTransactionId()
    {
        // Arrange (INT-PAY-01)
        _senderMock
            .Setup(s => s.Send(It.Is<DisbursePayrollCommand>(c => c.EmployeeId == "FAC-001" && c.Amount == 18000m), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Success("TX-TRF-PAYROLL-001"));

        var endpoint = new PayrollEndpoint(_senderMock.Object);
        var request = new DisbursePayrollRequest("FAC-001", "4859220011112222", 18000m, "Sep 2026");

        // Act
        var actionResult = await endpoint.Disburse(request, CancellationToken.None);

        // Assert
        var okResult = actionResult.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().NotBeNull();
    }

    [Fact]
    public async Task Disburse_WhenCommandFails_ReturnsBadRequestWithError()
    {
        // Arrange (INT-PAY-02)
        _senderMock
            .Setup(s => s.Send(It.IsAny<DisbursePayrollCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Failure(new Error("Finance.BankingError", "Internal transfer rejected by bank")));

        var endpoint = new PayrollEndpoint(_senderMock.Object);
        var request = new DisbursePayrollRequest("FAC-001", "4859220011112222", 18000m, "Sep 2026");

        // Act
        var actionResult = await endpoint.Disburse(request, CancellationToken.None);

        // Assert
        var badResult = actionResult.Should().BeOfType<BadRequestObjectResult>().Subject;
        badResult.Value.Should().NotBeNull();
    }
}

