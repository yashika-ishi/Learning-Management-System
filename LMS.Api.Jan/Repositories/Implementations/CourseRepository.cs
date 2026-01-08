using Microsoft.EntityFrameworkCore;
using LMS.Api.Jan.Data;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;

namespace LMS.Api.Jan.Repositories.Implementations;

public class CourseRepository : ICourseRepository
{
    private readonly AppDbContext _context;

    public CourseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Course> AddCourseAsync(Course course)
    {
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return course;
    }

    public async Task<List<Course>> GetCoursesByInstructorAsync(int instructorId)
    {
        return await _context.Courses
            .Where(c => c.InstructorId == instructorId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Course>> GetAllCoursesAsync()
    {
        return await _context.Courses
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Course?> GetCourseByIdAsync(int id)
    {
        return await _context.Courses.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task UpdateCourseAsync(Course course)
    {
        _context.Courses.Update(course);
        await _context.SaveChangesAsync();
    }

    public async Task PublishCourseAsync(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null) return;

        course.IsDraft = false;
        course.Status = "Published";
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCourseAsync(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null) return;
        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
    }
}

