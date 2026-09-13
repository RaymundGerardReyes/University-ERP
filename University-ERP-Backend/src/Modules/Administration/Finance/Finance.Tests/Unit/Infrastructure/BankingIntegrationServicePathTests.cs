namespace Finance.Tests.Unit.Infrastructure;

using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Infrastructure.Services;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Xunit;

public class BankingIntegrationServicePathTests
{
    private readonly PaymentGatewayOptions _options = new()
    {
        SecretKey = "sk_test_mock_key",
        SourceAccountId = "4859220013371001",
        SuccessUrl = "https://erp.university.edu/finance/success",
        CancelUrl = "https://erp.university.edu/finance/cancel"
    };

    private class MockHttpMessageHandler : HttpMessageHandler
    {
        private readonly Func<HttpRequestMessage, Task<HttpResponseMessage>> _handler;

        public MockHttpMessageHandler(Func<HttpRequestMessage, Task<HttpResponseMessage>> handler)
        {
            _handler = handler;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return _handler(request);
        }
    }

    private BankingIntegrationService CreateService(Func<HttpRequestMessage, Task<HttpResponseMessage>> handler)
    {
        var mockHandler = new MockHttpMessageHandler(handler);
        var httpClient = new HttpClient(mockHandler)
        {
            BaseAddress = new Uri("http://localhost:8080")
        };
        var optionsMock = Options.Create(_options);
        return new BankingIntegrationService(httpClient, optionsMock);
    }

    private static HttpResponseMessage JsonResponse(object obj, HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        var json = JsonSerializer.Serialize(obj);
        return new HttpResponseMessage(statusCode)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
    }

    // ==========================================
    // 1. CreateCheckoutSessionAsync Path Tests
    // ==========================================

    [Fact]
    public async Task CreateCheckoutSession_WhenJavaApiReturnsCheckoutUrl_ReturnsSuccessWithCheckoutUrl()
    {
        // Arrange (BC-01)
        var service = CreateService(req =>
        {
            req.RequestUri!.PathAndQuery.Should().Contain("/api/v1/gateway/checkout/sessions");
            req.Headers.Contains("X-API-Key").Should().BeTrue();
            req.Headers.Contains("X-Internal-BFF-Key").Should().BeTrue();
            
            var payload = new
            {
                data = new
                {
                    checkoutUrl = "https://checkout.novabank.internal/pay/sess-99"
                }
            };
            return Task.FromResult(JsonResponse(payload));
        });

        // Act
        var result = await service.CreateCheckoutSessionAsync("SESS-001", 1500.00m, "PHP", "idem-123", CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be("https://checkout.novabank.internal/pay/sess-99");
    }

    [Fact]
    public async Task CreateCheckoutSession_WhenJavaApiReturns200WithEmptyUrls_ReturnsFailure()
    {
        // Arrange (BC-03)
        var service = CreateService(_ =>
        {
            var payload = new { data = new { checkoutUrl = (string?)null } };
            return Task.FromResult(JsonResponse(payload));
        });

        // Act
        var result = await service.CreateCheckoutSessionAsync("SESS-001", 1500.00m, "PHP", "idem-123", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.PaymentGatewayError");
    }

    [Fact]
    public async Task CreateCheckoutSession_WhenJavaApiReturns400BadRequest_ReturnsPaymentGatewayError()
    {
        // Arrange (BC-04)
        var service = CreateService(_ =>
        {
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                Content = new StringContent("{\"error\":\"Invalid line items\"}", Encoding.UTF8, "application/json")
            });
        });

        // Act
        var result = await service.CreateCheckoutSessionAsync("SESS-001", 1500.00m, "PHP", "idem-123", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.PaymentGatewayError");
        result.Error.Description.Should().Contain("Invalid line items");
    }

    [Fact]
    public async Task CreateCheckoutSession_WhenJavaApiReturns500ServerError_ReturnsPaymentGatewayUnavailable()
    {
        // Arrange (BC-04-Server)
        var service = CreateService(_ =>
        {
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.InternalServerError)
            {
                Content = new StringContent("Gateway Database Down", Encoding.UTF8, "text/plain")
            });
        });

        // Act
        var result = await service.CreateCheckoutSessionAsync("SESS-001", 1500.00m, "PHP", "idem-123", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentGateway.Unavailable");
        result.Error.Description.Should().Contain("error code: 500");
    }

