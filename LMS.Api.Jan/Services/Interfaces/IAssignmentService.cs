using LMS.Api.Jan.DTOs;

namespace LMS.Api.Jan.Services.Interfaces;

public interface IAssignmentService
{
    Task<AssignmentResponseDto> CreateAssignmentAsync(int instructorId, AssignmentCreateDto dto);
    Task<List<AssignmentResponseDto>> GetAssignmentsAsync(int userId, bool isAdmin, bool isInstructor, bool isStudent);
    Task<AssignmentResponseDto?> GetAssignmentByIdAsync(int id, int userId, bool isAdmin, bool isInstructor, bool isStudent);
    Task<AssignmentResponseDto?> UpdateAssignmentAsync(int id, int userId, bool isAdmin, bool isInstructor, AssignmentUpdateDto dto);
    Task<bool> DeleteAssignmentAsync(int id, int userId, bool isAdmin, bool isInstructor);
}
