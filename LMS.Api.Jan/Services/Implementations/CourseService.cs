using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Services.Implementations;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;

    public CourseService(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<CourseResponseDto> CreateCourseAsync(int instructorId, CourseCreateDto dto)
    {
        var course = new Course
        {
            InstructorId = instructorId,
            CourseName = dto.CourseName,
            CourseCode = dto.CourseCode,
            Description = dto.Description,
            YouTubeUrl = dto.YouTubeUrl,
            IsDraft = true,
            Status = "Draft",
            CreatedAt = DateTime.UtcNow
        };

        await _courseRepository.AddCourseAsync(course);

        return Map(course);
    }

    public async Task<List<CourseResponseDto>> GetCoursesAsync(int instructorId, bool isAdmin)
    {
        var courses = isAdmin
            ? await _courseRepository.GetAllCoursesAsync()
            : await _courseRepository.GetCoursesByInstructorAsync(instructorId);

        return courses.Select(Map).ToList();
    }

    public async Task<List<CourseResponseDto>> GetPublishedCoursesAsync()
    {
        var courses = await _courseRepository.GetAllCoursesAsync();
        return courses
            .Where(c => c.Status == "Published")
            .Select(Map)
            .ToList();
    }

    public async Task<CourseResponseDto?> GetCourseByIdAsync(int id, int instructorId, bool isAdmin)
    {
        var course = await _courseRepository.GetCourseByIdAsync(id);
        if (course == null) return null;

        if (!isAdmin && course.InstructorId != instructorId)
        {
            return null;
        }

        return Map(course);
    }

    public async Task<CourseResponseDto?> UpdateCourseAsync(int id, int instructorId, bool isAdmin, CourseUpdateDto dto)
    {
        var course = await _courseRepository.GetCourseByIdAsync(id);
        if (course == null) return null;
        if (!isAdmin && course.InstructorId != instructorId) return null;

        course.CourseName = dto.CourseName;
        course.CourseCode = dto.CourseCode;
        course.Description = dto.Description;
        course.YouTubeUrl = dto.YouTubeUrl;

        await _courseRepository.UpdateCourseAsync(course);

        return Map(course);
    }

    public async Task<bool> RequestPublishAsync(int id, int instructorId, bool isAdmin)
    {
        var course = await _courseRepository.GetCourseByIdAsync(id);
        if (course == null) return false;
        if (!isAdmin && course.InstructorId != instructorId) return false;

        course.IsDraft = false;
        course.Status = "Pending";
        await _courseRepository.UpdateCourseAsync(course);
        return true;
    }

    public async Task<bool> ApprovePublishAsync(int id, int instructorId, bool isAdmin)
    {
        var course = await _courseRepository.GetCourseByIdAsync(id);
        if (course == null) return false;
        if (!isAdmin) return false;

        course.IsDraft = false;
        course.Status = "Published";
        await _courseRepository.UpdateCourseAsync(course);
        return true;
    }

    public async Task<bool> DeleteCourseAsync(int id, int instructorId, bool isAdmin)
    {
        var course = await _courseRepository.GetCourseByIdAsync(id);
        if (course == null) return false;
        if (!isAdmin && course.InstructorId != instructorId) return false;

        await _courseRepository.DeleteCourseAsync(id);
        return true;
    }

    private static CourseResponseDto Map(Course course) => new CourseResponseDto
    {
        Id = course.Id,
        CourseName = course.CourseName,
        CourseCode = course.CourseCode,
        Description = course.Description,
        YouTubeUrl = course.YouTubeUrl,
        IsDraft = course.IsDraft,
        Status = course.Status,
        CreatedAt = course.CreatedAt
    };
}