    [Fact]
    public async Task CreateCheckoutSession_WhenNetworkExceptionOccurs_ReturnsNetworkError()
    {
        // Arrange (BC-05)
        var service = CreateService(_ => throw new HttpRequestException("Connection refused by host"));

        // Act
        var result = await service.CreateCheckoutSessionAsync("SESS-001", 1500.00m, "PHP", "idem-123", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentGateway.NetworkError");
        result.Error.Description.Should().Contain("502");
    }

    // ====================================================
    // 2. GeneratePaymentInstrumentAsync (Dynamic QR) Tests
    // ====================================================

    [Fact]
    public async Task GeneratePaymentInstrument_WhenBothIntentAndQrSucceed_ReturnsSuccessWithQrReference()
    {
        // Arrange (BQ-01)
        var service = CreateService(req =>
        {
            if (req.RequestUri!.PathAndQuery.Contains("/api/v1/gateway/payments/intents"))
            {
                var intentResponse = new
                {
                    data = new
                    {
                        paymentIntentId = "pi_mock_12345",
                        provider = "NOVA_BANK",
                        checkoutType = "QR_PH",
                        checkoutUrl = "https://pay.novabank.internal",
                        transactionReference = "REF-99"
                    }
                };
                return Task.FromResult(JsonResponse(intentResponse));
            }

            if (req.RequestUri!.PathAndQuery.Contains("/api/v1/gateway/payment-intents/pi_mock_12345/qr"))
            {
                var qrResponse = new
                {
                    qrReference = "00020101021226540014PH.NOVAPAY.DYN0115NOVA000000000015204581253036085802PH5914UNIVERSITY-ERP6006MANILA"
                };
                return Task.FromResult(JsonResponse(qrResponse));
            }

            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.NotFound));
        });

        // Act
        var result = await service.GeneratePaymentInstrumentAsync("SESS-QR-001", 2500m, "PHP", CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().StartWith("00020101");
    }

