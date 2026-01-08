using LMS.Api.Jan.DTOs;

namespace LMS.Api.Jan.Services.Interfaces;

public interface IEnrollmentService
{
    Task<EnrollmentResponseDto?> RequestEnrollmentAsync(int studentId, EnrollmentRequestDto dto);
    Task<List<EnrollmentResponseDto>> GetStudentEnrollmentsAsync(int studentId);
    Task<List<EnrollmentResponseDto>> GetAllEnrollmentsAsync();
    Task<bool> ApproveEnrollmentAsync(int enrollmentId, bool isApproved);
}

