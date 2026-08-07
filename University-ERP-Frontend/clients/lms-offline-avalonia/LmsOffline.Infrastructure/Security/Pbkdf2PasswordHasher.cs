namespace LmsOffline.Infrastructure.Security;

using System;
using System.Security.Cryptography;
using LmsOffline.Application.Interfaces;

public sealed class Pbkdf2PasswordHasher : IPasswordHasher
{
    private const int Iterations = 100_000;
    private const int KeySize = 32; // 256 bits

    public byte[] GenerateSalt()
    {
        return RandomNumberGenerator.GetBytes(16); // 128-bit salt
    }

    public string HashPassword(string password, byte[] salt)
    {
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
            password, 
            salt, 
            Iterations, 
            HashAlgorithmName.SHA256, 
            KeySize);
            
        return Convert.ToBase64String(hash);
    }

    public bool VerifyPassword(string password, string storedHash, byte[] salt)
    {
        string computedHash = HashPassword(password, salt);
        return CryptographicOperations.FixedTimeEquals(
            Convert.FromBase64String(computedHash), 
            Convert.FromBase64String(storedHash));
    }
}