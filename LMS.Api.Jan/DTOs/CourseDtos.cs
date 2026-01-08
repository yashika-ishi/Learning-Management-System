namespace LMS.Api.Jan.DTOs;

public class CourseCreateDto
{
    public string CourseName { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? YouTubeUrl { get; set; }
}

public class CourseUpdateDto
{
    public string CourseName { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? YouTubeUrl { get; set; }
}

public class CourseResponseDto
{
    public int Id { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? YouTubeUrl { get; set; }
    public bool IsDraft { get; set; }
    public string Status { get; set; } = "Draft";
    public DateTime CreatedAt { get; set; }
}

