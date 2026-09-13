namespace Finance.Tests.Integration.Endpoints;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Domain.Aggregates;
using Finance.Presentation.Endpoints;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SharedKernel.Domain.Primitives;
using Xunit;

public class CashierQueueEndpointIntegrationTests
{
    private readonly Mock<ICashTransactionRepository> _cashRepoMock = new();
    private readonly Mock<IPaymentSessionRepository> _sessionRepoMock = new();
    private readonly Mock<IPaymentGatewayService> _gatewayMock = new();

    private CashierQueueEndpoint CreateEndpoint()
    {
        return new CashierQueueEndpoint(_cashRepoMock.Object, _sessionRepoMock.Object, _gatewayMock.Object);
    }

    [Fact]
    public async Task ProcessPayment_WhenTargetTokenMatchesCashTransaction_DepositsAndCompletesTransaction()
    {
        // Arrange (INT-CSH-01)
        var cashTxn = CashTransaction.Create("STU-2026-01", 3500.00m).Value;
        var token = cashTxn.TransactionToken;
        _cashRepoMock
            .Setup(r => r.GetByTokenAsync(token, It.IsAny<CancellationToken>()))
            .ReturnsAsync(cashTxn);

        _gatewayMock
            .Setup(g => g.ProcessCashDepositAsync(3500.00m, token, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Success("BANK-DEP-9988"));

        var endpoint = CreateEndpoint();
        var request = new ProcessCashierPaymentRequest("STU-2026-01", 3500.00m, "Cash paid", token);

        // Act
        var actionResult = await endpoint.ProcessPayment(request, CancellationToken.None);

        // Assert
        var okResult = actionResult.Should().BeOfType<OkObjectResult>().Subject;
        cashTxn.Status.Should().Be("Completed");
        _gatewayMock.Verify(g => g.ProcessCashDepositAsync(3500.00m, token, It.IsAny<CancellationToken>()), Times.Once);
        _cashRepoMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ProcessPayment_WhenTargetTokenMatchesCashTransactionButDepositFails_ReturnsBadRequest()
    {
        // Arrange (INT-CSH-04a)
        var cashTxn = CashTransaction.Create("STU-2026-02", 4000.00m).Value;
        var token = cashTxn.TransactionToken;
        _cashRepoMock
            .Setup(r => r.GetByTokenAsync(token, It.IsAny<CancellationToken>()))
            .ReturnsAsync(cashTxn);

        _gatewayMock
            .Setup(g => g.ProcessCashDepositAsync(4000.00m, token, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Failure(new Error("Finance.BankingError", "Vault connection lost")));

        var endpoint = CreateEndpoint();
        var request = new ProcessCashierPaymentRequest("STU-2026-02", 4000.00m, "Cash paid", token);

        // Act
        var actionResult = await endpoint.ProcessPayment(request, CancellationToken.None);

        // Assert
        actionResult.Should().BeOfType<BadRequestObjectResult>();
        cashTxn.Status.Should().Be("Pending");
        _cashRepoMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ProcessPayment_WhenTargetTokenMatchesPaymentSession_DepositsAndReconcilesSession()
    {
        // Arrange (INT-CSH-02)
        var session = PaymentSession.Create("INV-500", "APP-500", 2500.00m, "Tuition Downpayment").Value;
        session.InitiatePayment("init-ref-1", "Gateway");

        _cashRepoMock
            .Setup(r => r.GetByTokenAsync(session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((CashTransaction?)null);

        _sessionRepoMock
            .Setup(r => r.GetBySessionIdAsync(session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(session);

        _gatewayMock
            .Setup(g => g.ProcessCashDepositAsync(2500.00m, session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Success("BANK-DEP-7766"));

        var endpoint = CreateEndpoint();
        var request = new ProcessCashierPaymentRequest("APP-500", 2500.00m, "Over the counter", session.SessionId);

        // Act
        var actionResult = await endpoint.ProcessPayment(request, CancellationToken.None);

        // Assert
        actionResult.Should().BeOfType<OkObjectResult>();
        session.Status.Should().Be("Paid");
        _sessionRepoMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ProcessPayment_WhenTokenMatchesPaymentSessionButDepositFails_ReturnsBadRequest()
    {
        // Arrange (INT-CSH-04b)
        var session = PaymentSession.Create("INV-501", "APP-501", 2500.00m, "Tuition").Value;

        _cashRepoMock
            .Setup(r => r.GetByTokenAsync(session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((CashTransaction?)null);

        _sessionRepoMock
            .Setup(r => r.GetBySessionIdAsync(session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(session);

        _gatewayMock
            .Setup(g => g.ProcessCashDepositAsync(2500.00m, session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Failure(new Error("Finance.BankingError", "Cashier terminal suspended")));

        var endpoint = CreateEndpoint();
        var request = new ProcessCashierPaymentRequest("APP-501", 2500.00m, "Cash", session.SessionId);

        // Act
        var actionResult = await endpoint.ProcessPayment(request, CancellationToken.None);

        // Assert
        actionResult.Should().BeOfType<BadRequestObjectResult>();
        _sessionRepoMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ProcessPayment_WhenTokenMatchesNeither_ExecutesFallbackDeposit()
    {
        // Arrange (INT-CSH-03)
        _cashRepoMock
            .Setup(r => r.GetByTokenAsync("UNKNOWN-TOKEN", It.IsAny<CancellationToken>()))
            .ReturnsAsync((CashTransaction?)null);

        _sessionRepoMock
            .Setup(r => r.GetBySessionIdAsync("UNKNOWN-TOKEN", It.IsAny<CancellationToken>()))
            .ReturnsAsync((PaymentSession?)null);

        _gatewayMock
            .Setup(g => g.ProcessCashDepositAsync(1000m, "UNKNOWN-TOKEN", It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Success("BANK-DEP-FALLBACK-1"));

        var endpoint = CreateEndpoint();
        var request = new ProcessCashierPaymentRequest("WALK-IN-STUDENT", 1000m, "Walk-in cash", "UNKNOWN-TOKEN");

        // Act
        var actionResult = await endpoint.ProcessPayment(request, CancellationToken.None);

        // Assert
        var okResult = actionResult.Should().BeOfType<OkObjectResult>().Subject;
        _gatewayMock.Verify(g => g.ProcessCashDepositAsync(1000m, "UNKNOWN-TOKEN", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetQueue_AggregatesBothCashTransactionsAndPaymentSessions()
    {
        // Arrange (INT-CSH-05)
        var cashTxn = CashTransaction.Create("STU-1", 100m).Value;
        var session = PaymentSession.Create("INV-1", "APP-1", 200m, "Downpayment").Value;

        _cashRepoMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new List<CashTransaction> { cashTxn });
        _sessionRepoMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new List<PaymentSession> { session });

        var endpoint = CreateEndpoint();

        // Act
        var actionResult = await endpoint.GetQueue(CancellationToken.None);

        // Assert
        var okResult = actionResult.Should().BeOfType<OkObjectResult>().Subject;
        var list = okResult.Value.Should().BeAssignableTo<IEnumerable<CashierTransactionItemDto>>().Subject;
        list.Should().HaveCount(2);
    }
}
