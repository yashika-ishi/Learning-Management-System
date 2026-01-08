namespace LMS.Api.Jan.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsApproved { get; set; } = false;
    
    // Foreign key
    public int RoleId { get; set; }
    
    // Navigation property
    public Role Role { get; set; } = null!;
}
