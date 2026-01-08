namespace LMS.Api.Jan.Models;

public class Assignment
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public int InstructorId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime LastDate { get; set; }
    public string? GoogleDriveLink { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Course Course { get; set; } = null!;
    public User Instructor { get; set; } = null!;
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
