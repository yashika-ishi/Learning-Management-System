using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Services.Implementations;

public class AssignmentService : IAssignmentService
{
    private readonly IAssignmentRepository _assignmentRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly ISubmissionRepository _submissionRepository;
    private DateTime? submissionDate;

    public AssignmentService(IAssignmentRepository assignmentRepository, ICourseRepository courseRepository, ISubmissionRepository submissionRepository)
    {
        _assignmentRepository = assignmentRepository;
        _courseRepository = courseRepository;
        _submissionRepository = submissionRepository;
    }

    public async Task<AssignmentResponseDto> CreateAssignmentAsync(int instructorId, AssignmentCreateDto dto)
    {
        // Validate course exists and belongs to instructor (or admin can assign to any course)
        var course = await _courseRepository.GetCourseByIdAsync(dto.CourseId);
        if (course == null)
        {
            throw new InvalidOperationException("Course not found");
        }

        var assignment = new Assignment
        {
            Title = dto.Title,
            Description = dto.Description,
            CourseId = dto.CourseId,
            InstructorId = instructorId,
            StartDate = dto.StartDate,
            LastDate = dto.LastDate,
            GoogleDriveLink = dto.GoogleDriveLink,
            CreatedAt = DateTime.UtcNow
        };

        await _assignmentRepository.AddAssignmentAsync(assignment);

        return await MapToDtoAsync(assignment, 0); // 0 means no student context
    }

    public async Task<List<AssignmentResponseDto>> GetAssignmentsAsync(int userId, bool isAdmin, bool isInstructor, bool isStudent)
    {
        List<Assignment> assignments;

        if (isAdmin)
        {
            assignments = await _assignmentRepository.GetAllAssignmentsAsync();
        }
        else if (isInstructor)
        {
            assignments = await _assignmentRepository.GetAssignmentsByInstructorAsync(userId);
        }
        else if (isStudent)
        {
            assignments = await _assignmentRepository.GetAssignmentsForStudentAsync(userId);
        }
        else
        {
            return new List<AssignmentResponseDto>();
        }

        var result = new List<AssignmentResponseDto>();
        foreach (var assignment in assignments)
        {
            bool hasSubmission = false;
            DateTime? submissionDate = null;
            if (isStudent)
            {
                hasSubmission = await _assignmentRepository.HasSubmissionAsync(assignment.Id, userId);
                if (hasSubmission)
                {
                    var submission = await _submissionRepository.GetSubmissionByAssignmentAndStudentAsync(assignment.Id, userId);
                    submissionDate = submission?.SubmittedAt;
                }
            }
            result.Add(await MapToDtoAsync(assignment, isStudent ? userId : 0, hasSubmission, submissionDate));
        }

        return result;
    }

    public async Task<AssignmentResponseDto?> GetAssignmentByIdAsync(int id, int userId, bool isAdmin, bool isInstructor, bool isStudent)
    {
        var assignment = await _assignmentRepository.GetAssignmentByIdAsync(id);
        if (assignment == null) return null;

        // Check permissions
        if (isInstructor && !isAdmin && assignment.InstructorId != userId)
        {
            return null;
        }

        if (isStudent)
        {
            // Check if student is enrolled in the course
            var enrolledCourseIds = await _assignmentRepository.GetAssignmentsForStudentAsync(userId);
            if (!enrolledCourseIds.Any(a => a.Id == id))
            {
                return null;
            }
        }

        bool hasSubmission = false;
        DateTime? submissionDate = null;
        if (isStudent)
        {
            hasSubmission = await _assignmentRepository.HasSubmissionAsync(id, userId);
            if (hasSubmission)
            {
                var submission = await _submissionRepository.GetSubmissionByAssignmentAndStudentAsync(id, userId);
                submissionDate = submission?.SubmittedAt;
            }
        }
        return await MapToDtoAsync(assignment, isStudent ? userId : 0, hasSubmission, submissionDate);
    }

    public async Task<AssignmentResponseDto?> UpdateAssignmentAsync(int id, int userId, bool isAdmin, bool isInstructor, AssignmentUpdateDto dto)
    {
        var assignment = await _assignmentRepository.GetAssignmentByIdAsync(id);
        if (assignment == null) return null;

        // Check permissions
        if (!isAdmin && assignment.InstructorId != userId)
        {
            return null;
        }

        // Validate course exists
        var course = await _courseRepository.GetCourseByIdAsync(dto.CourseId);
        if (course == null)
        {
            throw new InvalidOperationException("Course not found");
        }

        assignment.Title = dto.Title;
        assignment.Description = dto.Description;
        assignment.CourseId = dto.CourseId;
        assignment.StartDate = dto.StartDate;
        assignment.LastDate = dto.LastDate;
        assignment.GoogleDriveLink = dto.GoogleDriveLink;

        await _assignmentRepository.UpdateAssignmentAsync(assignment);

        return await MapToDtoAsync(assignment, 0);
    }

    public async Task<bool> DeleteAssignmentAsync(int id, int userId, bool isAdmin, bool isInstructor)
    {
        var assignment = await _assignmentRepository.GetAssignmentByIdAsync(id);
        if (assignment == null) return false;

        // Check permissions
        if (!isAdmin && assignment.InstructorId != userId)
        {
            return false;
        }

        await _assignmentRepository.DeleteAssignmentAsync(id);
        return true;
    }

    private async Task<AssignmentResponseDto> MapToDtoAsync(Assignment assignment, int studentId, bool hasSubmission = false, DateTime? submissionDate = null)
    {
        // Reload with includes if needed
        if (assignment.Course == null || assignment.Instructor == null)
        {
            assignment = await _assignmentRepository.GetAssignmentByIdAsync(assignment.Id) ?? assignment;
        }

        return new AssignmentResponseDto
        {
            Id = assignment.Id,
            Title = assignment.Title,
            Description = assignment.Description,
            CourseId = assignment.CourseId,
            CourseName = assignment.Course?.CourseName ?? string.Empty,
            InstructorId = assignment.InstructorId,
            InstructorName = $"{assignment.Instructor?.FirstName} {assignment.Instructor?.LastName}".Trim(),
            StartDate = assignment.StartDate,
            LastDate = assignment.LastDate,
            GoogleDriveLink = assignment.GoogleDriveLink,
            CreatedAt = assignment.CreatedAt,
            HasSubmission = hasSubmission,
            SubmissionDate = submissionDate
        };
    }
}
