using Microsoft.EntityFrameworkCore;
using LMS.Api.Jan.Data;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;

namespace LMS.Api.Jan.Repositories.Implementations;

public class AssignmentRepository : IAssignmentRepository
{
    private readonly AppDbContext _context;

    public AssignmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Assignment> AddAssignmentAsync(Assignment assignment)
    {
        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();
        return assignment;
    }

    public async Task<List<Assignment>> GetAssignmentsByInstructorAsync(int instructorId)
    {
        return await _context.Assignments
            .Include(a => a.Course)
            .Include(a => a.Instructor)
            .Where(a => a.InstructorId == instructorId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Assignment>> GetAllAssignmentsAsync()
    {
        return await _context.Assignments
            .Include(a => a.Course)
            .Include(a => a.Instructor)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Assignment>> GetAssignmentsByCourseAsync(int courseId)
    {
        return await _context.Assignments
            .Include(a => a.Course)
            .Include(a => a.Instructor)
            .Where(a => a.CourseId == courseId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Assignment>> GetAssignmentsForStudentAsync(int studentId)
    {
        // Get courses the student is enrolled in
        var enrolledCourseIds = await _context.Enrollments
            .Where(e => e.StudentId == studentId && e.Status == "Approved")
            .Select(e => e.CourseId)
            .ToListAsync();

        return await _context.Assignments
            .Include(a => a.Course)
            .Include(a => a.Instructor)
            .Where(a => enrolledCourseIds.Contains(a.CourseId))
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<Assignment?> GetAssignmentByIdAsync(int id)
    {
        return await _context.Assignments
            .Include(a => a.Course)
            .Include(a => a.Instructor)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task UpdateAssignmentAsync(Assignment assignment)
    {
        _context.Assignments.Update(assignment);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAssignmentAsync(int id)
    {
        var assignment = await _context.Assignments.FindAsync(id);
        if (assignment == null) return;
        _context.Assignments.Remove(assignment);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> HasSubmissionAsync(int assignmentId, int studentId)
    {
        return await _context.Submissions
            .AnyAsync(s => s.AssignmentId == assignmentId && s.StudentId == studentId);
    }
}
