namespace Finance.Application.Features.GetBankStatements;

using MediatR;
using SharedKernel.Domain.Primitives;
using Finance.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record GetBankStatementsQuery() : IRequest<Result<string>>;

public sealed class GetBankStatementsQueryHandler : IRequestHandler<GetBankStatementsQuery, Result<string>>
{
    private readonly IPaymentGatewayService _bankingService;

    public GetBankStatementsQueryHandler(IPaymentGatewayService bankingService)
    {
        _bankingService = bankingService;
    }

    public async Task<Result<string>> Handle(GetBankStatementsQuery request, CancellationToken cancellationToken)
    {
        return await _bankingService.FetchStatementsAsync(cancellationToken);
    }
}

