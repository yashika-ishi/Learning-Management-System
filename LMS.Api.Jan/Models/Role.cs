namespace LMS.Api.Jan.Models;

public class Role
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    // Navigation property
    public ICollection<User> Users { get; set; } = new List<User>();
}
