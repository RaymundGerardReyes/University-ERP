namespace Finance.Application.Features.PayrollProcessing;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record DisbursePayrollCommand(string EmployeeId, string DestinationAccount, decimal Amount, string PayPeriod) : IRequest<Result<string>>;

public sealed class DisbursePayrollCommandHandler : IRequestHandler<DisbursePayrollCommand, Result<string>>
{
    private readonly IPaymentGatewayService _bankingService;

    public DisbursePayrollCommandHandler(IPaymentGatewayService bankingService)
    {
        _bankingService = bankingService;
    }

    public async Task<Result<string>> Handle(DisbursePayrollCommand request, CancellationToken cancellationToken)
    {
        var purpose = $"Payroll Disbursement {request.PayPeriod} for {request.EmployeeId}";
        
        // Orchestrate with Java Banking API
        var transferResult = await _bankingService.ExecuteTransferAsync(
            request.DestinationAccount, 
            request.Amount, 
            purpose, 
            cancellationToken);

        if (transferResult.IsFailure)
        {
            return Result<string>.Failure(transferResult.Error);
        }

        return Result<string>.Success(transferResult.Value);
    }
}

