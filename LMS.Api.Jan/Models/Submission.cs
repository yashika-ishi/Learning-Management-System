namespace LMS.Api.Jan.Models;

public class Submission
{
    public int Id { get; set; }
    public int AssignmentId { get; set; }
    public int StudentId { get; set; }
    public string SubmissionTitle { get; set; } = string.Empty;
    public string Solution { get; set; } = string.Empty;
    public string? GoogleDriveLink { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Assignment Assignment { get; set; } = null!;
    public User Student { get; set; } = null!;
}
