using LMS.Api.Jan.Models;

namespace LMS.Api.Jan.Repositories.Interfaces;

public interface IAssignmentRepository
{
    Task<Assignment> AddAssignmentAsync(Assignment assignment);
    Task<List<Assignment>> GetAssignmentsByInstructorAsync(int instructorId);
    Task<List<Assignment>> GetAllAssignmentsAsync();
    Task<List<Assignment>> GetAssignmentsByCourseAsync(int courseId);
    Task<List<Assignment>> GetAssignmentsForStudentAsync(int studentId);
    Task<Assignment?> GetAssignmentByIdAsync(int id);
    Task UpdateAssignmentAsync(Assignment assignment);
    Task DeleteAssignmentAsync(int id);
    Task<bool> HasSubmissionAsync(int assignmentId, int studentId);
}
