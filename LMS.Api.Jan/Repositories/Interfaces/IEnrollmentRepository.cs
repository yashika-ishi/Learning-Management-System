using LMS.Api.Jan.Models;

namespace LMS.Api.Jan.Repositories.Interfaces;

public interface IEnrollmentRepository
{
    Task<Enrollment?> GetEnrollmentAsync(int studentId, int courseId);
    Task<Enrollment> AddEnrollmentAsync(Enrollment enrollment);
    Task<List<Enrollment>> GetEnrollmentsForStudentAsync(int studentId);
    Task<List<Enrollment>> GetAllEnrollmentsAsync();
    Task<Enrollment?> GetEnrollmentByIdAsync(int id);
    Task UpdateEnrollmentAsync(Enrollment enrollment);
}

