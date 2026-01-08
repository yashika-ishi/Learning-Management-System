namespace LMS.Api.Jan.DTOs;

public class EnrollmentRequestDto
{
    public int CourseId { get; set; }
}

public class EnrollmentResponseDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? YouTubeUrl { get; set; }
    public int StudentId { get; set; }
    public string StudentFirstName { get; set; } = string.Empty;
    public string StudentLastName { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
}

public class EnrollmentApprovalDto
{
    public int EnrollmentId { get; set; }
    public bool IsApproved { get; set; }
}

