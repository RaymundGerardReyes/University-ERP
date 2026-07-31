using MediatR;

namespace Hostel.Application.Features.GetRoomAllocation;

public sealed record RoomAllocationDto(
    string HostelName,
    string RoomNumber,
    string RoomType,
    string Status,
    IReadOnlyList<string> Roommates
);

public sealed record GetRoomAllocationQuery(string StudentId) : IRequest<RoomAllocationDto>;

public sealed class GetRoomAllocationQueryHandler : IRequestHandler<GetRoomAllocationQuery, RoomAllocationDto>
{
    public Task<RoomAllocationDto> Handle(GetRoomAllocationQuery request, CancellationToken cancellationToken)
    {
        var mockAllocation = new RoomAllocationDto(
            "Turing Residence Hall",
            "402-B",
            "Double Occupancy",
            "Allocated",
            new List<string> { "Alex Mercer" }
        );

        return Task.FromResult(mockAllocation);
    }
}
