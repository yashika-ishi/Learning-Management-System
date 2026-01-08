using Microsoft.EntityFrameworkCore;
using LMS.Api.Jan.Data;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;

namespace LMS.Api.Jan.Repositories.Implementations;

public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly AppDbContext _context;

    public EnrollmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Enrollment?> GetEnrollmentAsync(int studentId, int courseId)
    {
        return await _context.Enrollments
            .Include(e => e.Course)
            .Include(e => e.Student)
            .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);
    }

    public async Task<Enrollment> AddEnrollmentAsync(Enrollment enrollment)
    {
        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();
        return enrollment;
    }

    public async Task<List<Enrollment>> GetEnrollmentsForStudentAsync(int studentId)
    {
        return await _context.Enrollments
            .Include(e => e.Course)
            .Where(e => e.StudentId == studentId)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Enrollment>> GetAllEnrollmentsAsync()
    {
        return await _context.Enrollments
            .Include(e => e.Course)
            .Include(e => e.Student)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<Enrollment?> GetEnrollmentByIdAsync(int id)
    {
        return await _context.Enrollments
            .Include(e => e.Course)
            .Include(e => e.Student)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task UpdateEnrollmentAsync(Enrollment enrollment)
    {
        _context.Enrollments.Update(enrollment);
        await _context.SaveChangesAsync();
    }
}

