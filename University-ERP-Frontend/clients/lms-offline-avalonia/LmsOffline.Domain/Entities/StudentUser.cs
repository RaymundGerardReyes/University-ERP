using System;

namespace LmsOffline.Domain.Entities
{
    public class StudentUser
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Email { get; private set; }
        
        // Added missing properties to resolve CS1061
        public string PasswordHash { get; private set; }
        public string PasswordSalt { get; private set; }
        public string AcademicProgram { get; private set; }
        public string Role { get; private set; }
        
        public DateTime? LastLoginDate { get; private set; }

        // Complete constructor for entity instantiation
        public StudentUser(
            Guid id, 
            string name, 
            string email, 
            string passwordHash, 
            string passwordSalt, 
            string academicProgram, 
            string role)
        {
            Id = id;
            Name = name;
            Email = email;
            PasswordHash = passwordHash;
            PasswordSalt = passwordSalt;
            AcademicProgram = academicProgram;
            Role = role;
        }

        // Added missing method to resolve CS1061
        public void RecordSuccessfulLogin()
        {
            LastLoginDate = DateTime.UtcNow;
        }
    }
}