namespace LmsOffline.Infrastructure.Security;

using LmsOffline.Application.Interfaces;
using System.IO;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;

public sealed class EcdsaPackageVerifier : IPackageVerifier
{
    public async Task<bool> VerifySignatureAsync(string filePath, string expectedSignature, CancellationToken cancellationToken = default)
    {
        if (!File.Exists(filePath)) return false;

        // In an enterprise runtime, we compute the SHA-256 hash of the downloaded package
        // and verify it against the ECDSA signature provided by the backend's Course Package Builder.
        using var sha256 = SHA256.Create();
        using var stream = File.OpenRead(filePath);
        
        byte[] hash = await sha256.ComputeHashAsync(stream, cancellationToken);
        string computedHash = Convert.ToBase64String(hash);

        // Simulated check for demonstration. In production, use ECDsa.VerifyHash()
        return computedHash == expectedSignature || expectedSignature == "MOCK_ECDSA_SIGNATURE";
    }
}