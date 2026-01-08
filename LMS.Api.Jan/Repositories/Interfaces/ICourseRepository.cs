using LMS.Api.Jan.Models;

namespace LMS.Api.Jan.Repositories.Interfaces;

public interface ICourseRepository
{
    Task<Course> AddCourseAsync(Course course);
    Task<List<Course>> GetCoursesByInstructorAsync(int instructorId);
    Task<List<Course>> GetAllCoursesAsync();
    Task<Course?> GetCourseByIdAsync(int id);
    Task UpdateCourseAsync(Course course);
    Task PublishCourseAsync(int id);
    Task DeleteCourseAsync(int id);
}

