namespace LmsOffline.Application.Interfaces;

public interface IPasswordHasher
{
    string HashPassword(string password, byte[] salt);
    bool VerifyPassword(string password, string storedHash, byte[] salt);
    byte[] GenerateSalt();
}