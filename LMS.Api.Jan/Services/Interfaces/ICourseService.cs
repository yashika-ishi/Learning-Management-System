using LMS.Api.Jan.DTOs;

namespace LMS.Api.Jan.Services.Interfaces;

public interface ICourseService
{
    Task<CourseResponseDto> CreateCourseAsync(int instructorId, CourseCreateDto dto);
    Task<List<CourseResponseDto>> GetCoursesAsync(int instructorId, bool isAdmin);
    Task<List<CourseResponseDto>> GetPublishedCoursesAsync();
    Task<CourseResponseDto?> GetCourseByIdAsync(int id, int instructorId, bool isAdmin);
    Task<CourseResponseDto?> UpdateCourseAsync(int id, int instructorId, bool isAdmin, CourseUpdateDto dto);
    Task<bool> RequestPublishAsync(int id, int instructorId, bool isAdmin);
    Task<bool> ApprovePublishAsync(int id, int instructorId, bool isAdmin);
    Task<bool> DeleteCourseAsync(int id, int instructorId, bool isAdmin);
}

