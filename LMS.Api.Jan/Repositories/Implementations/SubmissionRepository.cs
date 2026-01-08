using Microsoft.EntityFrameworkCore;
using LMS.Api.Jan.Data;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;

namespace LMS.Api.Jan.Repositories.Implementations;

public class SubmissionRepository : ISubmissionRepository
{
    private readonly AppDbContext _context;

    public SubmissionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Submission> AddSubmissionAsync(Submission submission)
    {
        _context.Submissions.Add(submission);
        await _context.SaveChangesAsync();
        return submission;
    }

    public async Task<List<Submission>> GetSubmissionsByAssignmentAsync(int assignmentId)
    {
        return await _context.Submissions
            .Include(s => s.Assignment)
            .ThenInclude(a => a.Course)
            .Include(s => s.Student)
            .Where(s => s.AssignmentId == assignmentId)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();
    }

    public async Task<List<Submission>> GetSubmissionsByStudentAsync(int studentId)
    {
        return await _context.Submissions
            .Include(s => s.Assignment)
            .ThenInclude(a => a.Course)
            .Where(s => s.StudentId == studentId)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();
    }

    public async Task<List<Submission>> GetAllSubmissionsAsync()
    {
        return await _context.Submissions
            .Include(s => s.Assignment)
            .ThenInclude(a => a.Course)
            .Include(s => s.Student)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();
    }

    public async Task<List<Submission>> GetSubmissionsByInstructorAsync(int instructorId)
    {
        return await _context.Submissions
            .Include(s => s.Assignment)
            .ThenInclude(a => a.Course)
            .Include(s => s.Student)
            .Where(s => s.Assignment.InstructorId == instructorId)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();
    }

    public async Task<Submission?> GetSubmissionByIdAsync(int id)
    {
        return await _context.Submissions
            .Include(s => s.Assignment)
            .ThenInclude(a => a.Course)
            .Include(s => s.Student)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Submission?> GetSubmissionByAssignmentAndStudentAsync(int assignmentId, int studentId)
    {
        return await _context.Submissions
            .Include(s => s.Assignment)
            .ThenInclude(a => a.Course)
            .Include(s => s.Student)
            .FirstOrDefaultAsync(s => s.AssignmentId == assignmentId && s.StudentId == studentId);
    }

    public async Task UpdateSubmissionAsync(Submission submission)
    {
        _context.Submissions.Update(submission);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteSubmissionAsync(int id)
    {
        var submission = await _context.Submissions.FindAsync(id);
        if (submission == null) return;
        _context.Submissions.Remove(submission);
        await _context.SaveChangesAsync();
    }
}
