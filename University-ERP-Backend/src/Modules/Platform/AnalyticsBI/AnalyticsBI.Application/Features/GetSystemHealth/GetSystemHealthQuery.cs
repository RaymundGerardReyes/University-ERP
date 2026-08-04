namespace AnalyticsBI.Application.Features.GetSystemHealth;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public sealed record SystemHealthDto(string Component, string Status, string Detail);

public sealed record GetSystemHealthQuery() : IRequest<IReadOnlyList<SystemHealthDto>>;

public sealed class GetSystemHealthQueryHandler : IRequestHandler<GetSystemHealthQuery, IReadOnlyList<SystemHealthDto>>
{
    public Task<IReadOnlyList<SystemHealthDto>> Handle(GetSystemHealthQuery request, CancellationToken cancellationToken)
    {
        var mockHealth = new List<SystemHealthDto>
        {
            new("Event Bus (RabbitMQ)", "OK", "142,059 processed (24h)"),
            new("Payment Gateway (Stripe)", "OK", "Active"),
            new("SMS Provider (Twilio)", "OK", "Active")
        };

        return Task.FromResult<IReadOnlyList<SystemHealthDto>>(mockHealth);
    }
}