namespace LMS.Api.Jan.DTOs;

public class SubmissionCreateDto
{
    public int AssignmentId { get; set; }
    public string SubmissionTitle { get; set; } = string.Empty;
    public string Solution { get; set; } = string.Empty;
    public string? GoogleDriveLink { get; set; }
}

public class SubmissionResponseDto
{
    public int Id { get; set; }
    public int AssignmentId { get; set; }
    public string AssignmentTitle { get; set; } = string.Empty;
    public int StudentId { get; set; }
    public string StudentFirstName { get; set; } = string.Empty;
    public string StudentLastName { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public string SubmissionTitle { get; set; } = string.Empty;
    public string Solution { get; set; } = string.Empty;
    public string? GoogleDriveLink { get; set; }
    public DateTime SubmittedAt { get; set; }
}
