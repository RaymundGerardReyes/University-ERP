namespace LmsOffline.Application.Interfaces;

using System.Threading;
using System.Threading.Tasks;

public interface IExternalIdentityService
{
    Task<bool> AuthenticateAndSyncAsync(string email, string plaintextPassword, CancellationToken cancellationToken = default);
}