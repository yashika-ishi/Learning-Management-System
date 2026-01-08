namespace LMS.Api.Jan.DTOs;

public class AssignmentCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime LastDate { get; set; }
    public string? GoogleDriveLink { get; set; }
}

public class AssignmentUpdateDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime LastDate { get; set; }
    public string? GoogleDriveLink { get; set; }
}

public class AssignmentResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public int InstructorId { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime LastDate { get; set; }
    public string? GoogleDriveLink { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool HasSubmission { get; set; } = false; // For students to check if they've submitted
    public DateTime? SubmissionDate { get; set; } // Date when student submitted (if applicable)
}
