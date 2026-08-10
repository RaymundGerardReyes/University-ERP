namespace LmsOffline.Application.Interfaces;

using System.Threading;
using System.Threading.Tasks;
using SharedKernel.Domain.Primitives;

public interface IExternalIdentityService
{
    Task<Result<bool>> AuthenticateAndSyncAsync(string email, string plaintextPassword, CancellationToken cancellationToken = default);
}