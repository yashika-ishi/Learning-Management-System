using LMS.Api.Jan.DTOs;

namespace LMS.Api.Jan.Services.Interfaces;

public interface ISubmissionService
{
    Task<SubmissionResponseDto> CreateSubmissionAsync(int studentId, SubmissionCreateDto dto);
    Task<List<SubmissionResponseDto>> GetSubmissionsAsync(int userId, bool isAdmin, bool isInstructor, bool isStudent);
    Task<SubmissionResponseDto?> GetSubmissionByIdAsync(int id, int userId, bool isAdmin, bool isInstructor, bool isStudent);
}
