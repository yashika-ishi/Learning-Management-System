using LMS.Api.Jan.Models;

namespace LMS.Api.Jan.Repositories.Interfaces;

public interface ISubmissionRepository
{
    Task<Submission> AddSubmissionAsync(Submission submission);
    Task<List<Submission>> GetSubmissionsByAssignmentAsync(int assignmentId);
    Task<List<Submission>> GetSubmissionsByStudentAsync(int studentId);
    Task<List<Submission>> GetAllSubmissionsAsync();
    Task<List<Submission>> GetSubmissionsByInstructorAsync(int instructorId);
    Task<Submission?> GetSubmissionByIdAsync(int id);
    Task<Submission?> GetSubmissionByAssignmentAndStudentAsync(int assignmentId, int studentId);
    Task UpdateSubmissionAsync(Submission submission);
    Task DeleteSubmissionAsync(int id);
}
