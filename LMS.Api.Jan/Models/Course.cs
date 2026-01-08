namespace LMS.Api.Jan.Models;

public class Course
{
    public int Id { get; set; }
    public int InstructorId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? YouTubeUrl { get; set; }
    public bool IsDraft { get; set; } = true; // kept for backward compatibility
    public string Status { get; set; } = "Draft"; // Draft, Pending, Published
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User Instructor { get; set; } = null!;
}

