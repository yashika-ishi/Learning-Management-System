using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Services.Implementations;

public class SubmissionService : ISubmissionService
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IAssignmentRepository _assignmentRepository;

    public SubmissionService(ISubmissionRepository submissionRepository, IAssignmentRepository assignmentRepository)
    {
        _submissionRepository = submissionRepository;
        _assignmentRepository = assignmentRepository;
    }

    public async Task<SubmissionResponseDto> CreateSubmissionAsync(int studentId, SubmissionCreateDto dto)
    {
        // Check if assignment exists
        var assignment = await _assignmentRepository.GetAssignmentByIdAsync(dto.AssignmentId);
        if (assignment == null)
        {
            throw new InvalidOperationException("Assignment not found");
        }

        // Check if student is enrolled in the course
        var studentAssignments = await _assignmentRepository.GetAssignmentsForStudentAsync(studentId);
        if (!studentAssignments.Any(a => a.Id == dto.AssignmentId))
        {
            throw new UnauthorizedAccessException("You are not enrolled in this course");
        }

        // Check if submission already exists - if so, update it
        var existingSubmission = await _submissionRepository.GetSubmissionByAssignmentAndStudentAsync(dto.AssignmentId, studentId);
        
        if (existingSubmission != null)
        {
            // Update existing submission
            existingSubmission.SubmissionTitle = dto.SubmissionTitle;
            existingSubmission.Solution = dto.Solution;
            existingSubmission.GoogleDriveLink = dto.GoogleDriveLink;
            existingSubmission.SubmittedAt = DateTime.UtcNow; // Update submission time
            
            await _submissionRepository.UpdateSubmissionAsync(existingSubmission);
            return await MapToDtoAsync(existingSubmission);
        }

        var submission = new Submission
        {
            AssignmentId = dto.AssignmentId,
            StudentId = studentId,
            SubmissionTitle = dto.SubmissionTitle,
            Solution = dto.Solution,
            GoogleDriveLink = dto.GoogleDriveLink,
            SubmittedAt = DateTime.UtcNow
        };

        await _submissionRepository.AddSubmissionAsync(submission);

        return await MapToDtoAsync(submission);
    }

    public async Task<List<SubmissionResponseDto>> GetSubmissionsAsync(int userId, bool isAdmin, bool isInstructor, bool isStudent)
    {
        List<Submission> submissions;

        if (isAdmin)
        {
            submissions = await _submissionRepository.GetAllSubmissionsAsync();
        }
        else if (isInstructor)
        {
            submissions = await _submissionRepository.GetSubmissionsByInstructorAsync(userId);
        }
        else if (isStudent)
        {
            submissions = await _submissionRepository.GetSubmissionsByStudentAsync(userId);
        }
        else
        {
            return new List<SubmissionResponseDto>();
        }

        return submissions.Select(s => MapToDtoAsync(s).Result).ToList();
    }

    public async Task<SubmissionResponseDto?> GetSubmissionByIdAsync(int id, int userId, bool isAdmin, bool isInstructor, bool isStudent)
    {
        var submission = await _submissionRepository.GetSubmissionByIdAsync(id);
        if (submission == null) return null;

        // Check permissions
        if (isStudent && submission.StudentId != userId)
        {
            return null;
        }

        if (isInstructor && !isAdmin && submission.Assignment.InstructorId != userId)
        {
            return null;
        }

        return await MapToDtoAsync(submission);
    }

    private async Task<SubmissionResponseDto> MapToDtoAsync(Submission submission)
    {
        // Reload with includes if needed
        if (submission.Assignment == null || submission.Student == null || submission.Assignment.Course == null)
        {
            submission = await _submissionRepository.GetSubmissionByIdAsync(submission.Id) ?? submission;
        }

        return new SubmissionResponseDto
        {
            Id = submission.Id,
            AssignmentId = submission.AssignmentId,
            AssignmentTitle = submission.Assignment?.Title ?? string.Empty,
            StudentId = submission.StudentId,
            StudentFirstName = submission.Student?.FirstName ?? string.Empty,
            StudentLastName = submission.Student?.LastName ?? string.Empty,
            CourseName = submission.Assignment?.Course?.CourseName ?? string.Empty,
            SubmissionTitle = submission.SubmissionTitle,
            Solution = submission.Solution,
            GoogleDriveLink = submission.GoogleDriveLink,
            SubmittedAt = submission.SubmittedAt
        };
    }
}