    [Fact]
    public async Task GeneratePaymentInstrument_WhenIntentFailsWithHttpError_ReturnsFailure()
    {
        // Arrange (BQ-02)
        var service = CreateService(req =>
        {
            if (req.RequestUri!.PathAndQuery.Contains("/api/v1/gateway/payments/intents"))
            {
                return Task.FromResult(new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent("{\"error\":\"Invalid source account\"}", Encoding.UTF8, "application/json")
                });
            }
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.NotFound));
        });

        // Act
        var result = await service.GeneratePaymentInstrumentAsync("SESS-QR-001", 2500m, "PHP", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.PaymentGatewayError");
        result.Error.Description.Should().Contain("Invalid source account");
    }

    [Fact]
    public async Task GeneratePaymentInstrument_WhenIntentReturns200WithNoIntentId_ReturnsFailure()
    {
        // Arrange (BQ-03)
        var service = CreateService(req =>
        {
            var intentResponse = new
            {
                data = new { paymentIntentId = (string?)null }
            };
            return Task.FromResult(JsonResponse(intentResponse));
        });

        // Act
        var result = await service.GeneratePaymentInstrumentAsync("SESS-QR-001", 2500m, "PHP", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.PaymentGatewayError");
        result.Error.Description.Should().Contain("no PaymentIntentId");
    }

    [Fact]
    public async Task GeneratePaymentInstrument_WhenQrEndpointFailsWithHttpError_ReturnsFailure()
    {
        // Arrange (BQ-04)
        var service = CreateService(req =>
        {
            if (req.RequestUri!.PathAndQuery.Contains("/api/v1/gateway/payments/intents"))
            {
                return Task.FromResult(JsonResponse(new { data = new { paymentIntentId = "pi_valid_77" } }));
            }

            if (req.RequestUri!.PathAndQuery.Contains("/api/v1/gateway/payment-intents/pi_valid_77/qr"))
            {
                return Task.FromResult(new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("QR Ph generation service offline", Encoding.UTF8, "text/plain")
                });
            }

            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.NotFound));
        });

        // Act
        var result = await service.GeneratePaymentInstrumentAsync("SESS-QR-001", 2500m, "PHP", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.PaymentGatewayError");
        result.Error.Description.Should().Contain("QR Ph generation service offline");
    }

    [Fact]
    public async Task GeneratePaymentInstrument_WhenQrEndpointReturnsEmptyQrReference_ReturnsFailure()
    {
        // Arrange (BQ-05)
        var service = CreateService(req =>
        {
            if (req.RequestUri!.PathAndQuery.Contains("/api/v1/gateway/payments/intents"))
            {
                return Task.FromResult(JsonResponse(new { data = new { paymentIntentId = "pi_valid_88" } }));
            }

            if (req.RequestUri!.PathAndQuery.Contains("/api/v1/gateway/payment-intents/pi_valid_88/qr"))
            {
                return Task.FromResult(JsonResponse(new { qrReference = "" }));
            }

            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.NotFound));
        });

        // Act
        var result = await service.GeneratePaymentInstrumentAsync("SESS-QR-001", 2500m, "PHP", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.PaymentGatewayError");
        result.Error.Description.Should().Contain("Failed to parse QR string");
    }

    [Fact]
    public async Task GeneratePaymentInstrument_WhenNetworkExceptionOccurs_ReturnsBankingConnectionError()
    {
        // Arrange (BQ-06)
        var service = CreateService(_ => throw new HttpRequestException("Timeout contacting bank"));

        // Act
        var result = await service.GeneratePaymentInstrumentAsync("SESS-QR-001", 2500m, "PHP", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingConnectionError");
        result.Error.Description.Should().Contain("Could not connect to payment gateway");
    }

    // ==========================================
    // 3. ProcessCashDepositAsync Path Tests
    // ==========================================

    [Fact]
    public async Task ProcessCashDeposit_WhenDepositSucceeds_ReturnsSuccessWithTransactionId()
    {
        // Arrange (BD-01)
        var service = CreateService(req =>
        {
            req.RequestUri!.PathAndQuery.Should().Contain("/api/v1/transactions/deposit");
            var response = new
            {
                data = new
                {
                    transactionId = "TX-DEP-2026-9901",
                    status = "SUCCESS",
                    amount = 5000.00m
                }
            };
            return Task.FromResult(JsonResponse(response));
        });

        // Act
        var result = await service.ProcessCashDepositAsync(5000.00m, "REF-CASH-1", CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be("TX-DEP-2026-9901");
    }

    [Fact]
    public async Task ProcessCashDeposit_WhenDepositFailsWithHttpError_ReturnsBankingError()
    {
        // Arrange (BD-02)
        var service = CreateService(_ =>
        {
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                Content = new StringContent("{\"message\":\"Daily counter deposit ceiling exceeded\"}", Encoding.UTF8, "application/json")
            });
        });

        // Act
        var result = await service.ProcessCashDepositAsync(500000.00m, "REF-CASH-BIG", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingError");
        result.Error.Description.Should().Contain("Daily counter deposit ceiling exceeded");
    }

    [Fact]
    public async Task ProcessCashDeposit_WhenResponseMissingTransactionId_ReturnsFailure()
    {
        // Arrange (BD-03)
        var service = CreateService(_ =>
        {
            var response = new
            {
                data = new { transactionId = (string?)null, status = "PENDING" }
            };
            return Task.FromResult(JsonResponse(response));
        });

        // Act
        var result = await service.ProcessCashDepositAsync(500m, "REF-CASH-NIL", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingError");
    }

    [Fact]
    public async Task ProcessCashDeposit_WhenNetworkExceptionOccurs_ReturnsBankingConnectionError()
    {
        // Arrange (BD-04)
        var service = CreateService(_ => throw new HttpRequestException("Socket closed abnormally"));

        // Act
        var result = await service.ProcessCashDepositAsync(500m, "REF-CASH-NET", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingConnectionError");
    }

    // ==========================================
    // 4. ExecuteTransferAsync Path Tests
    // ==========================================

    [Fact]
    public async Task ExecuteTransfer_WhenTransferSucceeds_ReturnsSuccessWithTransactionId()
    {
        // Arrange (BT-01)
        var service = CreateService(req =>
        {
            req.RequestUri!.PathAndQuery.Should().Contain("/api/v1/transfers/internal");
            var response = new
            {
                data = new
                {
                    transactionId = "TX-TRF-2026-7788",
                    status = "COMPLETED",
                    amount = 12000.00m
                }
            };
            return Task.FromResult(JsonResponse(response));
        });

        // Act
        var result = await service.ExecuteTransferAsync("4859220099990001", 12000.00m, "Payroll Aug 2026", CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be("TX-TRF-2026-7788");
    }

    [Fact]
    public async Task ExecuteTransfer_WhenTransferFailsWithHttpError_ReturnsBankingError()
    {
        // Arrange (BT-02)
        var service = CreateService(_ =>
        {
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.UnprocessableEntity)
            {
                Content = new StringContent("{\"message\":\"Insufficient funds in university operating account\"}", Encoding.UTF8, "application/json")
            });
        });

        // Act
        var result = await service.ExecuteTransferAsync("4859220099990001", 99999999m, "Payroll", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingError");
        result.Error.Description.Should().Contain("Insufficient funds");
    }

    [Fact]
    public async Task ExecuteTransfer_WhenResponseMissingTransactionId_ReturnsFailure()
    {
        // Arrange (BT-03)
        var service = CreateService(_ =>
        {
            var response = new { data = new { transactionId = "" } };
            return Task.FromResult(JsonResponse(response));
        });

        // Act
        var result = await service.ExecuteTransferAsync("4859220099990001", 100m, "Test", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingError");
    }

    [Fact]
    public async Task ExecuteTransfer_WhenNetworkExceptionOccurs_ReturnsBankingConnectionError()
    {
        // Arrange (BT-04)
        var service = CreateService(_ => throw new HttpRequestException("DNS resolution failure"));

        // Act
        var result = await service.ExecuteTransferAsync("4859220099990001", 100m, "Test", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingConnectionError");
    }

    // ==========================================
    // 5. FetchStatementsAsync Path Tests
    // ==========================================

    [Fact]
    public async Task FetchStatements_WhenSucceeds_ReturnsSuccessWithStatementJson()
    {
        // Arrange (BS-01)
        var expectedJson = "{\"accountNumber\":\"4859220013371001\",\"transactions\":[{\"id\":\"TX-01\",\"amount\":5000}]}";
        var service = CreateService(req =>
        {
            req.RequestUri!.PathAndQuery.Should().Contain("/api/v1/statements/account/4859220013371001");
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(expectedJson, Encoding.UTF8, "application/json")
            });
        });

        // Act
        var result = await service.FetchStatementsAsync(CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(expectedJson);
    }

    [Fact]
    public async Task FetchStatements_WhenFailsWithHttpError_ReturnsBankingError()
    {
        // Arrange (BS-02)
        var service = CreateService(_ =>
        {
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.NotFound)
            {
                Content = new StringContent("{\"error\":\"Statement ledger period not found\"}", Encoding.UTF8, "application/json")
            });
        });

        // Act
        var result = await service.FetchStatementsAsync(CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingError");
        result.Error.Description.Should().Contain("Statement ledger period not found");
    }

    [Fact]
    public async Task FetchStatements_WhenNetworkExceptionOccurs_ReturnsBankingConnectionError()
    {
        // Arrange (BS-03)
        var service = CreateService(_ => throw new HttpRequestException("Connection dropped"));

        // Act
        var result = await service.FetchStatementsAsync(CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingConnectionError");
    }

    // ==========================================
    // 6. ProcessChargeAsync Path Tests
    // ==========================================

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public async Task ProcessCharge_WhenPaymentTokenIsEmpty_ReturnsInvalidToken(string? invalidToken)
    {
        // Arrange (BP-01)
        var service = CreateService(_ => Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)));

        // Act
        var result = await service.ProcessChargeAsync(invalidToken!, 100m, "PHP", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentGateway.InvalidToken");
    }

    [Fact]
    public async Task ProcessCharge_WhenTransferSucceeds_ReturnsSuccessWithTransactionId()
    {
        // Arrange (BP-02)
        var service = CreateService(_ =>
        {
            var response = new
            {
                data = new { transactionId = "TX-CHG-9900", status = "COMPLETED", amount = 1000m }
            };
            return Task.FromResult(JsonResponse(response));
        });

        // Act
        var result = await service.ProcessChargeAsync("SRC-ACC-01", 1000m, "PHP", CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be("TX-CHG-9900");
    }

    [Fact]
    public async Task ProcessCharge_WhenTransferFailsWithHttpError_ReturnsBankingError()
    {
        // Arrange (BP-03)
        var service = CreateService(_ =>
        {
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.PaymentRequired)
            {
                Content = new StringContent("{\"error\":\"Hold on source account\"}", Encoding.UTF8, "application/json")
            });
        });

        // Act
        var result = await service.ProcessChargeAsync("SRC-ACC-HOLD", 1000m, "PHP", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingError");
        result.Error.Description.Should().Contain("Hold on source account");
    }

    [Fact]
    public async Task ProcessCharge_WhenNetworkExceptionOccurs_ReturnsBankingConnectionError()
    {
        // Arrange (BP-04)
        var service = CreateService(_ => throw new HttpRequestException("Socket timeout"));

        // Act
        var result = await service.ProcessChargeAsync("SRC-ACC-01", 1000m, "PHP", CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingConnectionError");
    }
}

